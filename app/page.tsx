import Link from 'next/link';
import fs from 'fs';
import path from 'path';

// ビルド時（デプロイ時）にファイルを確定させる静的生成（SSG）へ移行
export const revalidate = false; 

export default function Home() {
  const blogDir = path.join(process.cwd(), 'app', 'blog');
  let articles = [];

  if (fs.existsSync(blogDir)) {
    const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.md'));
    
    articles = files.map(file => {
      const slug = file.replace('.md', '');
      const content = fs.readFileSync(path.join(blogDir, file), 'utf8');
      const titleMatch = content.match(/^#\s+(.*)/m);
      const displayTitle = titleMatch ? titleMatch[1] : slug;
      // タイムスタンプをファイル名から抽出してソート用に保持（ai-article-12345.md）
      const timestamp = parseInt(file.split('-').pop()?.replace('.md', '') || '0');
      
      return { slug, displayTitle, timestamp };
    }).sort((a, b) => b.timestamp - a.timestamp); // 最新順にソート
  }

  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'system-ui, sans-serif', lineHeight: '1.6' }}>
      <header style={{ borderBottom: '4px solid #000', marginBottom: '3rem', paddingBottom: '1rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.5rem' }}>AI INSIGHT GLOBAL</h1>
        <p style={{ fontSize: '1.2rem', color: '#444' }}>Deep Dive into the AI Evolution. {articles.length} Exclusive Reports.</p>
      </header>

      <section>
        {articles.length === 0 ? (
          <p>Scanning the latest AI developments... Please check back in a few minutes.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {articles.map(article => (
              <li key={article.slug} style={{ marginBottom: '2rem' }}>
                <Link href={`/blog/${article.slug}`} style={{ color: '#000', textDecoration: 'none', borderLeft: '5px solid #0070f3', paddingLeft: '1rem', display: 'block' }}>
                  <h2 style={{ fontSize: '1.8rem', margin: 0, transition: '0.2s' }}>{article.displayTitle}</h2>
                  <span style={{ fontSize: '0.9rem', color: '#888' }}>Read Full Analysis &rarr;</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
      
      <footer style={{ marginTop: '6rem', borderTop: '1px solid #eee', paddingTop: '2rem', textAlign: 'center' }}>
        <p style={{ color: '#999' }}>&copy; 2026 AI Insight Global. All intelligence verified.</p>
        <div style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem' }}>
          <strong>[AD]</strong> Looking for edge in AI? <a href="#" style={{ color: '#0070f3' }}>Get our Master Intelligence Kit.</a>
        </div>
      </footer>
    </main>
  );
}
