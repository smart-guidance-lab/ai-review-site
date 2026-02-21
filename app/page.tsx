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
          const content = fs.readFileSync(path.join(blogDir, file), 'utf8') || '';
          const titleMatch = content.match(/^#\s+(.*)/m);
          const displayTitle = titleMatch ? titleMatch[1] : slug.replace(/-/g, ' ');
          // ファイル名からタイムスタンプを安全に抽出
          const timestampMatch = file.match(/-(\d+)\.md$/);
          const timestamp = timestampMatch ? parseInt(timestampMatch[1]) : 0;
          return { slug, displayTitle, timestamp };
        } catch (e) { return null; }
      }).filter(a => a !== null).sort((a, b) => b.timestamp - a.timestamp);
    } catch (e) { articles = []; }
  }

  return (
    <main style={{ padding: '4rem 2rem', maxWidth: '1000px', margin: '0 auto', fontFamily: '"Georgia", "Times New Roman", serif', backgroundColor: '#fff', color: '#111', lineHeight: '1.6' }}>
      <header style={{ textAlign: 'left', marginBottom: '6rem', borderBottom: '2px solid #111', paddingBottom: '3rem' }}>
        <h1 style={{ fontSize: 'clamp(2.5rem, 10vw, 5rem)', fontWeight: 'normal', letterSpacing: '-3px', margin: 0, lineHeight: 0.9 }}>AI INSIGHT GLOBAL</h1>
        <p style={{ fontSize: '1.25rem', fontStyle: 'italic', color: '#555', marginTop: '1.5rem', fontWeight: 'lighter' }}>Dispatches from the Sovereign Intelligence Bureau.</p>
      </header>

      <section style={{ display: 'grid', gap: '5rem' }}>
        {articles.length === 0 ? (
          <p style={{ fontStyle: 'italic' }}>The wire is currently silent. Intelligence incoming.</p>
        ) : (
          articles.map(article => (
            <Link key={article.slug} href={`/blog/${article.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
              <article style={{ maxWidth: '750px' }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '3px', color: '#999', display: 'block', marginBottom: '1rem' }}>Dispatch No. {article.slug.slice(-4)}</span>
                <h2 style={{ fontSize: '2.4rem', fontWeight: 'normal', margin: 0, lineHeight: '1.1', cursor: 'pointer', textDecoration: 'none' }}>
                  {article.displayTitle}
                </h2>
                <div style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: '#0070f3', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Read Analysis &rarr;
                </div>
              </article>
            </Link>
          ))
        )}
      </section>

      <footer style={{ marginTop: '12rem', borderTop: '1px solid #eee', paddingTop: '3rem', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', color: '#888', letterSpacing: '1px' }}>
        <span>&copy; 2026 AI INSIGHT GLOBAL</span>
        <span style={{ textTransform: 'uppercase' }}>Established MMXXV</span>
      </footer>
    </main>
  );
}
