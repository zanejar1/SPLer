// This uses "@metaplex-foundation/mpl-token-metadata@2" to create tokens
import "dotenv/config";
import {
  Connection,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { createCreateMetadataAccountV3Instruction } from "@metaplex-foundation/mpl-token-metadata";

export async function createTokenMetadata(user: any, connection: Connection, tokenMintAccount: PublicKey, tokenName: string, tokenSymbol: string) {

    const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s",
    );

    const metadataData = {
    name: tokenName,
    symbol: tokenSymbol,
    // Arweave / IPFS / Pinata etc link using metaplex standard for offchain data
    uri: "https://arweave.net/1234",
    sellerFeeBasisPoints: 0,
    creators: null,
    collection: null,
    uses: null,
    };

    const metadataPDAAndBump = PublicKey.findProgramAddressSync(
    [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        tokenMintAccount.toBuffer(),
    ],
    TOKEN_METADATA_PROGRAM_ID,
    );

    const metadataPDA = metadataPDAAndBump[0];

    const metadataAccountInfo = await connection.getAccountInfo(metadataPDA);
    if (metadataAccountInfo) {
    console.log("Metadata already exists, skipping creation");
    return;
    }

    const transaction = new Transaction();

    const createMetadataAccountInstruction =
    createCreateMetadataAccountV3Instruction(
        {
        metadata: metadataPDA,
        mint: tokenMintAccount,
        mintAuthority: user.publicKey,
        payer: user.publicKey,
        updateAuthority: user.publicKey,
        },
        {
        createMetadataAccountArgsV3: {
            collectionDetails: null,
            data: metadataData,
            isMutable: true,
        },
        },
    );

    transaction.add(createMetadataAccountInstruction);

    const transactionSignature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [user],
    );
    console.log(`✅ Token metadata created with the name ${tokenName} and symbol ${tokenSymbol}`);
    return { transactionSignature };
}