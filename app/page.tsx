import Link from 'next/link';
import fs from 'fs';
import path from 'path';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default function Home() {
  const blogDir = path.join(process.cwd(), 'app', 'blog');
  let files: string[] = [];
  if (fs.existsSync(blogDir)) {
    files = fs.readdirSync(blogDir).filter(file => file.endsWith('.md'));
  }

  const articles = files.sort().reverse().map(file => {
    const slug = file.replace('.md', '');
    const filePath = path.join(blogDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    // ファイルの1行目（# タイトル）を抽出して表示名にする
    const titleMatch = content.match(/^#\s+(.*)/m);
    const displayTitle = titleMatch ? titleMatch[1] : slug;
    
    return { slug, displayTitle };
  });

  return (
    <main style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif', backgroundColor: '#fff', color: '#1a1a1a' }}>
      <header style={{ borderBottom: '3px solid #000', marginBottom: '2rem', paddingBottom: '1rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-1px' }}>AI INSIGHT GLOBAL</h1>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>Independent Reviews of the World's Leading AI Tools. {articles.length} reports published.</p>
      </header>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {articles.map(article => (
          <li key={article.slug} style={{ marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
            <Link href={`/blog/${article.slug}`} style={{ color: '#0070f3', textDecoration: 'none', fontSize: '1.4rem', fontWeight: '700' }}>
              {article.displayTitle}
            </Link>
          </li>
        ))}
      </ul>
      
      <footer style={{ marginTop: '5rem', fontSize: '0.8rem', color: '#999', textAlign: 'center' }}>
        &copy; 2026 AI Insight Global. [AD] High-performance AI learning resources available.
      </footer>
    </main>
  );
}