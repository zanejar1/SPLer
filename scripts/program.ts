import { createTokenMint } from "./create-token-mint";
import { createTokenMetadata } from "./create-token-metadata";
import { createTokenAccount } from "./create-token-account";
import { mintTokens } from "./mint-tokens";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import "dotenv/config";
import { getExplorerLink } from "@solana-developers/helpers";
import { exit } from "process";
import readlineSync from "readline-sync";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";

async function askTokenName(): Promise<string> {
  let name: string;

  do {
    name = readlineSync.question("-> Enter Token Name: ").trim();

    if (!name) {
      console.log("❌ Error: Token name cannot be empty.");
    } else if (name.includes(" ")) {
      console.log("❌ Error: Token name must be a single word without spaces.");
      name = ""; // force retry
    }
  } while (!name);

  return name;
}

async function askTokenSymbol(): Promise<string> {
  let symbol: string;

  do {
    symbol = readlineSync.question("-> Enter Token Symbol: ").trim();

    if (!symbol) {
      console.log("❌ Error: Token symbol cannot be empty.");
    } else if (!/^[A-Z]{2,4}$/.test(symbol)) {
      console.log("❌ Error: Symbol must be 2-4 uppercase letters only.");
      symbol = ""; // force retry
    }
  } while (!symbol);

  return symbol;
}

function askMintAmount(): number {
  let supply: number;

  do {
    supply = readlineSync.questionInt("-> Enter Initial Supply: ");

    if (supply <= 0) {
      console.log("❌ Error: Supply must be a positive number.");
    } else if (supply < 1000 || supply > 1_000_000_000) {
      console.log("❌ Error: Supply must be between 1,000 and 1,000,000,000.");
      supply = 0; // force retry
    }
  } while (supply <= 0);

  return supply;
}

async function main() {
    const user = getKeypairFromEnvironment("ID_SECRET_KEY");
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    console.log("Creating token mint...");
    const tokenMintAccount = await createTokenMint(user, connection);

    console.log("Creating token metadata...");
    const tokenName = await askTokenName();
    const tokenSymbol = await askTokenSymbol();
    await createTokenMetadata(user, connection, tokenMintAccount, tokenName, tokenSymbol);

    console.log("Creating token account...");
    const tokenAccount = await createTokenAccount(user, connection, tokenMintAccount);

    const mintAmount = askMintAmount();
    console.log(`Minting ${mintAmount} tokens to account ${tokenAccount.toBase58()}...`);
    await mintTokens(user, connection, tokenMintAccount, tokenAccount, mintAmount);

    console.log("Checkout your token on the Solana Explorer:");
    const link = getExplorerLink("address", tokenMintAccount.toBase58(), "devnet");
    console.log(link);
    console.log("All done!");
}

main().then(() => exit(0)).catch((error) => {
  console.error(error);
  exit(1);
});