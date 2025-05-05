import { NextResponse } from "next/server";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "@/utils/contract";

export async function POST(request: Request) {
  try {
    // Ambil data dari request body
    const { address, hashedNIK, signature } = await request.json();
    console.log("Received request:", { address, hashedNIK, signature });

    // Validasi input
    if (!address || !hashedNIK || !signature) {
      console.error(
        "Validation failed: Missing address, hashedNIK, or signature."
      );
      return NextResponse.json(
        { error: "Address, hashedNIK, and signature are required." },
        { status: 400 }
      );
    }

    try {
      // Create a provider to connect to the blockchain
      // Use environment variable for RPC URL or default to localhost
      const provider = new ethers.JsonRpcProvider(
        `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
      );

      // Connect to the smart contract
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        provider
      );

      // Check if user is already registered by checking if the wallet is verified
      const isVerified = await contract.checkWalletVerified(address);
      if (isVerified) {
        console.log("User already registered with address:", address);
        return NextResponse.json(
          {
            error:
              "NIK, address, dan signature anda sudah terdaftar, silahkan login.",
            isRegistered: true,
          },
          { status: 409 } // 409 Conflict - resource already exists
        );
      }

      // Convert the hashedNIK from hex string to bytes array
      const messageBytes = ethers.getBytes(hashedNIK);

      // Verify the signature using the message bytes
      const recoveredAddress = ethers.verifyMessage(messageBytes, signature);
      console.log("Recovered address from signature:", recoveredAddress);

      // Check if the recovered address matches the address provided
      if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
        console.error("Address mismatch:", {
          providedAddress: address,
          recoveredAddress,
        });
        return NextResponse.json(
          { error: "Invalid signature. Address mismatch." },
          { status: 401 }
        );
      }

      // Send successful validation response
      console.log("Validation successful for address:", address);
      return NextResponse.json({
        message: "Validation successful!",
        instructions:
          "Use the smart contract function `registerUser` to complete registration.",
      });
    } catch (verificationError) {
      console.error("Signature verification error:", verificationError);
      return NextResponse.json(
        {
          error: "Failed to verify signature.",
          details:
            verificationError instanceof Error
              ? verificationError.message
              : String(verificationError),
        },
        { status: 401 }
      );
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Unexpected error in /api/register:", {
        message: error.message,
        stack: error.stack,
      });
      return NextResponse.json(
        { error: "Failed to process registration.", details: error.message },
        { status: 500 }
      );
    } else {
      console.error("Unknown error occurred:", error);
      return NextResponse.json(
        { error: "An unknown error occurred." },
        { status: 500 }
      );
    }
  }
}
