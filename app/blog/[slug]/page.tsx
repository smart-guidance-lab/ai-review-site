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

  // 【画像進化 2.0】Slugの長さと最終更新時間をシードに活用
  const stats = fs.statSync(filePath);
  const fileHash = resolvedParams.slug.length + stats.mtimeMs;
  
  // Unsplashの公式画像配信エンジン(source.unsplash.comは廃止傾向のため、正規APIスキームを使用)
  // keywordをパスに含め、sigで個体識別を強制
  const imageUrl = `https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1400&h=700&sig=${fileHash}&${imgKeyword}`;

  content = content.replace(/\[TARGET_URL:.*?\]/g, '').replace(/\[IMG_KEYWORD:.*?\]/g, '');
  const title = content.match(/# (.*)/)?.[1] || "AI Insight Report";

  return (
    <article style={{ paddingBottom: '6rem', maxWidth: '100%', margin: '0 auto', fontFamily: '"Georgia", serif', color: '#111', lineHeight: '1.8', backgroundColor: '#fff' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": title,
        "image": [imageUrl],
        "datePublished": stats.birthtime.toISOString(),
        "author": { "@type": "Organization", "name": "AI Insight Global" }
      })}} />

      <div style={{ position: 'relative', width: '100%', height: '65vh', minHeight: '450px', backgroundColor: '#000', overflow: 'hidden' }}>
        <img src={imageUrl} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: '0.75' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.8) 100%)' }} />
        <div style={{ position: 'absolute', bottom: '5rem', left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: '1000px', color: '#fff' }}>
          <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '6px', display: 'block', marginBottom: '1.5rem', color: '#aaa', fontWeight: 'bold' }}>Confidential Intelligence</span>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontFamily: '"Times New Roman", serif', lineHeight: '1', fontWeight: 'normal', margin: 0, textShadow: '0 4px 30px rgba(0,0,0,1)' }}>{title}</h1>
        </div>
      </div>

      <div style={{ padding: '5rem 2.5rem 0', maxWidth: '850px', margin: '0 auto' }}>
        <nav style={{ marginBottom: '5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
          <a href="/" style={{ textDecoration: 'none', color: '#000', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '3px' }}>
            &larr; Archive Directory
          </a>
        </nav>

        <section style={{ marginBottom: '8rem' }}>
          {content.split('\n').map((line, i) => {
            if (line.startsWith('# ')) return null;
            if (line.startsWith('> ')) return <blockquote key={i} style={{ fontSize: '1.6rem', fontStyle: 'italic', color: '#222', borderLeft: '8px solid #000', paddingLeft: '3rem', margin: '5rem 0', lineHeight: '1.3', fontFamily: '"Times New Roman", serif' }}>{line.replace('> ', '')}</blockquote>;
            if (line.startsWith('## ')) return <h2 key={i} style={{ fontSize: '2.8rem', paddingTop: '3rem', marginTop: '6rem', marginBottom: '2.5rem', fontFamily: '"Times New Roman", serif', fontWeight: 'normal', borderTop: '2px solid #000' }}>{line.replace('## ', '')}</h2>;
            if (line.trim() === '') return null;
            return <p key={i} style={{ marginBottom: '2.2rem', fontSize: '1.3rem', textAlign: 'justify', color: '#111', letterSpacing: '0.01em' }}>{line}</p>;
          })}
        </section>

        <footer style={{ marginTop: '12rem', padding: '8rem 2rem', backgroundColor: '#000', color: '#fff', textAlign: 'center' }}>
          <h3 style={{ fontFamily: '"Times New Roman", serif', fontSize: '2.5rem', marginBottom: '1.5rem', fontWeight: 'normal' }}>Verdict</h3>
          <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '4rem', maxWidth: '500px', margin: '0 auto 4rem' }}>End of transmission. Access source node via the link below.</p>
          <a href={targetUrl} target="_blank" rel="noopener noreferrer" 
             style={{ display: 'inline-block', border: '1px solid #fff', color: '#fff', padding: '1.5rem 4rem', textDecoration: 'none', fontSize: '1rem', fontWeight: 'bold', letterSpacing: '5px', textTransform: 'uppercase' }}>
            Open Source Portal
          </a>
        </footer>
      </div>
    </article>
  );
}
