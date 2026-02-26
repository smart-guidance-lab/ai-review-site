import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();
        const filePath = path.join(process.cwd(), 'emails.txt');
        
        // メールアドレスを追記（簡易的なDB代わり）
        fs.appendFileSync(filePath, `${new Date().toISOString()}, ${email}\n`);
        
        return NextResponse.json({ message: 'Address Captured Successfully' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Registration Failed' }, { status: 500 });
    }
}
