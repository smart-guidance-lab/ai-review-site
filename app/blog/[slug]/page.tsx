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

  // Markdownの行をパースして装飾する関数
  const renderContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      // 見出しの処理
      if (line.startsWith('# ')) return <h1 key={i} style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '2rem', lineHeight: '1.1', color: '#111' }}>{line.replace('# ', '')}</h1>;
      if (line.startsWith('## ')) return <h2 key={i} style={{ fontSize: '1.8rem', fontWeight: '700', marginTop: '3.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>{line.replace('## ', '')}</h2>;
      
      // 表（Pros/Cons）をカード形式に変換する特殊ロジック
      if (line.includes('|')) {
        const cells = line.split('|').map(c => c.trim()).filter(c => c !== '');
        if (cells.length >= 2 && !line.includes('---')) {
          const isPros = line.toLowerCase().includes('pros') || line.toLowerCase().includes('advantage');
          return (
            <div key={i} style={{ 
              display: 'inline-block', width: '48%', minWidth: '300px', verticalAlign: 'top',
              margin: '1%', padding: '1.5rem', borderRadius: '12px', 
              backgroundColor: isPros ? '#f0fff4' : '#fff5f5',
              borderLeft: `5px solid ${isPros ? '#48bb78' : '#f56565'}`,
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
            }}>
              <strong style={{ display: 'block', marginBottom: '0.5rem', color: isPros ? '#2f855a' : '#c53030' }}>
                {isPros ? '▲ PROS / BENEFITS' : '▼ CONS / LIMITATIONS'}
              </strong>
              <div style={{ fontSize: '0.95rem' }}>{line.replace(/.*\|/,'').trim()}</div>
            </div>
          );
        }
        return null;
      }

      // 通常のテキスト
      return <p key={i} style={{ marginBottom: '1.5rem', color: '#333', fontSize: '1.125rem', fontWeight: '400' }}>{line}</p>;
    });
  };

  return (
    <article style={{ backgroundColor: '#fff', minHeight: '100vh', color: '#1a1a1a', selectionColor: '#0070f3' }}>
      <div style={{ maxWidth: '850px', margin: '0 auto', padding: '4rem 2rem' }}>
        <nav style={{ marginBottom: '4rem' }}>
          <a href="/" style={{ textDecoration: 'none', color: '#666', fontSize: '0.9rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            &larr; INDEX / BACK TO REVIEWS
          </a>
        </nav>

        <header style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'inline-block', backgroundColor: '#000', color: '#fff', padding: '0.3rem 0.8rem', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '1rem', letterSpacing: '1px' }}>
            EXCLUSIVE ANALYSIS
          </div>
          {renderContent(content.split('\n')[0]) /* Titleのみ */}
        </header>

        <section style={{ lineHeight: '1.8', fontFamily: 'Georgia, serif' }}>
          {renderContent(content.split('\n').slice(1).join('\n'))}
        </section>

        <footer style={{ marginTop: '6rem', padding: '3rem', borderTop: '2px solid #f0f0f0', textAlign: 'center' }}>
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>AI Insight Global Newsletter</h4>
            <p style={{ fontSize: '0.9rem', color: '#777', marginBottom: '2rem' }}>Subscribe to get daily tool comparisons directly in your inbox.</p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input type="email" placeholder="Your email address" style={{ flex: 1, padding: '0.8rem', borderRadius: '4px', border: '1px solid #ddd' }} />
              <button style={{ backgroundColor: '#000', color: '#fff', padding: '0.8rem 1.5rem', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>JOIN</button>
            </div>
          </div>
        </footer>
      </div>
    </article>
  );
}
