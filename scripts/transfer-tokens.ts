import "dotenv/config";
import {
  getExplorerLink,
} from "@solana-developers/helpers";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import { clusterApiUrl } from "@solana/web3.js";
import readlineSync from "readline-sync";

export async function transferTokens(connection: Connection, sender: Keypair, recipient: PublicKey, tokenMintAccount: PublicKey, amount: number) {

    const MINOR_UNITS_PER_MAJOR_UNITS = Math.pow(10, 2);

    const sourceTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    sender,
    tokenMintAccount,
    sender.publicKey,
    );

    const destinationTokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    sender,
    tokenMintAccount,
    recipient,
    );

    const signature = await transfer(
    connection,
    sender,
    sourceTokenAccount.address,
    destinationTokenAccount.address,
    sender,
    amount * MINOR_UNITS_PER_MAJOR_UNITS,
    );

    const explorerLink = getExplorerLink("transaction", signature, "devnet");

    console.log(`✅ Transaction confirmed, explorer link is: ${explorerLink}`);
}

function askAmountToTransfer(): number {
  let amount: number;

  do {
    amount = readlineSync.questionInt("-> Enter Amount to transfer: ");

    if (amount <= 0) {
      console.log("❌ Error: Amount must be a positive number.");
    } else if (amount > 1_000_000_000) {
      console.log("❌ Error: Transfer Limit exceeded");
      amount = 0; // force retry
    }
  } while (amount <= 0);

  return amount;
}

export function askRecipientAddress(): PublicKey {
  let recipient: PublicKey | null = null;

  while (!recipient) {
    const input = readlineSync.question("-> Enter recipient address: ");

    try {
      recipient = new PublicKey(input); // Try to construct a PublicKey
    } catch (e) {
      console.log("❌ Error: Invalid Solana address. Please try again.");
      recipient = null; // force retry
    }
  }

  return recipient;
}

export function askTokenMintAccount(): PublicKey {
  let mint: PublicKey | null = null;

  while (!mint) {
    const input = readlineSync.question("-> Enter token mint address: ");

    try {
      mint = new PublicKey(input); // Try to construct PublicKey
    } catch (e) {
      console.log("❌ Error: Invalid token mint address. Please try again.");
      mint = null; // force retry
    }
  }
  return mint;
}

async function main() {
  // Connect to cluster
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  // Load wallet keypair from environment variable
  const sender = getKeypairFromEnvironment("ID_SECRET_KEY");

  // Get recipient address from user
  const recipient = askRecipientAddress();

  // Get token mint address from user
  const tokenMintAccount = askTokenMintAccount();

  // Get amount to transfer from user
  const amount = askAmountToTransfer();

  console.log(`💸 Transferring ${amount} tokens to ${recipient.toBase58()}...`);
  try {
    await transferTokens(connection, sender, recipient, tokenMintAccount, amount);
  } catch (error) {
    console.error("❌ Transfer failed");
    return;
  }
  console.log("All done!");
}

main().then(() => process.exit(0)).catch((error) => {
  console.error(error);
  process.exit(1);
});