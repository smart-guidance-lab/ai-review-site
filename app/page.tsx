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
    <main style={{ padding: '4rem 2rem', maxWidth: '1000px', margin: '0 auto', fontFamily: '"Georgia", serif', backgroundColor: '#fff', color: '#111', lineHeight: '1.6' }}>
      <header style={{ textAlign: 'left', marginBottom: '6rem', borderBottom: '1px solid #eee', paddingBottom: '3rem' }}>
        <h1 style={{ fontSize: '4.5rem', fontWeight: 'normal', letterSpacing: '-3px', margin: 0, fontFamily: '"Times New Roman", serif' }}>AI INSIGHT GLOBAL</h1>
        <p style={{ fontSize: '1.2rem', fontStyle: 'italic', color: '#555', marginTop: '1rem' }}>Independent dispatches from the digital frontier.</p>
      </header>

      <section style={{ display: 'grid', gap: '4rem' }}>
        {articles.length === 0 ? (
          <p>The wire is silent. Updates expected shortly.</p>
        ) : (
          articles.map(article => (
            <Link key={article.slug} href={`/blog/${article.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <article style={{ cursor: 'pointer', maxWidth: '700px' }}>
                <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', color: '#888' }}>Intelligence Report</span>
                <h2 style={{ fontSize: '2.2rem', fontWeight: 'normal', margin: '0.5rem 0 1rem 0', lineHeight: '1.1', borderBottom: '1px solid transparent', transition: 'border-color 0.3s' }}
                    onMouseOver={(e) => e.currentTarget.style.borderColor = '#000'}
                    onMouseOut={(e) => e.currentTarget.style.borderColor = 'transparent'}>
                  {article.displayTitle}
                </h2>
                <p style={{ color: '#0070f3', fontSize: '0.9rem', fontWeight: 'bold' }}>READ DISPATCH &rarr;</p>
              </article>
            </Link>
          ))
        )}
      </section>

      <footer style={{ marginTop: '10rem', borderTop: '1px solid #000', paddingTop: '2rem', fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between' }}>
        <span>&copy; 2026 AI Insight Global</span>
        <span>The Intelligence of Choice</span>
      </footer>
    </main>
  );
}
