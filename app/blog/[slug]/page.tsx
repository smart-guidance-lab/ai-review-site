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

  // 【究極の重複回避ロジック】タイトルの全文字を数値化
  // 内容が似ていてもタイトルが1文字違えばSeedは数千単位で変わる
  const titleSeed = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // 3つのエンジンをブレンドし、キャッシュを貫通させる
  // 記事ごとに「全く異なる画像」を強制的に引く
  const finalImageUrl = `https://picsum.photos/seed/${titleSeed}/1400/700?grayscale&blur=1`;

  content = content.replace(/\[TARGET_URL:.*?\]/g, '').replace(/\[IMG_KEYWORD:.*?\]/g, '');

  return (
    <article style={{ paddingBottom: '6rem', maxWidth: '100%', margin: '0 auto', fontFamily: '"Georgia", serif', color: '#111', lineHeight: '1.8', backgroundColor: '#fff' }}>
      
      {/* 構造化データ */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": title,
        "image": [finalImageUrl],
        "author": { "@type": "Organization", "name": "AI Insight Global" }
      })}} />

      {/* ビジュアル・ヘッダー: 記事タイトルに紐付いた唯一無二の画像 */}
      <div style={{ position: 'relative', width: '100%', height: '70vh', backgroundColor: '#000', overflow: 'hidden' }}>
        <img 
          src={finalImageUrl} 
          alt={title} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: '0.6' }} 
        />
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 50%)' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: '90%', maxWidth: '1100px', color: '#fff' }}>
          <p style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '8px', marginBottom: '2rem', color: '#aaa' }}>Algorithmic Dispatch #{titleSeed}</p>
          <h1 style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', fontFamily: '"Times New Roman", serif', lineHeight: '1', fontWeight: 'normal', margin: 0, letterSpacing: '-3px' }}>{title}</h1>
        </div>
      </div>

      <div style={{ padding: '6rem 2rem 0', maxWidth: '850px', margin: '0 auto' }}>
        <nav style={{ marginBottom: '6rem' }}>
          <a href="/" style={{ textDecoration: 'none', color: '#000', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '4px', borderBottom: '2px solid #000', paddingBottom: '5px' }}>
            &larr; Archive Directory
          </a>
        </nav>

        <section style={{ marginBottom: '10rem' }}>
          {content.split('\n').map((line, i) => {
            if (line.startsWith('# ')) return null;
            if (line.startsWith('> ')) return <blockquote key={i} style={{ fontSize: '1.7rem', fontStyle: 'italic', color: '#111', borderLeft: '12px solid #000', paddingLeft: '3rem', margin: '5rem 0', lineHeight: '1.2', fontFamily: '"Times New Roman", serif' }}>{line.replace('> ', '')}</blockquote>;
            if (line.startsWith('## ')) return <h2 key={i} style={{ fontSize: '3rem', paddingTop: '4rem', marginTop: '6rem', marginBottom: '3rem', fontFamily: '"Times New Roman", serif', fontWeight: 'normal', borderTop: '5px solid #000', letterSpacing: '-1px' }}>{line.replace('## ', '')}</h2>;
            if (line.trim() === '') return null;
            return <p key={i} style={{ marginBottom: '2.5rem', fontSize: '1.35rem', textAlign: 'justify', color: '#333' }}>{line}</p>;
          })}
        </section>

        <footer style={{ marginTop: '15rem', padding: '10rem 2rem', backgroundColor: '#000', color: '#fff', textAlign: 'center' }}>
          <h3 style={{ fontFamily: '"Times New Roman", serif', fontSize: '3rem', marginBottom: '2rem', fontWeight: 'normal' }}>The Verdict</h3>
          <p style={{ fontSize: '1.2rem', color: '#777', marginBottom: '5rem', maxWidth: '600px', margin: '0 auto 5rem' }}>Analytical cycle complete. Interface with the source below.</p>
          <a href={targetUrl} target="_blank" rel="noopener noreferrer" 
             style={{ display: 'inline-block', border: '1px solid #fff', color: '#fff', padding: '1.5rem 6rem', textDecoration: 'none', fontSize: '1rem', fontWeight: 'bold', letterSpacing: '8px', textTransform: 'uppercase' }}>
            Enter Portal
          </a>
        </footer>
      </div>
    </article>
  );
}
