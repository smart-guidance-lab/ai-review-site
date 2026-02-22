import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const postsDir = path.join(process.cwd(), 'content', 'posts');
  if (!fs.existsSync(postsDir)) return [];
  return fs.readdirSync(postsDir).filter(f => f.endsWith('.md')).map(f => ({ slug: f.replace('.md', '') }));
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolvedParams = await params;
  const filePath = path.join(process.cwd(), 'content', 'posts', `${resolvedParams.slug}.md`);

  if (!fs.existsSync(filePath)) notFound();
  let content = fs.readFileSync(filePath, 'utf8');

  // メタデータ抽出
  const urlMatch = content.match(/\[TARGET_URL:\s*(.*?)\]/);
  const targetUrl = urlMatch ? urlMatch[1].trim() : '/';
  
  const imgMatch = content.match(/\[IMG_KEYWORD:\s*(.*?)\]/);
  const imgKeyword = imgMatch ? imgMatch[1].trim() : 'technology';

  // 【画像進化 3.0】ベースIDを破棄し、キーワード検索ベースのランダム生成へ
  // 記事名からユニークな数値を生成し、それをシードにする
  const seed = resolvedParams.slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const imageUrl = `https://images.unsplash.com/photo-1?auto=format&fit=crop&q=80&w=1400&h=700&sig=${seed}&${imgKeyword}`;
  // 補足: photo-1 はUnsplashの動的エンドポイントとして機能し、sigとキーワードで一意の画像を選ぶ
  const finalImageUrl = `https://source.unsplash.com/featured/1400x700?${imgKeyword}&sig=${seed}`;
  // 上記が不安定な場合、以下の「プロキシ回避URL」を最終解として採用
  const ultraImageUrl = `https://images.unsplash.com/photo-1620712943543-bcc4628c7007?auto=format&fit=crop&q=80&w=1400&h=700&sig=${seed}`; // 初期記事用
  
  // 決定打：unsplashのランダムAPIリダイレクトを使用
  const dynamicUrl = `https://loremflickr.com/1400/700/${imgKeyword}?lock=${seed}`;

  content = content.replace(/\[TARGET_URL:.*?\]/g, '').replace(/\[IMG_KEYWORD:.*?\]/g, '');
  const title = content.match(/# (.*)/)?.[1] || "AI Insight Report";

  return (
    <article style={{ paddingBottom: '6rem', maxWidth: '100%', margin: '0 auto', fontFamily: '"Georgia", serif', color: '#111', lineHeight: '1.8', backgroundColor: '#fff' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": title,
        "image": [dynamicUrl],
        "datePublished": new Date().toISOString(),
        "author": { "@type": "Organization", "name": "AI Insight Global" }
      })}} />

      <div style={{ position: 'relative', width: '100%', height: '65vh', minHeight: '450px', backgroundColor: '#000', overflow: 'hidden' }}>
        <img src={dynamicUrl} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: '0.8' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.9) 100%)' }} />
        <div style={{ position: 'absolute', bottom: '5rem', left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: '1000px', color: '#fff' }}>
          <span style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '6px', display: 'block', marginBottom: '1.5rem', color: '#ccc' }}>Automated Analysis Dispatched</span>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontFamily: '"Times New Roman", serif', lineHeight: '1', fontWeight: 'normal', margin: 0 }}>{title}</h1>
        </div>
      </div>

      <div style={{ padding: '5rem 2.5rem 0', maxWidth: '850px', margin: '0 auto' }}>
        <nav style={{ marginBottom: '5rem', borderBottom: '2px solid #111', paddingBottom: '1rem' }}>
          <a href="/" style={{ textDecoration: 'none', color: '#000', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '3px' }}>
            &larr; Archive Directory
          </a>
        </nav>

        <section>
          {content.split('\n').map((line, i) => {
            if (line.startsWith('# ')) return null;
            if (line.startsWith('> ')) return <blockquote key={i} style={{ fontSize: '1.6rem', fontStyle: 'italic', color: '#222', borderLeft: '10px solid #000', paddingLeft: '3rem', margin: '5rem 0', lineHeight: '1.4', fontFamily: '"Times New Roman", serif' }}>{line.replace('> ', '')}</blockquote>;
            if (line.startsWith('## ')) return <h2 key={i} style={{ fontSize: '2.8rem', paddingTop: '3rem', marginTop: '6rem', marginBottom: '2.5rem', fontFamily: '"Times New Roman", serif', fontWeight: 'normal', borderTop: '4px solid #000' }}>{line.replace('## ', '')}</h2>;
            if (line.trim() === '') return null;
            return <p key={i} style={{ marginBottom: '2.2rem', fontSize: '1.3rem', textAlign: 'justify', color: '#111' }}>{line}</p>;
          })}
        </section>

        <footer style={{ marginTop: '12rem', padding: '10rem 2rem', backgroundColor: '#000', color: '#fff', textAlign: 'center' }}>
          <h3 style={{ fontFamily: '"Times New Roman", serif', fontSize: '2.8rem', marginBottom: '2rem', fontWeight: 'normal' }}>The Final Verdict</h3>
          <p style={{ fontSize: '1.2rem', color: '#888', marginBottom: '4rem', maxWidth: '600px', margin: '0 auto 4rem', lineHeight: '1.6' }}>The data points lead to a singular conclusion. Interface with the entity via the terminal below.</p>
          <a href={targetUrl} target="_blank" rel="noopener noreferrer" 
             style={{ display: 'inline-block', border: '2px solid #fff', color: '#fff', padding: '1.8rem 5rem', textDecoration: 'none', fontSize: '1.1rem', fontWeight: 'bold', letterSpacing: '6px', textTransform: 'uppercase' }}>
            Establish Connection
          </a>
        </footer>
      </div>
    </article>
  );
}
