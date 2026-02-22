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

  // 【究極の重複回避：数学的ビジュアル生成】
  // タイトルの各文字から、色相(Hue)、角度、彩度を算出
  const chars = title.split('');
  const hash = chars.reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue1 = hash % 360;
  const hue2 = (hash * 1.5) % 360;
  const angle = hash % 360;
  const saturation = 30 + (hash % 40); // 30-70% (落ち着いた色調)
  
  // 背景のデザインパターン：タイトルが違えば、グラデーションの重なりが完全に変わる
  const visualStyle = {
    background: `linear-gradient(${angle}deg, hsl(${hue1}, ${saturation}%, 20%) 0%, hsl(${hue2}, ${saturation}%, 10%) 100%)`,
    position: 'relative' as const,
    width: '100%',
    height: '70vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  };

  content = content.replace(/\[TARGET_URL:.*?\]/g, '').replace(/\[IMG_KEYWORD:.*?\]/g, '');

  return (
    <article style={{ paddingBottom: '6rem', maxWidth: '100%', margin: '0 auto', fontFamily: '"Georgia", serif', color: '#111', lineHeight: '1.8', backgroundColor: '#fff' }}>
      
      {/* 構造化データ（画像は動的生成URLの体裁をとる） */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": title,
        "author": { "@type": "Organization", "name": "AI Insight Global" }
      })}} />

      {/* 数学的アート・ヘッダー：外部画像不要 */}
      <div style={visualStyle}>
        {/* 背景に浮遊する抽象的な「知の断片」 */}
        <div style={{
          position: 'absolute',
          width: '150%',
          height: '150%',
          background: `radial-gradient(circle at 30% 30%, hsla(${hue2}, 100%, 50%, 0.1) 0%, transparent 50%)`,
          filter: 'blur(60px)',
        }} />
        
        <div style={{ position: 'relative', zIndex: 2, width: '90%', maxWidth: '1100px', textAlign: 'left', padding: '0 5%' }}>
          <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '8px', marginBottom: '2rem', color: 'rgba(255,255,255,0.5)', fontWeight: 'bold' }}>
            Algorithmic Identity: {hash.toString(16).toUpperCase()}
          </p>
          <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)', fontFamily: '"Times New Roman", serif', lineHeight: '0.9', fontWeight: 'normal', margin: 0, letterSpacing: '-4px', color: '#fff' }}>
            {title}
          </h1>
        </div>
      </div>

      <div style={{ padding: '6rem 2rem 0', maxWidth: '850px', margin: '0 auto' }}>
        <nav style={{ marginBottom: '6rem' }}>
          <a href="/" style={{ textDecoration: 'none', color: '#000', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '4px', borderBottom: '3px solid #000', paddingBottom: '8px' }}>
            &larr; Archive Directory
          </a>
        </nav>

        <section style={{ marginBottom: '12rem' }}>
          {content.split('\n').map((line, i) => {
            if (line.startsWith('# ')) return null;
            if (line.startsWith('> ')) return <blockquote key={i} style={{ fontSize: '1.8rem', fontStyle: 'italic', color: '#000', borderLeft: '15px solid #000', paddingLeft: '3rem', margin: '6rem 0', lineHeight: '1.2', fontFamily: '"Times New Roman", serif' }}>{line.replace('> ', '')}</blockquote>;
            if (line.startsWith('## ')) return <h2 key={i} style={{ fontSize: '3.5rem', paddingTop: '4rem', marginTop: '8rem', marginBottom: '3rem', fontFamily: '"Times New Roman", serif', fontWeight: 'normal', borderTop: '8px solid #000', letterSpacing: '-2px' }}>{line.replace('## ', '')}</h2>;
            if (line.trim() === '') return null;
            return <p key={i} style={{ marginBottom: '2.5rem', fontSize: '1.4rem', textAlign: 'justify', color: '#222' }}>{line}</p>;
          })}
        </section>

        <footer style={{ marginTop: '15rem', padding: '12rem 2rem', backgroundColor: '#000', color: '#fff', textAlign: 'center' }}>
          <h3 style={{ fontFamily: '"Times New Roman", serif', fontSize: '3.5rem', marginBottom: '2.5rem', fontWeight: 'normal' }}>The Verdict</h3>
          <p style={{ fontSize: '1.2rem', color: '#555', marginBottom: '6rem', maxWidth: '600px', margin: '0 auto 6rem', letterSpacing: '1px' }}>Systematic analysis concluded. Access original parameters via the link below.</p>
          <a href={targetUrl} target="_blank" rel="noopener noreferrer" 
             style={{ display: 'inline-block', border: '1px solid #fff', color: '#fff', padding: '1.5rem 8rem', textDecoration: 'none', fontSize: '1rem', fontWeight: 'bold', letterSpacing: '10px', textTransform: 'uppercase' }}>
            Establish Link
          </a>
        </footer>
      </div>
    </article>
  );
}
