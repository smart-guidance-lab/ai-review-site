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
  
  // より安定した画像生成URL（Unsplash Sourceの代替プロトコル）
  const imageUrl = `https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200&h=600&sig=${imgKeyword}`;

  // タグを本文から除去
  content = content.replace(/\[TARGET_URL:.*?\]/g, '').replace(/\[IMG_KEYWORD:.*?\]/g, '');

  return (
    <article style={{ padding: '0 0 8rem 0', maxWidth: '100%', margin: '0 auto', fontFamily: '"Georgia", serif', color: '#111', lineHeight: '1.8', backgroundColor: '#fff' }}>
      
      {/* 究極のカバー画像セクション */}
      <div style={{ 
        width: '100%', 
        height: '60vh', 
        backgroundColor: '#111', 
        position: 'relative', 
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <img 
          src={imageUrl} 
          alt={imgKeyword} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover', 
            filter: 'brightness(0.7) contrast(1.1)',
            transition: 'transform 0.5s ease-in-out'
          }} 
        />
        <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', height: '50%', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}></div>
      </div>

      <div style={{ maxWidth: '800px', margin: '-100px auto 0', position: 'relative', backgroundColor: '#fff', padding: '4rem 3rem', boxShadow: '0 30px 60px rgba(0,0,0,0.1)', borderRadius: '4px' }}>
        <nav style={{ marginBottom: '3rem' }}>
          <a href="/" style={{ textDecoration: 'none', color: '#0070f3', fontSize: '0.85rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '2px' }}>&larr; Index</a>
        </nav>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {content.split('\n').map((line, i) => {
            // タイトル
            if (line.startsWith('# ')) return <h1 key={i} style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontFamily: '"Times New Roman", serif', lineHeight: '1.1', marginBottom: '2.5rem', letterSpacing: '-1.5px', fontWeight: 'normal', color: '#000' }}>{line.replace('# ', '')}</h1>;
            
            // 概要（引用）
            if (line.startsWith('> ')) return <div key={i} style={{ fontSize: '1.3rem', fontStyle: 'italic', color: '#555', borderLeft: '2px solid #0070f3', padding: '0.5rem 0 0.5rem 2rem', margin: '3rem 0', lineHeight: '1.6' }}>{line.replace('> ', '')}</div>;
            
            // 中見出し
            if (line.startsWith('## ')) return <h2 key={i} style={{ fontSize: '2.2rem', borderBottom: '1px solid #000', paddingBottom: '0.5rem', marginTop: '5rem', marginBottom: '2rem', fontFamily: '"Times New Roman", serif', fontWeight: 'normal' }}>{line.replace('## ', '')}</h2>;
            
            if (line.trim() === '') return <div key={i} style={{ height: '1.2rem' }} />;
            
            // 本文
            return <p key={i} style={{ marginBottom: '1.8rem', fontSize: '1.2rem', textAlign: 'justify', hyphens: 'auto' }}>{line}</p>;
          })}
        </div>

        {/* コンバージョン・エリア */}
        <footer style={{ marginTop: '10rem', padding: '5rem 2rem', border: '1px solid #eee', textAlign: 'center', backgroundColor: '#fafafa' }}>
          <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '3px', color: '#999', display: 'block', marginBottom: '1rem' }}>Verdict</span>
          <h3 style={{ fontFamily: '"Times New Roman", serif', fontSize: '2rem', marginBottom: '1.5rem', fontWeight: 'normal' }}>Access the Protocol</h3>
          <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '3rem', maxWidth: '450px', margin: '0 auto 3rem' }}>Deploy this intelligence into your workflow via the official gateway.</p>
          <a href={targetUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', backgroundColor: '#000', color: '#fff', padding: '1.2rem 4rem', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '4px' }}>GO TO OFFICIAL</a>
        </footer>
      </div>
    </article>
  );
}
