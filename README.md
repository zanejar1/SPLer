# SPLer

## Description

**SPLer** is a client-side program for creating customized SPL tokens on the Solana **Devnet**.  
It allows you to:

- Create a new token with a **custom name**, **symbol**, and **initial supply** minted directly to your wallet.
- Transfer your tokens to other Solana wallets.  

The program interacts with the Solana blockchain using `@solana/web3.js` and `@solana/spl-token` libraries, without deploying any on-chain smart contracts. All token operations are handled client-side.

- Node.js >= 18
- npm
- esrun
- Solana CLI installed and configured
- A wallet keypair saved locally (`.json` file)
- Devnet SOL for fees (request via faucet if needed)

---

## Setup

1. Clone the repository
2. cd the_cloned_repo_name
3. Install the dependencies: npm install
4. Create a .env file in the root folder containing: ID_SECRET_KEY=[YOUR_WALLET_SECRET_KEY_ARRAY]
-> Replace [YOUR_WALLET_SECRET_KEY_ARRAY] with the JSON array from your Solana keypair.


## Running the Program

1. Create a token and mint initial supply
    Type in your terminal: npx esrun scripts/program.ts

    You will be prompted to enter:
        ->Token Name (single word, e.g., HIPHOP)
        ->Token Symbol (2–4 uppercase letters, e.g., HIPH)
        ->Initial Supply (between 1,000 and 1,000,000,000)

    The script will:
        - Create a new token mint
        - Create token metadata
        - Create an associated token account for your wallet
        - Mint the initial supply to your wallet
        - Print a Solana Explorer link for your token

2. Transfer tokens
    Type in your terminal: npx tsx scripts/transfer-tokens.ts

    You will be prompted to enter:
        ->Token Mint (the mint address of your token)
        ->Recipient Wallet (destination wallet address)
        ->Amount to transfer

    The script will send the specified amount of tokens to the recipient’s wallet.

## Solana Devnet CLI Guide

1. Set Solana CLI to devnet:  
   `solana config set --url https://api.devnet.solana.com`  
   Verify network: `solana config get`

2. Create a new wallet/keypair:  
   `solana-keygen new --outfile ~/my-wallet.json`  
   This generates a JSON file with your private key and displays the public key.

3. Switch to an existing wallet:  
   `solana config set --keypair /path/to/other-wallet.json`

4. Request airdrop (devnet SOL) for your wallet:  
   `solana airdrop `

5. Check wallet balance:  
   `solana balance` (for current wallet)  
   `solana balance <WALLET_ADDRESS>` (specific wallet)

6. Copy private key from JSON file for use in `.env`:  
   `cat ~/my-wallet.json` → copy the array of numbers


