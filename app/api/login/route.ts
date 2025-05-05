import { NextResponse } from "next/server";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "@/utils/contract";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    // Get data from request body
    const { address, hashedNIK, signature } = await request.json();
    console.log("Received login request:", { address, hashedNIK });

    // Validate input
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
      const provider = new ethers.JsonRpcProvider(
        `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
      );

      // Connect to the smart contract
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        provider
      );

      // Run these operations in parallel to improve response time
      const [isWalletVerified, userData, recoveredAddress] = await Promise.all([
        contract.checkWalletVerified(address),
        contract.users(address),
        contract.recoverSigner(hashedNIK, signature),
      ]);

      // Check if the wallet is verified
      if (!isWalletVerified) {
        console.log("Wallet is not verified:", address);
        return NextResponse.json(
          { error: "Your wallet is not verified. Please register first." },
          { status: 401 }
        );
      }

      // Check if user is registered
      if (!userData.registered) {
        console.log("User is not registered with address:", address);
        return NextResponse.json(
          { error: "User not registered. Please register first." },
          { status: 404 }
        );
      }

      // Verify that the provided hashedNIK matches the one stored in the contract
      if (userData.hashedNIK !== hashedNIK) {
        console.error("NIK mismatch for address:", address);
        return NextResponse.json(
          { error: "Invalid NIK. Please try again." },
          { status: 401 }
        );
      }

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

      // Check if user has already voted
      const hasVoted = await contract.hasVoted(address);

      // Generate and set auth token
      const authToken = Buffer.from(`${address}:${Date.now()}`).toString(
        "base64"
      );

      // Create response object
      const response = NextResponse.json({
        message: "Login successful!",
        hasVoted,
        redirectURL: hasVoted ? "/results" : "/vote",
      });

      // Set auth cookie
      response.cookies.set({
        name: "auth_token",
        value: authToken,
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 24 hours
      });

      console.log("Login successful for address:", address);
      return response;
    } catch (verificationError) {
      console.error("Verification error:", verificationError);
      return NextResponse.json(
        {
          error: "Failed to verify user data.",
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
      console.error("Unexpected error in /api/login:", {
        message: error.message,
        stack: error.stack,
      });
      return NextResponse.json(
        { error: "Failed to process login.", details: error.message },
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
