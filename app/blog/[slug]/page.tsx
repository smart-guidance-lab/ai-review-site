import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const postsDir = path.join(process.cwd(), 'content', 'posts');
  if (!fs.existsSync(postsDir)) return [];
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));
  return files.map((file) => ({ slug: file.replace('.md', '') }));
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const filePath = path.join(process.cwd(), 'content', 'posts', `${slug}.md`);

  if (!fs.existsSync(filePath)) notFound();

  const content = fs.readFileSync(filePath, 'utf8');

  // セクション解析ロジック
  const lines = content.split('\n');
  const renderedContent = lines.map((line, i) => {
    // 1. タイトル (H1)
    if (line.startsWith('# ')) {
      return <h1 key={i} style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '2rem', letterSpacing: '-1.5px', lineHeight: '1.1' }}>{line.replace('# ', '')}</h1>;
    }
    // 2. 小見出し (H2)
    if (line.startsWith('## ')) {
      return <h2 key={i} style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '3.5rem', marginBottom: '1.5rem', borderLeft: '6px solid #000', paddingLeft: '1rem' }}>{line.replace('## ', '')}</h2>;
    }
    // 3. メリット (PROS)
    if (line.includes('PROS') || line.includes('▲')) {
      return <div key={i} style={{ backgroundColor: '#e6fffa', borderLeft: '4px solid #38b2ac', padding: '1rem', margin: '0.5rem 0', borderRadius: '0 8px 8px 0', fontWeight: '600', color: '#2c7a7b' }}>{line}</div>;
    }
    // 4. デメリット (CONS)
    if (line.includes('CONS') || line.includes('▼')) {
      return <div key={i} style={{ backgroundColor: '#fff5f5', borderLeft: '4px solid #f56565', padding: '1rem', margin: '0.5rem 0', borderRadius: '0 8px 8px 0', fontWeight: '600', color: '#c53030' }}>{line}</div>;
    }
    // 5. 通常テキスト
    return <p key={i} style={{ marginBottom: '1.2rem', color: '#333', fontSize: '1.15rem' }}>{line}</p>;
  });

  return (
    <main style={{ backgroundColor: '#fff', minHeight: '100vh', color: '#000' }}>
      <nav style={{ padding: '1.5rem', borderBottom: '1px solid #eee', position: 'sticky', top: 0, backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', zIndex: 10 }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <a href="/" style={{ textDecoration: 'none', color: '#000', fontWeight: '900', fontSize: '1.2rem' }}>AI INSIGHT GLOBAL</a>
          <span style={{ fontSize: '0.8rem', fontWeight: 'bold', backgroundColor: '#000', color: '#fff', padding: '4px 8px', borderRadius: '4px' }}>VERIFIED REPORT</span>
        </div>
      </nav>

      <article style={{ padding: '4rem 1.5rem', maxWidth: '800px', margin: '0 auto' }}>
        <header style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
            {['TECHNOLOGY', 'AI REVIEW', '2026'].map(tag => (
              <span key={tag} style={{ fontSize: '0.7rem', fontWeight: 'bold', color: '#888', border: '1px solid #eee', padding: '2px 8px', borderRadius: '20px' }}>{tag}</span>
            ))}
          </div>
        </header>

        <section style={{ lineHeight: '1.8' }}>
          {renderedContent}
        </section>

        <footer style={{ marginTop: '6rem', padding: '4rem 2rem', backgroundColor: '#000', color: '#fff', borderRadius: '24px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Subscribe to the Intelligence</h3>
          <p style={{ color: '#aaa', marginBottom: '2rem' }}>Get the next-generation AI analysis delivered to your inbox.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <input type="email" placeholder="email@example.com" style={{ padding: '12px 20px', borderRadius: '8px', border: 'none', width: '250px' }} />
            <button style={{ padding: '12px 24px', borderRadius: '8px', border: 'none', backgroundColor: '#0070f3', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>JOIN</button>
          </div>
        </footer>
      </article>
    </main>
  );
}
