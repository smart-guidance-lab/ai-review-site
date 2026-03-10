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

  // 【重要】ここにあなたの実際のStripeリンクを貼り付けてください
  const pricing = [
    { title: "Intelligence Snapshot", price: "$47", url: "https://buy.stripe.com/6oUcN41D9ggo0a4efg8so03", desc: "Global AI Compliance Report (CH 1-3)" },
    { title: "Strategic Brief", price: "$297", url: "https://buy.stripe.com/3cI00i95Bfck2ic7QS8so04", desc: "Quarterly Intelligence & Monthly Updates" },
    { title: "Executive DAO", price: "$980", url: "https://buy.stripe.com/6oU14m95B5BK8GA5IK8so05", desc: "Private Audit Session & Strategic Access" }
  ];

  return (
    <main style={{ backgroundColor: '#fff', color: '#000', minHeight: '100vh', fontFamily: '"Times New Roman", serif' }}>
      <header style={{ padding: '6rem 2rem', borderBottom: '5px solid #000', textAlign: 'center', backgroundColor: '#000', color: '#fff' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 10vw, 5rem)', margin: 0, letterSpacing: '-3px' }}>AI INSIGHT GLOBAL</h1>
        <p style={{ fontSize: '0.8rem', marginTop: '1rem', letterSpacing: '5px', opacity: 0.7 }}>AUTONOMOUS INTELLIGENCE MONITORING BUREAU</p>
      </header>

      {/* 決済セクション */}
      <section style={{ padding: '4rem 2rem', borderBottom: '2px solid #000', backgroundColor: '#f9f9f9' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', maxWidth: '1200px', margin: '0 auto' }}>
          {pricing.map((tier) => (
            <div key={tier.title} style={{ border: '1px solid #000', padding: '40px', backgroundColor: '#fff', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '10px', textTransform: 'uppercase' }}>{tier.title}</h3>
              <p style={{ fontSize: '3rem', fontWeight: 'bold', margin: '20px 0' }}>{tier.price}</p>
              <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '30px', minHeight: '40px' }}>{tier.desc}</p>
              <a href={tier.url} style={{ display: 'block', backgroundColor: '#000', color: '#fff', padding: '15px', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 'bold' }}>ACQUIRE ASSET</a>
            </div>
          ))}
        </div>
      </section>

      {/* ニュースグリッド */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2px', backgroundColor: '#000' }}>
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <article style={{ backgroundColor: '#fff', padding: '3rem 2rem', height: '100%', transition: 'background 0.2s' }} className="post-card">
              <span style={{ fontSize: '0.6rem', color: '#aaa', letterSpacing: '2px' }}>DATA_ID: 0x{post.hash.toString(16).toUpperCase()}</span>
              <h2 style={{ fontSize: '1.8rem', margin: '1rem 0', fontWeight: 'normal' }}>{post.title}</h2>
              <p style={{ fontSize: '0.9rem', color: '#444' }}>{post.summary.slice(0, 100)}...</p>
            </article>
          </Link>
        ))}
      </div>

      <footer style={{ padding: '3rem 2rem', textAlign: 'center', fontSize: '0.7rem', color: '#999', letterSpacing: '1px' }}>
        © 2026 AI INSIGHT GLOBAL. ALL ASSETS ENCRYPTED. | <a href="https://billing.stripe.com/p/login/6oUfZga9F9S06ys8UW8so00" style={{ color: '#999' }}>Customer Portal</a>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `.post-card:hover { background: #fafafa !important; }` }} />
    </main>
  );
}
