# Panduan Setup dan Build Project Voting App Blockchain

Dokumen ini menjelaskan langkah-langkah untuk membangun project voting app ini dari awal. Project ini menggunakan Next.js untuk frontend, Solidity untuk smart contract, dan ethers.js untuk interaksi dengan blockchain.

## Prerequisites

Sebelum memulai, pastikan Anda memiliki:

- **Node.js** (versi 18 atau lebih baru) - [Download di sini](https://nodejs.org/)
- **npm** (biasanya sudah terinstall dengan Node.js)
- **MetaMask** atau wallet Ethereum lainnya untuk testing
- **Git** untuk version control

## Langkah 1: Setup Project Next.js

1. Buat project Next.js baru dengan TypeScript, Tailwind CSS, dan ESLint:

```bash
npx create-next-app@latest voting-app --typescript --tailwind --eslint
cd voting-app
```

2. Install dependencies tambahan:

```bash
npm install ethers@^6.13.7 viem@^2.21.44 @radix-ui/react-slot class-variance-authority clsx lucide-react framer-motion motion next-themes react-icons tailwind-merge tailwindcss-animate dotenv
```

3. Install dev dependencies:

```bash
npm install -D @types/node @types/react @types/react-dom @types/json5 @types/prop-types eslint eslint-config-next postcss tailwindcss typescript
```

## Langkah 2: Setup Hardhat untuk Smart Contracts

1. Install Hardhat:

```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox @nomicfoundation/hardhat-ignition-ethers
```

2. Inisialisasi Hardhat:

```bash
npx hardhat init
```

Pilih "Create a TypeScript project" saat diminta.

3. Buat file smart contract `contracts/voting.sol` dengan kode kontrak voting (lihat file `contracts/voting.sol` di project ini).

4. Compile kontrak:

```bash
npx hardhat compile
```

## Langkah 3: Deploy Smart Contract

1. Setup network di `hardhat.config.ts` (contoh untuk local network):

```typescript
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    }
  }
};

export default config;
```

2. Jalankan local node:

```bash
npx hardhat node
```

3. Di terminal baru, deploy kontrak:

```bash
npx hardhat run scripts/deploy.ts --network localhost
```

Atau buat script deploy sederhana di `scripts/deploy.ts`:

```typescript
import { ethers } from "hardhat";

async function main() {
  const Voting = await ethers.getContractFactory("Voting");
  const voting = await Voting.deploy();

  await voting.waitForDeployment();

  console.log("Voting contract deployed to:", await voting.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

4. Catat alamat kontrak yang di-deploy.

## Langkah 4: Setup Environment Variables

1. Buat file `.env.local`:

```
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddressHere
```

Ganti `0xYourContractAddressHere` dengan alamat kontrak yang didapat dari langkah deploy.

## Langkah 5: Setup Frontend Structure

1. Buat struktur folder sesuai project:

```
app/
  api/
    authcheck/
    blockData/
    login/
    logout/
    register/
    verify/
    votes/
  components/
  hooks/
  login/
  register/
  results/
  vote/
  wallet-verify/
components/
contracts/
lib/
utils/
```

2. Copy file-file dari project ini ke struktur yang sesuai.

3. Setup `utils/contract.ts` untuk koneksi ke kontrak (lihat file di project).

4. Setup `utils/ContractABI.json` dengan ABI dari kontrak yang di-compile.

## Langkah 6: Build dan Run

1. Jalankan development server:

```bash
npm run dev
```

2. Buka [http://localhost:3000](http://localhost:3000) di browser.

3. Pastikan MetaMask terhubung ke local network (http://127.0.0.1:8545).

## Langkah 7: Testing

1. Register user baru
2. Verify wallet
3. Add candidates (jika owner)
4. Vote
5. Check results

## Troubleshooting

- Jika ada error koneksi wallet, pastikan MetaMask terinstall dan terhubung ke network yang benar.
- Untuk deploy ke testnet/mainnet, setup network di `hardhat.config.ts` dan gunakan private key dengan saldo ETH.
- Pastikan versi Node.js dan dependencies sesuai.

## Dependencies Utama

- **Next.js**: Framework React untuk frontend
- **ethers.js**: Library untuk interaksi dengan Ethereum
- **viem**: Alternative library untuk Ethereum
- **Tailwind CSS**: Framework CSS
- **Hardhat**: Development environment untuk Ethereum
- **Solidity**: Bahasa pemrograman smart contract

## Struktur Project

- `app/`: Pages dan API routes Next.js
- `contracts/`: Smart contracts Solidity
- `utils/`: Utilities untuk koneksi kontrak
- `components/`: Komponen React reusable
- `hooks/`: Custom hooks React

Untuk informasi lebih detail, lihat kode di masing-masing file.
