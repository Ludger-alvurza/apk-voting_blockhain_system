import { NextResponse } from "next/server";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "@/utils/contract";

const ContractABI = contractABI;
const ContractAddress = contractAddress;
const keyPrivate = process.env.PRIVATE_KEY;

if (!keyPrivate) {
  throw new Error("PRIVATE_KEY is not set in environment variables.");
}

// Initialize the provider and contract instance
const provider = new ethers.JsonRpcProvider(
  `https://polygon-amoy.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
);
const signer = new ethers.Wallet(keyPrivate, provider);

// Gunakan signer karena kita butuh mengirim transaksi
const contract = new ethers.Contract(ContractAddress, ContractABI, signer);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get("address");

    if (!address) {
      return NextResponse.json({ error: "Address missing" }, { status: 400 });
    }

    // Cek apakah wallet terverifikasi
    const isVerified = await contract.isVerifiedWallet(address);

    return NextResponse.json({ isVerified });
  } catch (error) {
    console.error("Error checking verification status:", error);
    return NextResponse.json(
      { error: "Failed to check verification status" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { address } = await request.json();

    if (!address) {
      console.error("Address not provided.");
      return NextResponse.json(
        { error: "Invalid request, address missing" },
        { status: 400 }
      );
    }

    console.log("Address received:", address);

    // Cek apakah wallet sudah terverifikasi
    const isVerified = await contract.checkWalletVerified(address);
    if (isVerified) {
      return NextResponse.json(
        { message: `Wallet ${address} is already verified.` },
        { status: 400 }
      );
    }

    // Verifikasi wallet
    const tx = await contract.verifyWallet(address);
    console.log("Transaction sent:", tx);
    await tx.wait();
    console.log("Transaction confirmed.");

    return NextResponse.json({
      message: `Wallet ${address} success to verified.`,
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error verifying wallet:", error.message);
      return NextResponse.json(
        { error: "Failed to verify wallet", details: error.message },
        { status: 500 }
      );
    } else {
      console.error("Unknown error:", error);
      return NextResponse.json(
        { error: "Failed to verify wallet", details: "Unknown error" },
        { status: 500 }
      );
    }
  }
}
