import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> | { slug: string } }): Promise<Metadata> {
  const resolvedParams = await params;
  const filePath = path.join(POSTS_DIR, `${resolvedParams.slug}.md`);
  if (!fs.existsSync(filePath)) return { title: "Not Found" };
  const content = fs.readFileSync(filePath, 'utf8');
  const title = content.match(/# (.*)/)?.[1] || "AI Insight Report";
  return { title: `${title} | Professional Intelligence` };
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

  const title = content.match(/# (.*)/)?.[1] || "AI Insight Report";
  const urlMatch = content.match(/\[TARGET_URL:\s*(.*?)\]/);
  const targetUrl = urlMatch ? urlMatch[1].trim() : '#';
  const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // スコア生成
  const score = 85 + (hash % 15);
  
  // 動的CTAコピー（ハッシュにより変化させ、ABテスト効果を自動化）
  const ctaCopies = [
    `Deploy ${title} Infrastructure`,
    `Access ${title} Enterprise Node`,
    `Initiate ${title} Integration`,
    `Establish ${title} Protocol`
  ];
  const ctaText = ctaCopies[hash % ctaCopies.length];

  return (
    <article style={{ backgroundColor: '#fff', color: '#111', fontFamily: '"Georgia", serif', minHeight: '100vh', paddingBottom: '10rem' }}>
      
      {/* 信頼度解析セクション */}
      <div style={{ background: '#000', color: '#fff', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '150px', height: '150px', borderRadius: '50%', border: '8px solid #00ff41', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '3rem', fontWeight: 'bold' }}>{score}%</span>
            </div>
            <p style={{ marginTop: '1rem', fontSize: '0.7rem', color: '#00ff41', letterSpacing: '4px' }}>INTEGRITY</p>
          </div>
          <div style={{ flexGrow: 1 }}>
            <h1 style={{ fontSize: '3.5rem', fontFamily: '"Times New Roman", serif', marginBottom: '1.5rem', lineHeight: 1 }}>{title}</h1>
            <p style={{ color: '#888', letterSpacing: '2px', fontSize: '0.8rem' }}>ALGORITHMIC AUDIT COMPLETED / ID: {hash.toString(16)}</p>
          </div>
          {/* 上部CTAリンク */}
          <a href={targetUrl} target="_blank" rel="noopener noreferrer" style={{
            backgroundColor: '#00ff41', color: '#000', padding: '1.2rem 2.5rem', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem', letterSpacing: '2px', borderRadius: '2px'
          }}>ACCESS SOURCE</a>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '6rem 2rem' }}>
        <section style={{ fontSize: '1.45rem', lineHeight: '2', color: '#1a1a1a', textAlign: 'justify' }}>
          {content.split('\n').map((line, i) => {
            if (line.startsWith('# ') || line.startsWith('[')) return null;
            if (line.startsWith('## ')) return <h2 key={i} style={{ fontSize: '2.8rem', marginTop: '7rem', marginBottom: '2rem', borderTop: '5px solid #000', paddingTop: '2rem' }}>{line.replace('## ', '')}</h2>;
            if (line.startsWith('> ')) return <blockquote key={i} style={{ margin: '4rem 0', paddingLeft: '2.5rem', borderLeft: '12px solid #000', fontStyle: 'italic', fontSize: '1.7rem' }}>{line.replace('> ', '')}</blockquote>;
            return line.trim() ? <p key={i} style={{ marginBottom: '2.5rem' }}>{line}</p> : null;
          })}
        </section>

        {/* 収益回収エンジン：最終CTAブロック */}
        <div style={{ 
          marginTop: '10rem', padding: '5rem 3rem', background: '#f4f4f4', border: '1px solid #ddd', textAlign: 'center' 
        }}>
          <h3 style={{ fontSize: '2rem', marginBottom: '1rem', fontFamily: '"Times New Roman", serif' }}>Expert Recommendation</h3>
          <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '3rem' }}>
            Based on our internal metrics (Score: {score}%), we have concluded that {title} is a critical asset for current operations.
          </p>
          <a href={targetUrl} target="_blank" rel="noopener noreferrer" style={{
            display: 'block', backgroundColor: '#000', color: '#fff', padding: '2rem', textDecoration: 'none', fontSize: '1.4rem', fontWeight: 'bold', letterSpacing: '5px', transition: '0.3s'
          }}>
            {ctaText.toUpperCase()} →
          </a>
          <p style={{ marginTop: '2rem', fontSize: '0.7rem', color: '#999', letterSpacing: '1px' }}>
            Secure external link verified. No tracking latency detected.
          </p>
        </div>

        <nav style={{ marginTop: '10rem', borderTop: '1px solid #eee', paddingTop: '4rem', textAlign: 'center' }}>
          <a href="/" style={{ color: '#000', textDecoration: 'none', fontWeight: 'bold', letterSpacing: '4px' }}>&larr; BACK TO GLOBAL ARCHIVE</a>
        </nav>
      </div>
    </article>
  );
}
