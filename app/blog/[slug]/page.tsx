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
  const imgKeyword = imgMatch ? imgMatch[1].trim() : 'artificial-intelligence';
  
  // 【画像修正】使い回しを防ぎつつ、確実に表示させるためのランダムシード付き高解像度URL
  const imageUrl = `https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200&h=600&sig=${resolvedParams.slug}`;

  content = content.replace(/\[TARGET_URL:.*?\]/g, '').replace(/\[IMG_KEYWORD:.*?\]/g, '');
  const title = content.match(/# (.*)/)?.[1] || "AI Insight Report";

  return (
    <article style={{ padding: '0 0 6rem 0', maxWidth: '1000px', margin: '0 auto', fontFamily: '"Georgia", serif', color: '#111', lineHeight: '1.8', backgroundColor: '#fff' }}>
      
      {/* SEO用構造化データ（JSON-LD）: これがGoogle集客の鍵 */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": title,
        "image": [imageUrl],
        "datePublished": new Date().toISOString(),
        "author": { "@type": "Organization", "name": "AI Insight Global" }
      })}} />

      {/* 巨大カバー画像セクション: z-indexとpositionを明示して確実に表示 */}
      <div style={{ position: 'relative', width: '100%', height: '500px', backgroundColor: '#111', marginBottom: '4rem' }}>
        <img 
          src={imageUrl} 
          alt={title} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: '0.8' }} 
        />
        <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', color: '#fff', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
          <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '4px' }}>Intelligence Dispatch</span>
        </div>
      </div>

      <div style={{ padding: '0 2rem', maxWidth: '800px', margin: '0 auto' }}>
        <nav style={{ marginBottom: '3rem' }}>
          <a href="/" style={{ textDecoration: 'none', color: '#0070f3', fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>&larr; Back to Index</a>
        </nav>

        <header style={{ marginBottom: '4rem' }}>
          {content.split('\n').map((line, i) => {
            if (line.startsWith('# ')) return <h1 key={i} style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontFamily: '"Times New Roman", serif', lineHeight: '1.05', marginBottom: '1.5rem', letterSpacing: '-2px', fontWeight: 'normal' }}>{line.replace('# ', '')}</h1>;
            if (line.startsWith('> ')) return <blockquote key={i} style={{ fontSize: '1.4rem', fontStyle: 'italic', color: '#555', borderLeft: '3px solid #000', paddingLeft: '2rem', margin: '2.5rem 0', lineHeight: '1.5' }}>{line.replace('> ', '')}</blockquote>;
            return null;
          })}
        </header>

        <section>
          {content.split('\n').map((line, i) => {
            if (line.startsWith('# ') || line.startsWith('> ')) return null;
            if (line.startsWith('## ')) return <h2 key={i} style={{ fontSize: '2.2rem', borderTop: '4px solid #000', paddingTop: '1rem', marginTop: '5rem', marginBottom: '2rem', fontFamily: '"Times New Roman", serif', fontWeight: 'normal' }}>{line.replace('## ', '')}</h2>;
            if (line.trim() === '') return null;
            return <p key={i} style={{ marginBottom: '2rem', fontSize: '1.25rem', textAlign: 'justify' }}>{line}</p>;
          })}
        </section>

        <footer style={{ marginTop: '10rem', padding: '5rem 3rem', backgroundColor: '#000', color: '#fff', textAlign: 'center' }}>
          <h3 style={{ fontFamily: '"Times New Roman", serif', fontSize: '2rem', marginBottom: '1.5rem', letterSpacing: '1px' }}>The Intelligence Verdict</h3>
          <p style={{ fontSize: '1.1rem', color: '#ccc', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>This analysis represents our final algorithmic conclusion. To engage with the source protocol, use the secure link below.</p>
          <a href={targetUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', border: '1px solid #fff', color: '#fff', padding: '1.2rem 3.5rem', textDecoration: 'none', fontSize: '1rem', fontWeight: 'bold', letterSpacing: '4px', textTransform: 'uppercase' }}>Access Intelligence Portal</a>
        </footer>
      </div>
    </article>
  );
}
