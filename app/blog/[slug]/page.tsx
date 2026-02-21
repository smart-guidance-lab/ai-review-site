import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const postsDir = path.join(process.cwd(), 'content', 'posts');
  if (!fs.existsSync(postsDir)) return [];
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
  return files.map((file) => ({
    slug: file.replace('.md', ''),
  }));
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const filePath = path.join(process.cwd(), 'content', 'posts', `${slug}.md`);

  if (!fs.existsSync(filePath)) notFound();
  const rawContent = fs.readFileSync(filePath, 'utf8');

  // データ抽出ロジック：Pros/Consや本文を分離
  const lines = rawContent.split('\n');
  const title = lines.find(l => l.startsWith('# '))?.replace('# ', '') || 'Intelligence Report';
  
  // Pros/Consの行を特定して抽出
  const pros = lines.filter(l => l.includes('PROS') || l.startsWith('- ') && lines.indexOf(l) > lines.findIndex(x => x.includes('PROS')) && lines.indexOf(l) < lines.findIndex(x => x.includes('CONS'))).map(l => l.replace(/^[-\s*▲]+/, '').trim()).filter(l => l && !l.includes('PROS'));
  const cons = lines.filter(l => l.includes('CONS') || l.startsWith('- ') && lines.indexOf(l) > lines.findIndex(x => x.includes('CONS'))).map(l => l.replace(/^[-\s*▼]+/, '').trim()).filter(l => l && !l.includes('CONS'));

  return (
    <article style={{ padding: '2rem 1rem', maxWidth: '850px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1a1a1a', backgroundColor: '#fff' }}>
      {/* ナビゲーション */}
      <nav style={{ marginBottom: '3rem' }}>
        <a href="/" style={{ color: '#0070f3', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
          &larr; BACK TO GLOBAL FEED
        </a>
      </nav>

      {/* ヘッダーセクション */}
      <header style={{ marginBottom: '4rem' }}>
        <div style={{ textTransform: 'uppercase', color: '#0070f3', fontWeight: '900', fontSize: '0.85rem', letterSpacing: '0.1em', marginBottom: '1rem' }}>
          Exclusive Analysis
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', fontWeight: '900', lineHeight: '1.1', margin: 0, letterSpacing: '-0.02em' }}>
          {title}
        </h1>
      </header>

      {/* 比較マトリクスカード（Pros/Cons） */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
        <div style={{ backgroundColor: '#f0f9ff', padding: '2rem', borderRadius: '16px', border: '1px solid #bae6fd' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', color: '#0369a1', fontSize: '1.25rem', display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '0.5rem' }}>✓</span> KEY ADVANTAGES
          </h3>
          <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
            {pros.length > 0 ? pros.map((p, i) => (
              <li key={i} style={{ marginBottom: '0.75rem', fontSize: '1rem', color: '#0c4a6e', display: 'flex' }}>
                <span style={{ marginRight: '0.5rem', opacity: 0.6 }}>•</span> {p}
              </li>
            )) : <li style={{ color: '#666' }}>Analyzing strengths...</li>}
          </ul>
        </div>
        
        <div style={{ backgroundColor: '#fff5f5', padding: '2rem', borderRadius: '16px', border: '1px solid #fee2e2' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', color: '#991b1b', fontSize: '1.25rem', display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '0.5rem' }}>!</span> LIMITATIONS
          </h3>
          <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
            {cons.length > 0 ? cons.map((c, i) => (
              <li key={i} style={{ marginBottom: '0.75rem', fontSize: '1rem', color: '#7f1d1d', display: 'flex' }}>
                <span style={{ marginRight: '0.5rem', opacity: 0.6 }}>•</span> {c}
              </li>
            )) : <li style={{ color: '#666' }}>Analyzing weaknesses...</li>}
          </ul>
        </div>
      </div>

      {/* 本文セクション */}
      <section style={{ fontSize: '1.15rem', lineHeight: '1.8', color: '#334155' }}>
        {lines.filter(l => !l.startsWith('# ') && !l.includes('PROS') && !l.includes('CONS') && !l.startsWith('- ')).map((line, i) => {
          if (line.startsWith('## ')) return <h2 key={i} style={{ fontSize: '1.8rem', color: '#000', marginTop: '3rem', marginBottom: '1.5rem', fontWeight: '800' }}>{line.replace('## ', '')}</h2>;
          if (line.trim() === '') return <br key={i} />;
          return <p key={i} style={{ marginBottom: '1.5rem' }}>{line}</p>;
        })}
      </section>

      {/* フッター広告・購読 */}
      <footer style={{ marginTop: '6rem', padding: '3rem 2rem', backgroundColor: '#1a1a1a', borderRadius: '20px', color: '#fff', textAlign: 'center' }}>
        <h4 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Master the AI Frontier</h4>
        <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Get unbiased intelligence delivered to your inbox.</p>
        <button style={{ backgroundColor: '#fff', color: '#000', border: 'none', padding: '1rem 2rem', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer' }}>
          SUBSCRIBE FREE
        </button>
      </footer>
    </article>
  );
}
