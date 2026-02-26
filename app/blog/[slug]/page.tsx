import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');

// SEOメタデータの動的生成：Google検索結果の外観を制御
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> | { slug: string } }): Promise<Metadata> {
  const resolvedParams = await params;
  const filePath = path.join(POSTS_DIR, `${resolvedParams.slug}.md`);
  if (!fs.existsSync(filePath)) return { title: "Not Found" };

  const content = fs.readFileSync(filePath, 'utf8');
  const title = content.match(/# (.*)/)?.[1] || "AI Insight Report";
  
  // 本文の「Summary:」以降から150文字を抽出してディスクリプションにする
  const summaryMatch = content.match(/Summary:\s*(.*)/i);
  const description = summaryMatch 
    ? summaryMatch[1].split(/[.!?。]/)[0].slice(0, 150) + '...'
    : `${title}に関する詳細な技術分析と将来予測。AI Insight Globalによる自律的レポート。`;

  return {
    title: `${title} | AI Insight Global`,
    description: description,
    openGraph: {
      title: title,
      description: description,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
    },
  };
}

export async function generateStaticParams() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md')).map(f => ({ slug: f.replace('.md', '') }));
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolvedParams = await params;
  const filePath = path.join(POSTS_DIR, `${resolvedParams.slug}.md`);

  if (!fs.existsSync(filePath)) notFound();
  const content = fs.readFileSync(filePath, 'utf8');

  const urlMatch = content.match(/\[TARGET_URL:\s*(.*?)\]/);
  const targetUrl = urlMatch ? urlMatch[1].trim() : '/';
  const title = content.match(/# (.*)/)?.[1] || "AI Insight Report";

  // ビジュアル用のハッシュ生成
  const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue1 = hash % 360;
  const hue2 = (hash * 1.618) % 360;
  const angle = (hash * 13) % 360;
  const saturation = 15 + (hash % 20);

  return (
    <article style={{ paddingBottom: '10rem', maxWidth: '100%', margin: '0 auto', fontFamily: '"Georgia", serif', color: '#111', lineHeight: '1.8', backgroundColor: '#fff' }}>
      
      {/* 構造化データ: 検索結果にリッチリザルトを表示させる */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": title,
        "description": content.match(/Summary:\s*(.*)/i)?.[1].slice(0, 200),
        "author": { "@type": "Organization", "name": "AI Insight Global" },
        "publisher": { "@type": "Organization", "name": "AI Insight Global" },
        "datePublished": fs.statSync(filePath).birthtime.toISOString()
      })}} />

      {/* ジェネレーティブ・ヘッダー */}
      <div style={{
        background: `linear-gradient(${angle}deg, hsl(${hue1}, ${saturation}%, 12%) 0%, hsl(${hue2}, ${saturation}%, 4%) 100%)`,
        height: '65vh', minHeight: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', width: '160%', height: '160%', background: `radial-gradient(circle at ${hash % 100}% ${ (hash * 7) % 100}%, hsla(${hue1}, 100%, 65%, 0.05) 0%, transparent 60%)`, filter: 'blur(100px)' }} />
        <div style={{ position: 'relative', zIndex: 2, width: '90%', maxWidth: '1200px', padding: '0 5%' }}>
          <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '10px', marginBottom: '2.5rem', color: 'rgba(255,255,255,0.3)', fontWeight: 'bold' }}>Node 0x{hash.toString(16).toUpperCase()}</p>
          <h1 style={{ fontSize: 'clamp(2.5rem, 9vw, 6.5rem)', fontFamily: '"Times New Roman", serif', lineHeight: '0.92', fontWeight: 'normal', margin: 0, letterSpacing: '-5px', color: '#fff' }}>{title}</h1>
        </div>
      </div>

      <div style={{ padding: '8rem 2rem 0', maxWidth: '850px', margin: '0 auto' }}>
        <nav style={{ marginBottom: '10rem' }}>
          <a href="/" style={{ textDecoration: 'none', color: '#000', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '5px', borderBottom: '4px solid #000', paddingBottom: '12px' }}>&larr; Return to Archives</a>
        </nav>

        <section>
          {content.split('\n').map((line, i) => {
            if (line.startsWith('# ') || line.startsWith('[') || line.trim() === '') return null;
            if (line.startsWith('> ')) return <blockquote key={i} style={{ fontSize: '1.9rem', fontStyle: 'italic', color: '#000', borderLeft: '20px solid #000', paddingLeft: '4rem', margin: '7rem 0', lineHeight: '1.1', fontFamily: '"Times New Roman", serif' }}>{line.replace('> ', '')}</blockquote>;
            if (line.startsWith('## ')) return <h2 key={i} style={{ fontSize: '3.8rem', paddingTop: '5rem', marginTop: '12rem', marginBottom: '3.5rem', fontFamily: '"Times New Roman", serif', fontWeight: 'normal', borderTop: '10px solid #000', letterSpacing: '-3px' }}>{line.replace('## ', '')}</h2>;
            return <p key={i} style={{ marginBottom: '3rem', fontSize: '1.5rem', textAlign: 'justify', color: '#111' }}>{line}</p>;
          })}
        </section>

        <footer style={{ marginTop: '15rem', padding: '15rem 2.5rem', backgroundColor: '#000', color: '#fff', textAlign: 'center' }}>
          <h3 style={{ fontFamily: '"Times New Roman", serif', fontSize: '4rem', marginBottom: '3rem', fontWeight: 'normal' }}>The Verdict</h3>
          <a href={targetUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', border: '1px solid #fff', color: '#fff', padding: '1.8rem 10rem', textDecoration: 'none', fontSize: '1rem', fontWeight: 'bold', letterSpacing: '12px', textTransform: 'uppercase' }}>Access Portal</a>
        </footer>
      </div>
    </article>
  );
}
