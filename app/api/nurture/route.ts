import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), 'emails.txt');
        if (!fs.existsSync(filePath)) return NextResponse.json({ message: 'No leads' });

        const lines = fs.readFileSync(filePath, 'utf8').split('\n').filter(Boolean);
        const now = new Date();

        for (const line of lines) {
            const [timestamp, email, tags] = line.split(', ');
            const registeredDate = new Date(timestamp);
            const daysDiff = Math.floor((now.getTime() - registeredDate.getTime()) / (1000 * 60 * 60 * 24));

            // 0日目〜6日目のシナリオを選択
            if (daysDiff >= 0 && daysDiff <= 6) {
                await sendNurtureEmail(email, daysDiff, tags);
            }
        }

        return NextResponse.json({ message: 'Nurture Sequence Processed' });
    } catch (error) {
        return NextResponse.json({ message: 'Nurture Failed', error }, { status: 500 });
    }
}

async function sendNurtureEmail(email: string, day: number, tags: string) {
    // ここで各言語・各日のメールテンプレートを読み込む
    // 実際にはResend等の無料APIを叩く
    console.log(`Sending Day ${day} email to ${email} for interests: ${tags}`);
}
