import { mintTo } from "@solana/spl-token";
import "dotenv/config";
import { Connection, PublicKey } from "@solana/web3.js";

export async function mintTokens(user: any, connection: Connection, tokenMintAccount: PublicKey, recipientAssociatedTokenAccount: PublicKey, amount: number) {

    // Our token has two decimal places
    const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10, 2);

    let transactionSignature;
    try {
        transactionSignature = await mintTo(
        connection,
        user,
        tokenMintAccount,
        recipientAssociatedTokenAccount,
        user,
        amount * MINOR_UNITS_PER_MAJOR_UNITS,
        );
    } catch (error) {
        console.error("❌ Failed to mint tokens");
        throw error;
    }

    console.log(`✅ Success! Mint Token Transaction: ${transactionSignature}`);
    return transactionSignature;
}