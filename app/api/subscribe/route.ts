import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
    try {
        const { email, topInterests } = await request.json(); // フロントから興味タグを受け取る
        const filePath = path.join(process.cwd(), 'emails.txt');
        
        // 形式: タイムスタンプ, メール, 興味タグ
        const record = `${new Date().toISOString()}, ${email}, [${topInterests.join('|')}]\n`;
        fs.appendFileSync(filePath, record);
        
        return NextResponse.json({ message: 'Segmented Lead Captured' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Process Error' }, { status: 500 });
    }
}
