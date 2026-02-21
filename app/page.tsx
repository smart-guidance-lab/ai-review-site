import Link from 'next/link';
import fs from 'fs';
import path from 'path';

export const revalidate = 0; 

export default function Home() {
  const blogDir = path.join(process.cwd(), 'content', 'posts');
  let articles = [];

  if (fs.existsSync(blogDir)) {
    try {
      const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.md'));
      
      articles = files.map(file => {
        try {
          const slug = file.replace('.md', '');
          const filePath = path.join(blogDir, file);
          const content = fs.readFileSync(filePath, 'utf8') || '';
          
          // タイトルの抽出
          const titleMatch = content.match(/^#\s+(.*)/m);
          const displayTitle = titleMatch ? titleMatch[1] : slug.replace(/-/g, ' ').toUpperCase();
          
          // タイムスタンプの安全な抽出
          const parts = slug.split('-');
          const lastPart = parts[parts.length - 1];
          const timestamp = /^\d+$/.test(lastPart) ? parseInt(lastPart) : 0;
          
          return { slug, displayTitle, timestamp };
        } catch (e) {
          console.error("Single file processing error:", e);
          return null; // 壊れたファイルは無視
        }
      }).filter(a => a !== null).sort((a, b) => b.timestamp - a.timestamp);
    } catch (e) {
      console.error("Directory reading error:", e);
    }
  }

  return (
    <main style={{ padding: '3rem 1.5rem', maxWidth: '900px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#fafafa', minHeight: '100vh', color: '#1a1a1a' }}>
      <header style={{ textAlign: 'center', marginBottom: '4rem', borderBottom: '3px solid #000', paddingBottom: '2.5rem' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 8vw, 3.5rem)', fontWeight: '900', letterSpacing: '-2px', margin: 0 }}>AI INSIGHT GLOBAL</h1>
        <p style={{ fontSize: '1.1rem', color: '#666', marginTop: '1rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>
          Autonomous Intelligence Reports — {articles.length} Published
        </p>
      </header>

      <div style={{ display: 'grid', gap: '2rem' }}>
        {articles.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999' }}>Initializing intelligence feed...</p>
        ) : (
          articles.map(article => (
            <Link key={article.slug} href={`/blog/${article.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <section style={{ backgroundColor: '#fff', padding: '2.5rem', borderRadius: '4px', border: '1px solid #e0e0e0', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '800', margin: '0 0 1rem 0', lineHeight: '1.2' }}>{article.displayTitle}</h2>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
                  <span style={{ color: '#0070f3', fontWeight: 'bold', fontSize: '0.9rem' }}>READ REPORT &rarr;</span>
                  <span style={{ color: '#999', fontSize: '0.75rem', fontFamily: 'monospace' }}>REF: {article.slug.slice(0, 8).toUpperCase()}</span>
                </div>
              </section>
            </Link>
          ))
        )}
      </div>

      <footer style={{ marginTop: '8rem', textAlign: 'center', color: '#999', fontSize: '0.85rem', paddingBottom: '4rem' }}>
        &copy; 2026 AI Insight Global. All reports generated via GPT-4o autonomous protocols.
      </footer>
    </main>
  );
}
