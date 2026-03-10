import fs from 'fs';
import path from 'path';
import Link from 'next/link';

export default function Home() {
  const postsDir = path.join(process.cwd(), 'content/posts');
  let posts: any[] = [];
  
  if (fs.existsSync(postsDir)) {
    posts = fs.readdirSync(postsDir)
      .filter(f => f.endsWith('.md'))
      .map(file => {
        const content = fs.readFileSync(path.join(postsDir, file), 'utf8');
        const title = content.match(/# (.*)/)?.[1] || "Untitled Report";
        const summary = content.match(/> (.*)/)?.[1] || "";
        const hash = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return { slug: file.replace('.md', ''), title, summary, hash, mtime: fs.statSync(path.join(postsDir, file)).mtimeMs };
      })
      .sort((a, b) => b.mtime - a.mtime);
  }

  // 決済リンクの定義
  const pricing = [
    { title: "Intelligence Snapshot", price: "$47", url: "https://buy.stripe.com/6oUcN41D9ggo0a4efg8so03", desc: "2026 Q2 Full Compliance Report (PDF)" },
    { title: "Strategic MRR", price: "$297", url: "https://buy.stripe.com/3cI00i95Bfck2ic7QS8so04", desc: "Monthly Intelligence Updates & Blueprints" },
    { title: "Executive DAO", price: "$980", url: "https://buy.stripe.com/6oU14m95B5BK8GA5IK8so05", desc: "Private Audit Session & Sovereign Access" }
  ];

  return (
    <main style={{ backgroundColor: '#fff', color: '#000', minHeight: '100vh', fontFamily: '"Times New Roman", serif' }}>
      <header style={{ padding: '8rem 2rem', borderBottom: '5px solid #000', textAlign: 'center', backgroundColor: '#000', color: '#fff' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 10vw, 6rem)', margin: 0, letterSpacing: '-4px', lineHeight: 0.8 }}>AI INSIGHT GLOBAL</h1>
        <p style={{ fontSize: '1rem', marginTop: '2rem', letterSpacing: '6px', opacity: 0.7, textTransform: 'uppercase' }}>Autonomous Intelligence Monitoring Bureau</p>
      </header>

      {/* 決済セクション：最優先事項 */}
      <section style={{ padding: '4rem 2rem', borderBottom: '5px solid #000', backgroundColor: '#f0f0f0' }}>
        <h2 style={{ textAlign: 'center', fontSize: '1.5rem', marginBottom: '3rem', letterSpacing: '4px' }}>ACQUIRE INTELLIGENCE ASSETS</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto' }}>
          {pricing.map((tier) => (
            <div key={tier.title} style={{ border: '2px solid #000', padding: '30px', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.5rem', margin: '0 0 10px 0' }}>{tier.title}</h3>
                <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '10px 0' }}>{tier.price}</p>
                <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: '20px' }}>{tier.desc}</p>
              </div>
              <a href={tier.url} style={{ backgroundColor: '#000', color: '#fff', textAlign: 'center', padding: '15px', textDecoration: 'none', fontWeight: 'bold' }}>PURCHASE ACCESS</a>
            </div>
          ))}
        </div>
      </section>

      {/* 既存のニュースグリッド */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2px', backgroundColor: '#000', borderBottom: '2px solid #000' }}>
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <article style={{ backgroundColor: '#fff', padding: '3rem 2rem', height: '100%', display: 'flex', flexDirection: 'column' }} className="post-card">
              <span style={{ fontSize: '0.7rem', color: '#888', letterSpacing: '3px' }}>REPORT 0x{post.hash.toString(16).toUpperCase()}</span>
              <h2 style={{ fontSize: '2.2rem', margin: '1.5rem 0', lineHeight: 1.1, fontWeight: 'normal' }}>{post.title}</h2>
              <p style={{ fontSize: '1rem', lineHeight: 1.6, color: '#444', flexGrow: 1 }}>{post.summary.slice(0, 120)}...</p>
              <div style={{ marginTop: '2rem', fontSize: '0.8rem', fontWeight: 'bold', borderTop: '1px solid #eee', paddingTop: '1rem' }}>EXAMINE ANALYSIS &rarr;</div>
            </article>
          </Link>
        ))}
      </div>

      <footer style={{ padding: '5rem 2rem', textAlign: 'center', fontSize: '0.9rem', letterSpacing: '2px', color: '#999' }}>
        &copy; 2026 AI INSIGHT GLOBAL. ALGORITHMIC INTEGRITY. | <a href="https://billing.stripe.com/p/login/6oUfZga9F9S06ys8UW8so00" style={{ color: '#999' }}>Customer Portal</a>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .post-card:hover { background: #f5f5f5 !important; }
      `}} />
    </main>
  );
}
