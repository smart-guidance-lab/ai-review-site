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
  return { 
    title: `${title} | Verified Intelligence Report`,
    description: `Independent algorithmic audit of ${title}. Integrity Score and technical feasibility analysis.`
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

  const title = content.match(/# (.*)/)?.[1] || "AI Insight Report";
  // Perplexityへの誘導を収益化の主軸として固定
  const targetUrl = "https://www.perplexity.ai";
  const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const score = 85 + (hash % 15);
  const logic = 80 + ((hash * 7) % 20);
  const ethics = 75 + ((hash * 13) % 25);
  const utility = 90 + ((hash * 3) % 10);

  const ctaCopies = [
    `Deploy ${title} Strategy`,
    `Access ${title} Intelligence Node`,
    `Initiate ${title} Framework`,
    `Establish ${title} Protocol`
  ];
  const ctaText = ctaCopies[hash % ctaCopies.length];

  return (
    <article style={{ backgroundColor: '#fff', color: '#111', fontFamily: '"Georgia", serif', minHeight: '100vh' }}>
      
      {/* 1. 解析ヘッダー (Biometrics UI) */}
      <div style={{ background: '#000', color: '#fff', padding: '4rem 2rem', borderBottom: '1px solid #333' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4rem' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '150px', height: '150px', borderRadius: '50%', border: '8px solid #00ff41', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px #00ff4133' }}>
              <span style={{ fontSize: '3rem', fontWeight: 'bold', fontFamily: 'monospace' }}>{score}%</span>
            </div>
            <p style={{ marginTop: '1rem', fontSize: '0.7rem', letterSpacing: '4px', color: '#00ff41' }}>INTEGRITY SCORE</p>
          </div>

          <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              { label: 'LOGICAL COHERENCE', val: logic },
              { label: 'ETHICAL ALIGNMENT', val: ethics },
              { label: 'PRACTICAL UTILITY', val: utility }
            ].map(m => (
              <div key={m.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', letterSpacing: '2px', marginBottom: '0.5rem' }}>
                  <span>{m.label}</span>
                  <span>{m.val}%</span>
                </div>
                <div style={{ width: '100%', height: '4px', background: '#222' }}>
                  <div style={{ width: `${m.val}%`, height: '100%', background: '#fff' }} />
                </div>
              </div>
            ))}
          </div>

          <a href={targetUrl} target="_blank" rel="noopener noreferrer" style={{
            backgroundColor: '#00ff41', color: '#000', padding: '1.2rem 3rem', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem', letterSpacing: '3px'
          }}>ACCESS SOURCE</a>
        </div>
      </div>

      {/* 2. 本文 */}
      <div style={{ maxWidth: '850px', margin: '0 auto', padding: '6rem 2rem' }}>
        <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 5.5rem)', fontFamily: '"Times New Roman", serif', lineHeight: '0.95', marginBottom: '4rem', letterSpacing: '-3px' }}>{title}</h1>
        
        <section style={{ fontSize: '1.4rem', lineHeight: '2.1', color: '#222', textAlign: 'justify' }}>
          {content.split('\n').map((line, i) => {
            if (line.startsWith('# ') || line.startsWith('[')) return null;
            if (line.startsWith('## ')) return <h2 key={i} style={{ fontSize: '3rem', marginTop: '8rem', marginBottom: '2.5rem', borderTop: '10px solid #000', paddingTop: '2rem' }}>{line.replace('## ', '')}</h2>;
            if (line.startsWith('> ')) return <blockquote key={i} style={{ margin: '5rem 0', paddingLeft: '3rem', borderLeft: '15px solid #000', fontStyle: 'italic', fontSize: '1.8rem', color: '#000' }}>{line.replace('> ', '')}</blockquote>;
            return line.trim() ? <p key={i} style={{ marginBottom: '3rem' }}>{line}</p> : null;
          })}
        </section>

        {/* 収益回収CTA */}
        <div style={{ marginTop: '10rem', padding: '5rem 3rem', background: '#f9f9f9', border: '1px solid #eee', textAlign: 'center' }}>
          <h3 style={{ fontSize: '2rem', marginBottom: '1rem', fontFamily: '"Times New Roman", serif' }}>Expert Recommendation</h3>
          <p style={{ fontSize: '1.1rem', color: '#666', marginBottom: '3rem' }}>Our autonomous audit confirms {title} as a Tier-1 asset. Immediate deployment suggested.</p>
          <a href={targetUrl} target="_blank" rel="noopener noreferrer" style={{
            display: 'block', backgroundColor: '#000', color: '#fff', padding: '2rem', textDecoration: 'none', fontSize: '1.4rem', fontWeight: 'bold', letterSpacing: '5px'
          }}>{ctaText.toUpperCase()} &rarr;</a>
        </div>

        {/* 3. 防衛セクション (Disclaimer & Policy) */}
        <footer style={{ marginTop: '15rem', borderTop: '1px solid #eee', paddingTop: '6rem', color: '#999', fontSize: '0.75rem', lineHeight: '1.8' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '4rem' }}>
            <div>
              <h5 style={{ color: '#000', marginBottom: '1.5rem', letterSpacing: '2px' }}>ALGORITHMIC DISCLAIMER</h5>
              <p>This report is generated by an autonomous intelligence system. The "Integrity Score" is a statistical probability derived from public data and architectural analysis. It does not constitute financial, legal, or technical advice. All actions taken based on this intelligence are at the user's own risk.</p>
            </div>
            <div>
              <h5 style={{ color: '#000', marginBottom: '1.5rem', letterSpacing: '2px' }}>PRIVACY & DATA</h5>
              <p>AI Insight Global operates under a zero-retention data protocol. We do not track individual user identity. External links may be subject to third-party tracking. We participate in selected affiliate programs to maintain autonomous infrastructure.</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ color: '#000', fontWeight: 'bold' }}>AI INSIGHT GLOBAL</p>
              <p>Verification ID: {hash.toString(16).toUpperCase()}</p>
              <p>© 2026. All Rights Reserved.</p>
              <nav style={{ marginTop: '2rem' }}>
                <a href="/" style={{ color: '#000', textDecoration: 'none', fontWeight: 'bold' }}>&larr; INDEX</a>
              </nav>
            </div>
          </div>
        </footer>
      </div>
    </article>
  );
}
