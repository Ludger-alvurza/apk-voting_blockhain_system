"use client";
import React, { useState } from "react";
import { useTheme } from "../hooks/hooksThemes";

const VerifyWallet = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [message, setMessage] = useState("");
  const { theme, toggleTheme } = useTheme();

  const handleVerify = async () => {
    try {
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address: walletAddress }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message); // Wallet berhasil diverifikasi
      } else if (response.status === 400 && data.message) {
        setMessage(data.message); // Wallet sudah terverifikasi
      } else {
        setMessage(data.error || "Gagal memverifikasi wallet."); // Kesalahan lainnya
      }
    } catch (error) {
      setMessage("Terjadi kesalahan saat mencoba memverifikasi wallet.");
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen transition-colors duration-300 ${
        theme === "light" ? "bg-gray-100" : "bg-gray-900"
      }`}
    >
      <button
        onClick={toggleTheme}
        className={`px-4 py-2 font-medium rounded-lg transition duration-300 ${
          theme === "light"
            ? "bg-blue-500 text-white"
            : "bg-yellow-500 text-black"
        }`}
      >
        {theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
      </button>
      <div
        className={`w-full max-w-md shadow-lg rounded-2xl p-6 transition-colors duration-300 ${
          theme === "light"
            ? "bg-white text-gray-700"
            : "bg-gray-800 text-gray-300"
        }`}
      >
        <h1 className="text-2xl font-semibold text-center">
          Verifikasi Wallet
        </h1>
        <p className="text-center mb-6">
          Masukkan alamat wallet Anda untuk memverifikasi.
        </p>
        <input
          type="text"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          placeholder="0x..."
          className={`w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition duration-300 ${
            theme === "light"
              ? "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              : "border-gray-700 focus:ring-yellow-500 focus:border-yellow-500"
          }`}
        />
        <button
          onClick={handleVerify}
          className={`w-full p-3 mt-4 font-semibold rounded-lg shadow-lg transition duration-300 ${
            theme === "light"
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-yellow-500 text-black hover:bg-yellow-600"
          }`}
        >
          Verifikasi Wallet
        </button>
        {message && (
          <p
            className={`mt-4 text-center font-medium transition duration-300 ${
              message.includes("berhasil") || message.includes("success to")
                ? `${theme === "light" ? "text-green-500" : "text-green-400"}`
                : message.includes("terverifikasi") || message.includes("is")
                ? `${theme === "light" ? "text-yellow-500" : "text-yellow-400"}`
                : `${theme === "light" ? "text-red-500" : "text-red-400"}`
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default VerifyWallet;
