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
  const imageUrl = `https://source.unsplash.com/featured/1200x600?${imgKeyword},abstract`;

  // タグを本文から除去
  content = content.replace(/\[TARGET_URL:.*?\]/g, '').replace(/\[IMG_KEYWORD:.*?\]/g, '');

  return (
    <article style={{ padding: '0 0 6rem 0', maxWidth: '900px', margin: '0 auto', fontFamily: '"Georgia", serif', color: '#111', lineHeight: '1.8', backgroundColor: '#fff' }}>
      {/* アイキャッチ画像セクション */}
      <div style={{ width: '100%', height: '450px', backgroundColor: '#f0f0f0', marginBottom: '4rem', overflow: 'hidden' }}>
        <img src={imageUrl} alt={imgKeyword} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(20%) brightness(90%)' }} />
      </div>

      <div style={{ padding: '0 2rem' }}>
        <nav style={{ marginBottom: '3rem' }}>
          <a href="/" style={{ textDecoration: 'none', color: '#0070f3', fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>&larr; Back to Index</a>
        </nav>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {content.split('\n').map((line, i) => {
            if (line.startsWith('# ')) return <h1 key={i} style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontFamily: '"Times New Roman", serif', lineHeight: '1', marginBottom: '2rem', letterSpacing: '-2px' }}>{line.replace('# ', '')}</h1>;
            if (line.startsWith('> ')) return <blockquote key={i} style={{ fontSize: '1.4rem', fontStyle: 'italic', color: '#444', borderLeft: '4px solid #000', paddingLeft: '2rem', margin: '3rem 0', lineHeight: '1.4' }}>{line.replace('> ', '')}</blockquote>;
            if (line.startsWith('## ')) return <h2 key={i} style={{ fontSize: '2.2rem', borderTop: '2px solid #000', paddingTop: '1.5rem', marginTop: '4rem', fontFamily: '"Times New Roman", serif' }}>{line.replace('## ', '')}</h2>;
            return <p key={i} style={{ marginBottom: '1.8rem', fontSize: '1.2rem' }}>{line}</p>;
          })}
        </div>

        <footer style={{ marginTop: '10rem', padding: '4rem', border: '1px solid #eee', textAlign: 'center', backgroundColor: '#fafafa' }}>
          <h3 style={{ fontFamily: '"Times New Roman", serif', fontSize: '1.8rem', marginBottom: '1rem' }}>The Intelligence Verdict</h3>
          <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '2.5rem', maxWidth: '500px', margin: '0 auto 2.5rem' }}>Our final analysis suggests direct engagement with this protocol. Explore the official environment below.</p>
          <a href={targetUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', backgroundColor: '#000', color: '#fff', padding: '1.2rem 3rem', textDecoration: 'none', fontSize: '1rem', fontWeight: 'bold', letterSpacing: '3px', transition: 'transform 0.2s' }}>EXPLORE OFFICIAL TOOL</a>
        </footer>
      </div>
    </article>
  );
}
