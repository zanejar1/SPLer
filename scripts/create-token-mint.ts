import { createMint } from "@solana/spl-token"
import "dotenv/config";
import { Connection } from "@solana/web3.js";


export async function createTokenMint(user: any, connection: Connection) {
    let tokenMint;
    try {
        tokenMint = await createMint(connection, user, user.publicKey, null, 2);
    } catch (error) {
        console.error("❌ Failed to create token mint");
        throw error;
    }
    console.log("✅ Token mint created:", tokenMint.toBase58());
    return tokenMint;
}