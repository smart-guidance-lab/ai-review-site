import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';

export default async function PostPage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolvedParams = await params;
  const filePath = path.join(process.cwd(), 'content', 'posts', `${resolvedParams.slug}.md`);
  if (!fs.existsSync(filePath)) notFound();
  const rawContent = fs.readFileSync(filePath, 'utf8');
  
  const title = rawContent.match(/# (.*)/)?.[1] || "Intelligence Report";
  const body = rawContent.replace(/# .*/, '').replace(/\[.*\]/g, '').trim();

  // 【重要】Stripeで個別に作成した3つのURLをここに貼り付けてください
  const PRICING = {
    ENTRY: "https://buy.stripe.com/6oUcN41D9ggo0a4efg8so03",
    CORE: "https://buy.stripe.com/3cI00i95Bfck2ic7QS8so04",
    ULTIMATE: "https://buy.stripe.com/6oU14m95B5BK8GA5IK8so05"
  };

  return (
    <article style={{ maxWidth: '850px', margin: '0 auto', padding: '6rem 2rem', backgroundColor: '#fff' }}>
      <header style={{ borderBottom: '2px solid #111', paddingBottom: '2rem', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3.5rem', fontFamily: '"Playfair Display", serif' }}>{title}</h1>
      </header>

      <section style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '6rem' }}>
        {body.split('\n').map((line, i) => <p key={i}>{line}</p>)}
      </section>

      {/* ティア選択式・決済セクション */}
      <div style={{ background: '#111', color: '#fff', padding: '4rem 2rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '3rem' }}>Select Your Strategic Tier</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
          
          <div style={{ border: '1px solid #444', padding: '2rem' }}>
            <h3>ENTRY</h3>
            <p style={{ fontSize: '2rem' }}>$47</p>
            <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Instant Audit Access</p>
            <a href={PRICING.ENTRY} style={{ display: 'block', background: '#fff', color: '#000', padding: '1rem', marginTop: '2rem', textDecoration: 'none', fontWeight: 'bold' }}>BUY NOW</a>
          </div>

          <div style={{ border: '2px solid #00ff41', padding: '2rem', transform: 'scale(1.05)' }}>
            <span style={{ color: '#00ff41', fontSize: '0.7rem' }}>MOST POPULAR</span>
            <h3>CORE</h3>
            <p style={{ fontSize: '2rem' }}>$297<span style={{ fontSize: '1rem' }}>/mo</span></p>
            <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Strategic Intelligence</p>
            <a href={PRICING.CORE} style={{ display: 'block', background: '#00ff41', color: '#000', padding: '1rem', marginTop: '2rem', textDecoration: 'none', fontWeight: 'bold' }}>SUBSCRIBE</a>
          </div>

          <div style={{ border: '1px solid #444', padding: '2rem' }}>
            <h3>ULTIMATE</h3>
            <p style={{ fontSize: '2rem' }}>$980</p>
            <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>DAO Sovereign Rights</p>
            <a href={PRICING.ULTIMATE} style={{ display: 'block', background: '#fff', color: '#000', padding: '1rem', marginTop: '2rem', textDecoration: 'none', fontWeight: 'bold' }}>INVEST NOW</a>
          </div>

        </div>
      </div>
    </article>
  );
}
