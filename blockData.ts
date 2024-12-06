import { createPublicClient, http, Block } from "viem";
import { sepolia } from "viem/chains";

// Membuat client menggunakan Alchemy API key untuk Sepolia
const client = createPublicClient({
  chain: sepolia,
  transport: http(
    "https://eth-sepolia.g.alchemy.com/v2/AAIxRJlEf_mZPpsoPNLgjISEIV2U-xzB"
  ), // Ganti dengan API Key kamu
});

const getBlockData = async () => {
  try {
    const block: Block = await client.getBlock({
      blockNumber: 123456n, // Ganti dengan nomor block yang valid
    });

    console.log(block);
  } catch (error) {
    console.error("Error fetching block data:", error);
  }
};

// Panggil fungsi untuk mendapatkan data block
getBlockData();
