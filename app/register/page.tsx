"use client";

import React, { useState } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import { contractABI, contractAddress } from "@/utils/contract";
import { useTheme } from "../hooks/hooksThemes";
import Link from "next/link";

// Define error interface to replace 'any'
interface RegisterError extends Error {
  message: string;
}

const RegisterPage: React.FC = () => {
  const [nik, setNik] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const handleRegister = async () => {
    setLoading(true);
    setError(null);
    setIsRegistered(false);

    try {
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed.");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const walletAddress = await signer.getAddress();

      if (!nik) {
        throw new Error("NIK is required.");
      }

      // Hash NIK using keccak256
      const nikBytes = ethers.toUtf8Bytes(nik);
      const hashedNIK = ethers.keccak256(nikBytes);

      // Sign the hashed NIK as bytes
      const messageBytes = ethers.getBytes(hashedNIK);
      const signature = await signer.signMessage(messageBytes);

      console.log({
        address: walletAddress,
        hashedNIK,
        signature,
      });

      // Validate with backend
      const validationResponse = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: walletAddress, hashedNIK, signature }),
      });

      const data = await validationResponse.json();

      // Check if user is already registered
      if (validationResponse.status === 409 && data.isRegistered) {
        setIsRegistered(true);
        setError(data.error);
        return;
      }

      if (!validationResponse.ok) {
        throw new Error(data.error || "Failed to validate registration.");
      }

      // Interact with smart contract
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      const tx = await contract.registerUser(hashedNIK, signature);
      await tx.wait();

      router.push("/dashboard");
    } catch (err: unknown) {
      console.error("Registration error:", err);
      const error = err as RegisterError;
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen transition-colors">
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 px-4 py-2 text-sm font-medium rounded-lg shadow-lg bg-blue-500 text-white dark:bg-yellow-500 dark:text-black hover:bg-blue-600 dark:hover:bg-yellow-600 transition-all"
      >
        {theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
      </button>

      <div className="p-6 rounded-2xl shadow-lg w-full max-w-md transform transition-transform duration-300 hover:scale-105">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-yellow-500 dark:text-white">
          Register
        </h1>

        {error && (
          <div
            className={`p-3 rounded mb-4 ${
              isRegistered
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-black"
                : "bg-red-100 text-red-800 dark:bg-red-700 dark:text-white"
            }`}
          >
            <p className="font-semibold">{error}</p>
            {isRegistered && (
              <div className="mt-2">
                <Link
                  href="/login"
                  className="text-blue-700 dark:text-blue-400 font-medium hover:underline"
                >
                  Go to Login
                </Link>
              </div>
            )}
          </div>
        )}

        <div className="mb-6">
          <label
            htmlFor="nik"
            className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            NIK
          </label>
          <input
            type="text"
            id="nik"
            value={nik}
            onChange={(e) => setNik(e.target.value)}
            className="block w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring focus:ring-yellow-300 focus:outline-none dark:focus:ring-yellow-600"
            placeholder="Enter your NIK"
          />
        </div>

        <button
          onClick={handleRegister}
          disabled={loading}
          className={`w-full px-4 py-2 text-white font-bold rounded-lg shadow-md bg-yellow-500 dark:bg-yellow-600 hover:bg-yellow-600 dark:hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-opacity-75 ${
            loading && "opacity-50 cursor-not-allowed"
          }`}
        >
          {loading ? "Registering..." : "Register with MetaMask"}
        </button>
        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
          >
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};
export default RegisterPage;
