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

  // 【画像排除・数学的アート生成】タイトルの全文字からハッシュ値を算出
  const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // ハッシュから色相(Hue)、彩度(Saturation)、角度(Angle)を導出
  const hue1 = hash % 360;
  const hue2 = (hash * 1.618) % 360; // 黄金比を用いた色相分散
  const angle = (hash * 13) % 360;
  const saturation = 20 + (hash % 30); // 20-50% (彩度を抑え、AI臭を排除した高級感)

  const visualStyle = {
    background: `linear-gradient(${angle}deg, hsl(${hue1}, ${saturation}%, 15%) 0%, hsl(${hue2}, ${saturation}%, 5%) 100%)`,
    position: 'relative' as const,
    width: '100%',
    height: '65vh',
    minHeight: '450px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  };

  content = content.replace(/\[TARGET_URL:.*?\]/g, '').replace(/\[IMG_KEYWORD:.*?\]/g, '');

  return (
    <article style={{ paddingBottom: '8rem', maxWidth: '100%', margin: '0 auto', fontFamily: '"Georgia", serif', color: '#111', lineHeight: '1.8', backgroundColor: '#fff' }}>
      
      {/* ビジュアル・ヘッダー：外部画像サーバーに頼らず、その場で描画 */}
      <div style={visualStyle}>
        {/* 光の断片を模した抽象的なグラデーションレイヤー */}
        <div style={{
          position: 'absolute',
          width: '150%',
          height: '150%',
          background: `radial-gradient(circle at ${hash % 100}% ${ (hash * 7) % 100}%, hsla(${hue1}, 100%, 60%, 0.08) 0%, transparent 50%)`,
          filter: 'blur(80px)',
        }} />
        
        <div style={{ position: 'relative', zIndex: 2, width: '90%', maxWidth: '1100px', textAlign: 'left', padding: '0 5%' }}>
          <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '8px', marginBottom: '2.5rem', color: 'rgba(255,255,255,0.4)', fontWeight: 'bold' }}>
            Identity Hash: {hash.toString(16).toUpperCase()}
          </p>
          <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)', fontFamily: '"Times New Roman", serif', lineHeight: '0.95', fontWeight: 'normal', margin: 0, letterSpacing: '-4px', color: '#fff' }}>
            {title}
          </h1>
        </div>
      </div>

      <div style={{ padding: '6rem 2rem 0', maxWidth: '850px', margin: '0 auto' }}>
        <nav style={{ marginBottom: '8rem' }}>
          <a href="/" style={{ textDecoration: 'none', color: '#000', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '4px', borderBottom: '3px solid #000', paddingBottom: '10px' }}>
            &larr; Archive Directory
          </a>
        </nav>

        <section style={{ marginBottom: '15rem' }}>
          {content.split('\n').map((line, i) => {
            if (line.startsWith('# ')) return null;
            if (line.startsWith('> ')) return <blockquote key={i} style={{ fontSize: '1.8rem', fontStyle: 'italic', color: '#000', borderLeft: '15px solid #000', paddingLeft: '3.5rem', margin: '6rem 0', lineHeight: '1.2', fontFamily: '"Times New Roman", serif' }}>{line.replace('> ', '')}</blockquote>;
            if (line.startsWith('## ')) return <h2 key={i} style={{ fontSize: '3.5rem', paddingTop: '4rem', marginTop: '10rem', marginBottom: '3rem', fontFamily: '"Times New Roman", serif', fontWeight: 'normal', borderTop: '8px solid #000', letterSpacing: '-2px' }}>{line.replace('## ', '')}</h2>;
            if (line.trim() === '') return null;
            return <p key={i} style={{ marginBottom: '3rem', fontSize: '1.45rem', textAlign: 'justify', color: '#111' }}>{line}</p>;
          })}
        </section>

        <footer style={{ marginTop: '15rem', padding: '12rem 2rem', backgroundColor: '#000', color: '#fff', textAlign: 'center' }}>
          <h3 style={{ fontFamily: '"Times New Roman", serif', fontSize: '3.5rem', marginBottom: '2.5rem', fontWeight: 'normal' }}>The Verdict</h3>
          <p style={{ fontSize: '1.2rem', color: '#555', marginBottom: '6rem', maxWidth: '600px', margin: '0 auto 6rem', letterSpacing: '1px' }}>Systematic analysis concluded. Access parameters via the link below.</p>
          <a href={targetUrl} target="_blank" rel="noopener noreferrer" 
             style={{ display: 'inline-block', border: '1px solid #fff', color: '#fff', padding: '1.5rem 8rem', textDecoration: 'none', fontSize: '1rem', fontWeight: 'bold', letterSpacing: '10px', textTransform: 'uppercase' }}>
            Establish Link
          </a>
        </footer>
      </div>
    </article>
  );
}
