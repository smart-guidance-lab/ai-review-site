import Link from 'next/link';
import fs from 'fs';
import path from 'path';

export const revalidate = 0;

export default function Home() {
  const blogDir = path.join(process.cwd(), 'content', 'posts');
  let articles = [];

  if (fs.existsSync(blogDir)) {
    const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.md'));
    articles = files.map(file => {
      const slug = file.replace('.md', '');
      const content = fs.readFileSync(path.join(blogDir, file), 'utf8') || '';
      const titleMatch = content.match(/^#\s+(.*)/m);
      const displayTitle = titleMatch ? titleMatch[1] : slug.replace(/-/g, ' ');
      const timestamp = parseInt(file.split('-').pop() || '0');
      return { slug, displayTitle, timestamp };
    }).sort((a, b) => b.timestamp - a.timestamp);
  }

  return (
    <main style={{ padding: '4rem 2rem', maxWidth: '900px', margin: '0 auto', fontFamily: '"Georgia", "Times New Roman", serif', backgroundColor: '#fff', color: '#111', lineHeight: '1.7' }}>
      <header style={{ marginBottom: '5rem', borderBottom: '2px solid #111', paddingBottom: '2rem' }}>
        <h1 style={{ fontSize: 'clamp(2.5rem, 10vw, 4.5rem)', fontWeight: 'normal', letterSpacing: '-2px', margin: 0 }}>AI INSIGHT GLOBAL</h1>
        <p style={{ fontSize: '1.1rem', fontStyle: 'italic', color: '#555', marginTop: '0.5rem' }}>Autonomous Intelligence Analysis — {articles.length} Reports Published</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
        {articles.length === 0 ? (
          <p>The wire is silent. Updates in progress.</p>
        ) : (
          articles.map(article => (
            <Link key={article.slug} href={`/blog/${article.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
              <article className="article-card" style={{ maxWidth: '750px' }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: '#888' }}>Dispatch</span>
                <h2 style={{ fontSize: '2rem', fontWeight: 'normal', margin: '0.4rem 0 0.8rem 0', lineHeight: '1.15', color: '#000' }}>
                  {article.displayTitle}
                </h2>
                <div style={{ fontSize: '0.9rem', color: '#0070f3', fontWeight: 'bold' }}>EXAMINE REPORT &rarr;</div>
              </article>
            </Link>
          ))
        )}
      </div>

      <footer style={{ marginTop: '8rem', borderTop: '1px solid #eee', paddingTop: '2rem', fontSize: '0.85rem', color: '#999', textAlign: 'center' }}>
        &copy; 2026 AI Insight Global. Independent, algorithmic reporting.
      </footer>
      
      {/* サーバーコンポーネントでホバーエフェクトを実現するためのスタイル注入 */}
      <style dangerouslySetInnerHTML={{ __html: `
        .article-card { transition: opacity 0.2s; }
        .article-card:hover { opacity: 0.7; }
      `}} />
    </main>
  );
}
