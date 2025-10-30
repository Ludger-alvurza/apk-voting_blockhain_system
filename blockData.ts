import { createPublicClient, http, Block } from "viem";
import { polygonAmoy } from "viem/chains";

const client = createPublicClient({
  chain: polygonAmoy,
  transport: http(
    `https://polygon-amoy.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
  ),
});

export const getBlockData = async () => {
  try {
    const latestBlockNumber = await client.getBlockNumber();
    const block: Block = await client.getBlock({
      blockNumber: latestBlockNumber,
    });
    return block;
  } catch (error) {
    console.error("Error fetching block data:", error);
    return null;
  }
};
export const getBlockByNumber = async (
  blockNumber: bigint
): Promise<Block | null> => {
  try {
    const block: Block = await client.getBlock({ blockNumber });
    return block;
  } catch (error) {
    console.error(
      "Error fetching block data for block number:",
      blockNumber,
      error
    );
    return null;
  }
};
