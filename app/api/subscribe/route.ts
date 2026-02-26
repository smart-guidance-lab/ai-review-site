import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
    try {
        const { email, topInterests, lang } = await request.json();
        const filePath = path.join(process.cwd(), 'emails.txt');
        
        // シーケンス開始状態を含めて保存 (email, lang, interest, currentStep, startDate)
        const record = `${email}, ${lang}, ${topInterests[0]}, STEP_1, ${new Date().toISOString()}\n`;
        fs.appendFileSync(filePath, record);
        
        // 本来はここでDay 1のメール送信APIを叩く
        console.log(`Sequence started for ${email} in ${lang}`);
        
        return NextResponse.json({ message: 'Indoctrination Started' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'System Error' }, { status: 500 });
    }
}
