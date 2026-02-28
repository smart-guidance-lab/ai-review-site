import crypto from 'crypto';
import { create } from 'ipfs-http-client'; // IPFSクライアント

const ENCRYPTION_KEY = process.env.PHOENIX_KEY; // 32バイトの秘密鍵

export async function encryptAndBackup(data: string) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // IPFSへのアップロード（分散型ストレージ）
    // 中央サーバーが死んでも、ハッシュを知っていれば世界のどこからでも復元可能
    return {
        hash: "ipfs_hash_placeholder",
        iv: iv.toString('hex'),
        content: encrypted
    };
}
