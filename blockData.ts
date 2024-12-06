// blockData.ts
import { createPublicClient, http, Block } from "viem";
import { sepolia } from "viem/chains";

// Membuat client untuk mengambil data block
const client = createPublicClient({
  chain: sepolia,
  transport: http(
    "https://eth-sepolia.g.alchemy.com/v2/AAIxRJlEf_mZPpsoPNLgjISEIV2U-xzB"
  ),
});

// Fungsi untuk mendapatkan data block
export const getBlockData = async () => {
  try {
    const latestBlockNumber = await client.getBlockNumber();
    const block: Block = await client.getBlock({
      blockNumber: latestBlockNumber,
    });
    return block;
  } catch (error) {
    console.error("Error fetching block data:", error);
    throw new Error("Error fetching block data.");
  }
};
