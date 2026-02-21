import Link from 'next/link';
import fs from 'fs';
import path from 'path';

export const revalidate = 0; // 常に最新を反映

export default function Home() {
  const blogDir = path.join(process.cwd(), 'content', 'posts');
  let articles = [];

  if (fs.existsSync(blogDir)) {
    const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.md'));
    
    articles = files.map(file => {
      const slug = file.replace('.md', '');
      const content = fs.readFileSync(path.join(blogDir, file), 'utf8');
      const titleMatch = content.match(/^#\s+(.*)/m);
      const displayTitle = titleMatch ? titleMatch[1] : slug.replace(/-/g, ' ').toUpperCase();
      const timestamp = parseInt(file.split('-').pop() || '0');
      
      return { slug, displayTitle, timestamp };
    }).sort((a, b) => b.timestamp - a.timestamp);
  }

  return (
    <main style={{ padding: '3rem 1.5rem', maxWidth: '900px', margin: '0 auto', fontFamily: '"Inter", system-ui, sans-serif', backgroundColor: '#fafafa', minHeight: '100vh' }}>
      <header style={{ textAlign: 'center', marginBottom: '4rem', borderBottom: '2px solid #000', paddingBottom: '2rem' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '900', letterSpacing: '-2px', margin: 0, color: '#000' }}>AI INSIGHT GLOBAL</h1>
        <p style={{ fontSize: '1.1rem', color: '#666', marginTop: '1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
          Intelligence for the Artificial Era — {articles.length} Reports
        </p>
      </header>

      <div style={{ display: 'grid', gap: '2rem' }}>
        {articles.map(article => (
          <Link key={article.slug} href={`/blog/${article.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <section style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '16px', border: '1px solid #eee', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer' }} 
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.shadow = '0 10px 30px rgba(0,0,0,0.1)'; }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '800', margin: '0 0 1rem 0', color: '#1a1a1a', lineHeight: '1.2' }}>{article.displayTitle}</h2>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ color: '#0070f3', fontWeight: 'bold', fontSize: '0.9rem' }}>READ ANALYSIS &rarr;</span>
                <span style={{ color: '#ccc', fontSize: '0.8rem' }}>REPORT #{article.slug.split('-').pop()?.slice(-4)}</span>
              </div>
            </section>
          </Link>
        ))}
      </div>

      <footer style={{ marginTop: '6rem', textAlign: 'center', borderTop: '1px solid #eee', paddingTop: '3rem' }}>
        <p style={{ color: '#999', fontSize: '0.9rem' }}>&copy; 2026 AI Insight Global. Content generated via autonomous intelligence.</p>
      </footer>
    </main>
  );
}
