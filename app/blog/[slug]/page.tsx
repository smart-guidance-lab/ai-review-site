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
  const imgKeyword = imgMatch ? imgMatch[1].trim() : 'tech';

  // 記事固有の画像シード生成
  const seed = resolvedParams.slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const imageUrl = `https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1400&h=700&sig=${seed}`;

  content = content.replace(/\[TARGET_URL:.*?\]/g, '').replace(/\[IMG_KEYWORD:.*?\]/g, '');
  const title = content.match(/# (.*)/)?.[1] || "AI Insight Report";

  return (
    <article style={{ paddingBottom: '6rem', maxWidth: '100%', margin: '0 auto', fontFamily: '"Georgia", serif', color: '#111', lineHeight: '1.8', backgroundColor: '#fff' }}>
      
      {/* 構造化データ */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": title,
        "image": [imageUrl],
        "datePublished": new Date().toISOString(),
        "author": { "@type": "Organization", "name": "AI Insight Global" }
      })}} />

      {/* ビジュアル・ヘッダー */}
      <div style={{ position: 'relative', width: '100%', height: '60vh', minHeight: '400px', backgroundColor: '#000', overflow: 'hidden' }}>
        <img src={imageUrl} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: '0.7' }} />
        <div style={{ position: 'absolute', bottom: '4rem', left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: '1000px', color: '#fff' }}>
          <span style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '5px', display: 'block', marginBottom: '1rem', color: '#ccc' }}>Intelligence Dispatch</span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontFamily: '"Times New Roman", serif', lineHeight: '1.1', fontWeight: 'normal', margin: 0 }}>{title}</h1>
        </div>
      </div>

      <div style={{ padding: '4rem 2rem 0', maxWidth: '800px', margin: '0 auto' }}>
        {/* ナビゲーション: JavaScript不使用 */}
        <nav style={{ marginBottom: '4rem' }}>
          <a href="/" style={{ textDecoration: 'none', color: '#0070f3', fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px' }}>
            &larr; Return to Archives
          </a>
        </nav>

        <section style={{ marginBottom: '6rem' }}>
          {content.split('\n').map((line, i) => {
            if (line.startsWith('# ')) return null;
            if (line.startsWith('> ')) return <blockquote key={i} style={{ fontSize: '1.5rem', fontStyle: 'italic', color: '#333', borderLeft: '5px solid #000', paddingLeft: '2.5rem', margin: '4rem 0', lineHeight: '1.4', fontFamily: '"Times New Roman", serif' }}>{line.replace('> ', '')}</blockquote>;
            if (line.startsWith('## ')) return <h2 key={i} style={{ fontSize: '2.5rem', borderTop: '1px solid #eee', paddingTop: '2.5rem', marginTop: '5rem', marginBottom: '2rem', fontFamily: '"Times New Roman", serif', fontWeight: 'normal' }}>{line.replace('## ', '')}</h2>;
            if (line.trim() === '') return null;
            return <p key={i} style={{ marginBottom: '2rem', fontSize: '1.25rem', textAlign: 'justify' }}>{line}</p>;
          })}
        </section>

        <footer style={{ marginTop: '10rem', padding: '6rem 2rem', backgroundColor: '#111', color: '#fff', textAlign: 'center' }}>
          <h3 style={{ fontFamily: '"Times New Roman", serif', fontSize: '2.2rem', marginBottom: '1.5rem', fontWeight: 'normal' }}>The Intelligence Verdict</h3>
          <p style={{ fontSize: '1.1rem', color: '#999', marginBottom: '3.5rem', maxWidth: '500px', margin: '0 auto 3.5rem' }}>This dispatch concludes our current analysis.</p>
          <a href={targetUrl} target="_blank" rel="noopener noreferrer" 
             style={{ display: 'inline-block', border: '1px solid #fff', color: '#fff', padding: '1.2rem 3.5rem', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '4px', textTransform: 'uppercase' }}>
            Open Official Portal
          </a>
        </footer>
      </div>
    </article>
  );
}
