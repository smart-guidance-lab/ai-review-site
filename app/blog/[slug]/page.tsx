"use client"; // クライアントサイドでの動きが必要なため追加
import React, { useState, useEffect } from 'react';
/* サーバーサイドのfsなどは、Next.js 13+のサーバーコンポーネントとクライアントコンポーネントの分離が必要ですが、
   ここでは一つのファイルで「究極のUI」をシミュレートする構成を示します。 */

export default function PostPage({ params, content, title, hash, score }: any) {
  const [showPopup, setShowPopup] = useState(false);
  const targetUrl = "https://www.perplexity.ai";

  useEffect(() => {
    // 離脱検知（マウスが画面上部に出た時にポップアップ）
    const handleMouseOut = (e: MouseEvent) => {
      if (e.clientY < 0) {
        setShowPopup(true);
        window.removeEventListener('mouseout', handleMouseOut);
      }
    };
    window.addEventListener('mouseout', handleMouseOut);
    return () => window.removeEventListener('mouseout', handleMouseOut);
  }, []);

  return (
    <article style={{ backgroundColor: '#fff', color: '#111', fontFamily: '"Georgia", serif', minHeight: '100vh', position: 'relative' }}>
      
      {/* 既存の権威UI（前回のロジックを継承） */}
      <header style={{ background: '#000', color: '#fff', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '2rem' }}>{title}</h1>
          <div style={{ border: '2px solid #00ff41', padding: '0.5rem 1rem', color: '#00ff41', fontWeight: 'bold' }}>SCORE: {score}%</div>
        </div>
      </header>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem', fontSize: '1.2rem', lineHeight: '1.8' }}>
        {/* 本文表示 */}
        <section dangerouslySetInnerHTML={{ __html: content }} />
        
        {/* メインCTA */}
        <div style={{ marginTop: '5rem', textAlign: 'center' }}>
          <a href={targetUrl} target="_blank" style={{ display: 'inline-block', background: '#000', color: '#fff', padding: '1.5rem 3rem', textDecoration: 'none', fontWeight: 'bold', borderRadius: '50px' }}>
            START ANALYSIS WITH PERPLEXITY &rarr;
          </a>
        </div>
      </div>

      {/* 究極の「リード獲得」ポップアップ */}
      {showPopup && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zValues: 1000
        }}>
          <div style={{
            backgroundColor: '#fff', padding: '4rem', maxWidth: '600px', textAlign: 'center', position: 'relative', border: '10px solid #00ff41'
          }}>
            <button onClick={() => setShowPopup(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', border: 'none', background: 'none', fontSize: '2rem', cursor: 'pointer' }}>&times;</button>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>WAIT! DON'T MISS THIS.</h2>
            <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem' }}>
              Download our <strong>"2026 Secret AI Tool Comparison Matrix (PDF)"</strong>. 
              We reveal the tools that 99% of people are missing.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Lead Captured. (Integration Required)'); setShowPopup(false); }}>
              <input type="email" placeholder="Enter your best email" required style={{ width: '100%', padding: '1rem', marginBottom: '1rem', border: '1px solid #ccc' }} />
              <button type="submit" style={{ width: '100%', padding: '1.5rem', background: '#00ff41', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>
                SEND ME THE PDF NOW
              </button>
            </form>
            <p style={{ marginTop: '1rem', fontSize: '0.7rem', color: '#999' }}>* We value your privacy. No spam, only intelligence.</p>
          </div>
        </div>
      )}
    </article>
  );
}
