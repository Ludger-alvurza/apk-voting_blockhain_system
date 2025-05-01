"use client";
import React, { useState } from "react";

const VerifyWallet = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [message, setMessage] = useState("");

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
        setMessage(data.message);
      } else {
        setMessage(data.error || "Gagal memverifikasi wallet.");
      }
    } catch (error) {
      setMessage("Terjadi kesalahan saat mencoba memverifikasi wallet.");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <input
        type="text"
        value={walletAddress}
        onChange={(e) => setWalletAddress(e.target.value)}
        placeholder="Masukkan wallet address"
        className="p-2 border rounded"
      />
      <button
        onClick={handleVerify}
        className="p-2 bg-blue-500 text-white rounded mt-2"
      >
        Verifikasi Wallet
      </button>
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
};

export default VerifyWallet;
