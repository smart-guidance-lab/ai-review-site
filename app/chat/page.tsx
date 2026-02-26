"use client";
import React, { useState } from 'react';

export default function ClosingChatPage() {
    const [messages, setMessages] = useState([{ role: 'ai', content: '最終診断を開始します。あなたが現在直面している「AI導入の最大の障壁」は何ですか？' }]);
    const [input, setInput] = useState('');

    const handleSend = async () => {
        const newMessages = [...messages, { role: 'user', content: input }];
        setMessages(newMessages);
        setInput('');
        
        // API呼び出し（簡略化）
        const res = await fetch('/api/chat', {
            method: 'POST',
            body: JSON.stringify({ message: input, history: newMessages, lang: 'Japanese' })
        });
        const data = await res.json();
        setMessages([...newMessages, { role: 'ai', content: data.reply }]);
    };

    return (
        <main style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', padding: '2rem' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{ color: '#00ff41', fontSize: '1rem', letterSpacing: '4px' }}>AI AUDIT: FINAL CONSULTATION</h1>
                    <p style={{ opacity: 0.7 }}>あなたの個別の悩みをAIが解析し、最適解を提示します。</p>
                </header>

                <div style={{ height: '400px', overflowY: 'auto', border: '1px solid #333', padding: '1rem', marginBottom: '2rem' }}>
                    {messages.map((m, i) => (
                        <div key={i} style={{ marginBottom: '1.5rem', textAlign: m.role === 'ai' ? 'left' : 'right' }}>
                            <span style={{ color: m.role === 'ai' ? '#00ff41' : '#fff', fontWeight: 'bold' }}>{m.role.toUpperCase()}: </span>
                            <p style={{ display: 'inline' }}>{m.content}</p>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <input value={input} onChange={(e) => setInput(e.target.value)} style={{ flexGrow: 1, padding: '1rem', background: '#111', color: '#fff', border: '1px solid #333' }} placeholder="メッセージを入力..." />
                    <button onClick={handleSend} style={{ background: '#00ff41', color: '#000', padding: '1rem 2rem', fontWeight: 'bold', border: 'none' }}>SEND</button>
                </div>
            </div>
        </main>
    );
}
