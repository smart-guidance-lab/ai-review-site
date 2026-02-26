'use client';
import { useState, useEffect } from 'react';

export default function LeadCapture() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      // カーソルがウィンドウ上部（タブ移動時）に出た時に発火
      if (e.clientY < 0 && !localStorage.getItem('lead_captured')) {
        setIsVisible(true);
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, []);

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 1000, display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: '2rem'
    }}>
      <div style={{
        backgroundColor: '#fff', color: '#000', padding: '3rem', maxWidth: '500px',
        textAlign: 'center', position: 'relative', border: '5px solid #00ff41'
      }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', fontFamily: '"Times New Roman", serif' }}>WAIT! ANALYSIS INCOMPLETE.</h2>
        <p style={{ marginBottom: '2rem', lineHeight: '1.6' }}>
          離脱前に：専門家が厳選した<b>「2026年最新AIツール比較・格付けPDF」</b>を無料で受け取ってください。
        </p>
        <input 
          type="email" placeholder="Enter your elite email"
          value={email} onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '1rem', marginBottom: '1rem', border: '1px solid #ccc' }}
        />
        <button 
          onClick={() => {
            alert(`Captured: ${email}`); // 実際はここでAPIに送信
            localStorage.setItem('lead_captured', 'true');
            setIsVisible(false);
          }}
          style={{ backgroundColor: '#000', color: '#fff', width: '100%', padding: '1rem', fontWeight: 'bold', cursor: 'pointer' }}
        >
          GET FREE ACCESS (PDF)
        </button>
        <button 
          onClick={() => setIsVisible(false)}
          style={{ marginTop: '1rem', background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '0.8rem' }}
        >
          No thanks, I'll take the risk.
        </button>
      </div>
    </div>
  );
}
