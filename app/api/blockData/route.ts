import { NextResponse } from "next/server";
import { createPublicClient, http, Block } from "viem";
import { sepolia } from "viem/chains";
require("dotenv").config();

const client = createPublicClient({
  chain: sepolia,
  transport: http(
    `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
  ),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const blockNumberParam = searchParams.get("blockNumber");

    let block: Block;
    if (blockNumberParam) {
      const blockNumber = BigInt(blockNumberParam);
      block = await client.getBlock({ blockNumber });
    } else {
      const latestBlockNumber = await client.getBlockNumber();
      block = await client.getBlock({ blockNumber: latestBlockNumber });
    }
    const serializedBlock = JSON.parse(
      JSON.stringify(block, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    return NextResponse.json(serializedBlock);
  } catch (error) {
    console.error("Error fetching block data:", error);
    return NextResponse.json(
      { error: "Failed to fetch block data" },
      { status: 500 }
    );
  }
}
