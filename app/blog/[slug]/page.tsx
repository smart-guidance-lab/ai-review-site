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
  const title = content.match(/# (.*)/)?.[1] || "AI Insight Report";

  // 【数学的アート生成】タイトルの全文字からハッシュ値を算出
  const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // ハッシュから色相(Hue)、彩度(Saturation)、角度(Angle)を導出
  const hue1 = hash % 360;
  const hue2 = (hash * 1.618) % 360; // 黄金比を用いた分散
  const angle = (hash * 13) % 360;
  const saturation = 15 + (hash % 20); // 15-35% (彩度を低く抑え、知性を演出)

  // CSSのみで構成される動的ビジュアル
  const visualStyle = {
    background: `linear-gradient(${angle}deg, hsl(${hue1}, ${saturation}%, 12%) 0%, hsl(${hue2}, ${saturation}%, 4%) 100%)`,
    position: 'relative' as const,
    width: '100%',
    height: '65vh',
    minHeight: '500px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  };

  content = content.replace(/\[TARGET_URL:.*?\]/g, '').replace(/\[IMG_KEYWORD:.*?\]/g, '');

  return (
    <article style={{ paddingBottom: '10rem', maxWidth: '100%', margin: '0 auto', fontFamily: '"Georgia", serif', color: '#111', lineHeight: '1.9', backgroundColor: '#fff' }}>
      
      {/* ビジュアル・ヘッダー：外部画像サーバーに一切頼らない */}
      <div style={visualStyle}>
        {/* 光の断片（オーロラ効果） */}
        <div style={{
          position: 'absolute',
          width: '160%',
          height: '160%',
          background: `radial-gradient(circle at ${hash % 100}% ${ (hash * 7) % 100}%, hsla(${hue1}, 100%, 65%, 0.05) 0%, transparent 60%)`,
          filter: 'blur(100px)',
        }} />
        
        <div style={{ position: 'relative', zIndex: 2, width: '90%', maxWidth: '1200px', textAlign: 'left', padding: '0 5%' }}>
          <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '10px', marginBottom: '2.5rem', color: 'rgba(255,255,255,0.3)', fontWeight: 'bold' }}>
            Reference Node: 0x{hash.toString(16).toUpperCase()}
          </p>
          <h1 style={{ fontSize: 'clamp(2.5rem, 9vw, 6.5rem)', fontFamily: '"Times New Roman", serif', lineHeight: '0.92', fontWeight: 'normal', margin: 0, letterSpacing: '-5px', color: '#fff' }}>
            {title}
          </h1>
        </div>
      </div>

      <div style={{ padding: '8rem 2rem 0', maxWidth: '850px', margin: '0 auto' }}>
        <nav style={{ marginBottom: '10rem' }}>
          <a href="/" style={{ textDecoration: 'none', color: '#000', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '5px', borderBottom: '4px solid #000', paddingBottom: '12px' }}>
            &larr; Archive Directory
          </a>
        </nav>

        <section style={{ marginBottom: '15rem' }}>
          {content.split('\n').map((line, i) => {
            if (line.startsWith('# ')) return null;
            if (line.startsWith('> ')) return <blockquote key={i} style={{ fontSize: '1.9rem', fontStyle: 'italic', color: '#000', borderLeft: '20px solid #000', paddingLeft: '4rem', margin: '7rem 0', lineHeight: '1.1', fontFamily: '"Times New Roman", serif' }}>{line.replace('> ', '')}</blockquote>;
            if (line.startsWith('## ')) return <h2 key={i} style={{ fontSize: '3.8rem', paddingTop: '5rem', marginTop: '12rem', marginBottom: '3.5rem', fontFamily: '"Times New Roman", serif', fontWeight: 'normal', borderTop: '10px solid #000', letterSpacing: '-3px' }}>{line.replace('## ', '')}</h2>;
            if (line.trim() === '') return null;
            return <p key={i} style={{ marginBottom: '3rem', fontSize: '1.5rem', textAlign: 'justify', color: '#111', opacity: 0.9 }}>{line}</p>;
          })}
        </section>

        <footer style={{ marginTop: '15rem', padding: '15rem 2.5rem', backgroundColor: '#000', color: '#fff', textAlign: 'center' }}>
          <h3 style={{ fontFamily: '"Times New Roman", serif', fontSize: '4rem', marginBottom: '3rem', fontWeight: 'normal', letterSpacing: '-2px' }}>The Verdict</h3>
          <p style={{ fontSize: '1.25rem', color: '#444', marginBottom: '8rem', maxWidth: '650px', margin: '0 auto 8rem', letterSpacing: '2px', lineHeight: '1.8' }}>Analytical cycle complete. The integrity of these findings is verified through algorithmic cross-examination.</p>
          <a href={targetUrl} target="_blank" rel="noopener noreferrer" 
             style={{ display: 'inline-block', border: '1px solid #fff', color: '#fff', padding: '1.8rem 10rem', textDecoration: 'none', fontSize: '1rem', fontWeight: 'bold', letterSpacing: '12px', textTransform: 'uppercase', transition: '0.4s' }}>
            Access Source Node
          </a>
        </footer>
      </div>
    </article>
  );
}
