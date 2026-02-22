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

  const title = content.match(/# (.*)/)?.[1] || "Intelligence Report";

  // 【画像排除・数学的アート生成】タイトルの文字コードから固有のハッシュ値を算出
  const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // ハッシュから色相(Hue)、彩度(Saturation)、角度(Angle)を導出
  const hue1 = hash % 360;
  const hue2 = (hash * 1.618) % 360; // 黄金比分散
  const angle = (hash * 13) % 360;
  const saturation = 15 + (hash % 20); // 15-35% (彩度を低く抑え、高級感を演出)

  const visualStyle = {
    background: `linear-gradient(${angle}deg, hsl(${hue1}, ${saturation}%, 15%) 0%, hsl(${hue2}, ${saturation}%, 5%) 100%)`,
    width: '100%',
    height: '60vh',
    minHeight: '400px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative' as const,
    overflow: 'hidden'
  };

  // AI特有のタグを排除
  content = content.replace(/\[TARGET_URL:.*?\]/g, '').replace(/\[IMG_KEYWORD:.*?\]/g, '');

  return (
    <article style={{ paddingBottom: '10rem', maxWidth: '100%', margin: '0 auto', fontFamily: '"Times New Roman", Times, serif', color: '#111', lineHeight: '1.7', backgroundColor: '#fff' }}>
      
      {/* 外部画像を使わず、その場で色を計算する */}
      <div style={visualStyle}>
        <div style={{
          position: 'absolute',
          width: '120%',
          height: '120%',
          background: `radial-gradient(circle at ${hash % 100}% ${ (hash * 7) % 100}%, hsla(${hue1}, 80%, 50%, 0.05) 0%, transparent 60%)`,
          filter: 'blur(100px)',
        }} />
        
        <div style={{ position: 'relative', zIndex: 2, width: '90%', maxWidth: '1000px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '10px', marginBottom: '2.5rem', color: 'rgba(255,255,255,0.3)' }}>
            Protocol ID: {hash.toString(16).toUpperCase()}
          </p>
          <h1 style={{ fontSize: 'clamp(2rem, 7vw, 5rem)', lineHeight: '1', fontWeight: 'normal', margin: 0, color: '#fff', letterSpacing: '-2px' }}>
            {title}
          </h1>
        </div>
      </div>

      <div style={{ padding: '6rem 2rem 0', maxWidth: '800px', margin: '0 auto' }}>
        <nav style={{ marginBottom: '8rem', borderBottom: '1px solid #000', paddingBottom: '1rem' }}>
          <a href="/" style={{ textDecoration: 'none', color: '#000', fontSize: '0.7rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '4px' }}>
            &larr; Archive Directory
          </a>
        </nav>

        <section>
          {content.split('\n').map((line, i) => {
            if (line.startsWith('# ')) return null;
            if (line.startsWith('> ')) return <p key={i} style={{ fontSize: '1.4rem', fontStyle: 'italic', color: '#444', marginBottom: '4rem', lineHeight: '1.5' }}>{line.replace('> ', '')}</p>;
            if (line.startsWith('## ')) return <h2 key={i} style={{ fontSize: '2.5rem', marginTop: '6rem', marginBottom: '2.5rem', fontWeight: 'normal', borderBottom: '2px solid #eee' }}>{line.replace('## ', '')}</h2>;
            if (line.trim() === '') return null;
            return <p key={i} style={{ marginBottom: '2rem', fontSize: '1.3rem', textAlign: 'justify' }}>{line}</p>;
          })}
        </section>

        <footer style={{ marginTop: '15rem', padding: '10rem 2rem', borderTop: '1px solid #eee', textAlign: 'center' }}>
          <p style={{ fontSize: '0.9rem', color: '#888', marginBottom: '4rem', letterSpacing: '2px', textTransform: 'uppercase' }}>End of Dispatch</p>
          <a href="/" style={{ display: 'inline-block', border: '1px solid #000', color: '#000', padding: '1.2rem 4rem', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '5px' }}>
            Return to Node
          </a>
        </footer>
      </div>
    </article>
  );
}
