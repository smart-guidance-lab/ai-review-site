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
      const content = fs.readFileSync(path.join(blogDir, file), 'utf8');
      const titleMatch = content.match(/^#\s+(.*)/m);
      const displayTitle = titleMatch ? titleMatch[1] : slug.split('-').slice(0, -1).join(' ').toUpperCase();
      const timestamp = parseInt(file.split('-').pop() || '0');
      return { slug, displayTitle, timestamp };
    }).sort((a, b) => b.timestamp - a.timestamp);
  }

  return (
    <main style={{ backgroundColor: '#fff', minHeight: '100vh', color: '#000' }}>
      <header style={{ padding: '6rem 1.5rem 4rem', textAlign: 'center', borderBottom: '1px solid #eee' }}>
        <h1 style={{ fontSize: '4rem', fontWeight: '900', letterSpacing: '-3px', marginBottom: '1rem' }}>AI INSIGHTS</h1>
        <p style={{ fontSize: '1rem', letterSpacing: '4px', color: '#666', textTransform: 'uppercase' }}>Global Review Intelligence — {articles.length} Volumes</p>
      </header>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '3rem' }}>
          {articles.map(article => (
            <Link key={article.slug} href={`/blog/${article.slug}`} style={{ textDecoration: 'none', color: 'inherit', group: 'true' }}>
              <article style={{ borderLeft: '1px solid #000', paddingLeft: '1.5rem', transition: '0.3s' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#999', marginBottom: '0.5rem' }}>{new Date(article.timestamp).toLocaleDateString()}</p>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', lineHeight: '1.2', marginBottom: '1rem' }}>{article.displayTitle}</h2>
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold', textDecoration: 'underline' }}>VIEW REPORT &rarr;</span>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
