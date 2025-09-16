import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import "dotenv/config";
import { Connection, PublicKey } from "@solana/web3.js";

export async function createTokenAccount(user: any, connection: Connection, tokenMintAccount: PublicKey) {

    const recipient = user.publicKey;
    
    let tokenAccount;
    try {
        tokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            user,
            tokenMintAccount,
            recipient
        );
    } catch (error) {
        console.error("❌ Failed to create or get token account");
        throw error;
    }
    console.log(`✅ Created token Account: ${tokenAccount.address.toBase58()}`);
    return tokenAccount.address;
}