import { NextResponse } from "next/server";
import { connectToContract } from "@/utils/contract";
require("dotenv").config();

export async function GET() {
  try {
    const contract = await connectToContract();

    if (!contract) {
      return NextResponse.json(
        { error: "Ethereum wallet not found" },
        { status: 400 }
      );
    }

    const candidates = await contract.getAllCandidates();
    return NextResponse.json(candidates);
  } catch (error) {
    console.error("Error fetching data from contract:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
