"use client";

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTheme } from "../hooks/hooksThemes";

const LoginPage: React.FC = () => {
  const [nik, setNik] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "error" | "info" | "success";
  } | null>(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  // Check if wallet is connected on page load
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        try {
          // Check if already connected
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.listAccounts();

          if (accounts.length > 0) {
            setWalletConnected(true);
            setWalletAddress(accounts[0].address);
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
        }
      }
    };

    checkWalletConnection();
  }, []);

  const connectWallet = async () => {
    setLoading(true);
    setMessage(null);

    try {
      if (!window.ethereum) {
        throw new Error(
          "MetaMask is not installed. Please install MetaMask to continue."
        );
      }

      // Request account access
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();

      if (accounts.length > 0) {
        setWalletConnected(true);
        setWalletAddress(accounts[0].address);
        setMessage({
          text: "Wallet connected. Please enter your NIK to login.",
          type: "success",
        });
      } else {
        throw new Error("No accounts found. Please connect to MetaMask.");
      }
    } catch (err: any) {
      console.error("Connect wallet error:", err);
      setMessage({ text: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    setMessage(null);

    try {
      if (!walletConnected) {
        throw new Error("Please connect your wallet first.");
      }

      if (!nik) {
        throw new Error("NIK is required.");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      // Hash NIK using keccak256
      const nikBytes = ethers.toUtf8Bytes(nik);
      const hashedNIK = ethers.keccak256(nikBytes);

      // Sign the hashed NIK
      const messageBytes = ethers.getBytes(hashedNIK);
      const signature = await signer.signMessage(messageBytes);

      console.log("Login attempt:", {
        address,
        hashedNIK,
      });

      // Set loading message to keep user informed
      setMessage({
        text: "Validating your credentials with blockchain...",
        type: "info",
      });

      // Send data to backend for validation
      const loginResponse = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, hashedNIK, signature }),
      });

      const data = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error(data.error || "Login failed.");
      }

      // Save authentication data to sessionStorage for future use
      sessionStorage.setItem(
        "auth",
        JSON.stringify({
          address,
          timestamp: Date.now(),
          redirectURL: data.redirectURL,
        })
      );

      // Show success message and redirect immediately
      setMessage({ text: "Login successful! Redirecting...", type: "success" });

      // Redirect without delay
      router.push(data.redirectURL || "/vote");
    } catch (err: any) {
      console.error("Login error:", err);
      setMessage({ text: err.message, type: "error" });
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
        <h1 className="text-3xl font-bold mb-6 text-center">E-Voting Login</h1>

        {message && (
          <div
            className={`p-4 rounded-lg mb-6 ${
              message.type === "error"
                ? "bg-red-100 text-red-700"
                : message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {message.text}
          </div>
        )}

        {!walletConnected ? (
          <button
            onClick={connectWallet}
            disabled={loading}
            className={`w-full px-4 py-3 text-white font-semibold rounded-lg shadow-md bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75 ${
              loading && "opacity-50 cursor-not-allowed"
            }`}
          >
            {loading ? "Connecting..." : "Connect MetaMask"}
          </button>
        ) : (
          <>
            <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm break-all">
              <span className="font-medium text-gray-700">
                Connected Wallet:
              </span>
              <div className="text-blue-600">{walletAddress}</div>
            </div>

            <div className="mb-6">
              <label
                htmlFor="nik"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                NIK (National ID Number)
              </label>
              <input
                type="text"
                id="nik"
                value={nik}
                onChange={(e) => setNik(e.target.value)}
                className="block w-full px-4 py-3 border rounded-lg shadow-sm focus:ring focus:ring-blue-300 focus:border-blue-300"
                placeholder="Enter your NIK"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && nik) {
                    handleLogin();
                  }
                }}
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className={`w-full px-4 py-2 text-white font-bold rounded-lg shadow-md bg-yellow-500 dark:bg-yellow-600 hover:bg-yellow-600 dark:hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-opacity-75 ${
                loading && "opacity-50 cursor-not-allowed"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </>
        )}

        <div className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link href="/register" className="text-yellow-600 hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
