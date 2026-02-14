"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import ConnectWalletButton from "../components/ConnectWalletButton";
import CandidateList from "../components/CandidateList";
import MessageDisplay from "../components/MessageDisplay";
import useVoting from "../hooks/useVoting";
import BlockInfo from "../components/BlockDataDisplay";

// Define a custom error interface for voting errors
interface VotingError extends Error {
  reason?: string;
}

const VotePage: React.FC = () => {
  const router = useRouter();
  const [account, setAccount] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(
    null
  );

  const {
    candidates,
    message,
    setMessage,
    checkIfVoted,
    voteForCandidate,
    isVerified,
  } = useVoting(account);

  const switchToSepolia = async () => {
    const chainId = "0xaa36a7"; // Sepolia Testnet chain ID
    try {
      const currentChainId = await window.ethereum.request({
        method: "eth_chainId",
      });

      if (currentChainId !== chainId) {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId }],
        });
      }
    } catch (error) {
      console.error("Error switching to Sepolia:", error);

      type ProviderRpcError = {
        code?: number;
        message?: string;
        data?: unknown;
      };

      const providerError = error as ProviderRpcError;

      if (providerError?.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0xaa36a7",
                chainName: "Sepolia Testnet",
                nativeCurrency: {
                  name: "ETH",
                  symbol: "ETH",
                  decimals: 18,
                },
                rpcUrls: ["https://sepolia.infura.io/v3/"],
                blockExplorerUrls: ["https://sepolia.etherscan.io/"],
              },
            ],
          });
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId }],
          });
        } catch (addError) {
          console.error("Failed to add Sepolia network:", addError);
          alert("Gagal menambahkan jaringan Sepolia ke MetaMask.");
        }
      } else {
        console.error("Failed to switch network:", error);
        alert(
          "Failed to switch network. Ensure MetaMask is properly configured for Sepolia."
        );
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await switchToSepolia();
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
      } catch (error) {
        console.error(
          "User rejected the request or failed to switch network:",
          error
        );
        alert(
          "Error connecting to wallet. Please ensure your MetaMask network is set to Sepolia."
        );
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setSelectedCandidate(null);
    setMessage("");
  };

  const switchWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await switchToSepolia();
        await window.ethereum.request({
          method: "wallet_requestPermissions",
          params: [{ eth_accounts: {} }],
        });

        // After permission is granted, get the new account
        const newAccounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(newAccounts[0]);
        setSelectedCandidate(null);
        setMessage("");
      } catch (error) {
        console.error("Error switching wallet:", error);
        alert("Gagal mengganti wallet. Silakan coba lagi.");
      }
    }
  };

  const handleVote = async () => {
    if (selectedCandidate === null) {
      setMessage("Silakan pilih kandidat terlebih dahulu!");
      return;
    }

    if (isVerified === null) {
      setMessage("Menunggu status verifikasi wallet...");
      return;
    }

    if (isVerified === false) {
      setMessage("Wallet Anda belum terverifikasi. Silakan hubungi admin.");
      return;
    }

    const hasVoted = await checkIfVoted();
    if (hasVoted) {
      setMessage(
        "Kamu sudah voting sebelumnya. Setiap wallet hanya bisa vote sekali!"
      );
      return;
    }

    try {
      await voteForCandidate(selectedCandidate);
      setMessage("Vote berhasil tercatat! Terima kasih telah berpartisipasi.");
      setTimeout(() => {
        router.push("/results");
      }, 1500);
    } catch (error: unknown) {
      console.error("Error saat voting:", error);
      const votingError = error as VotingError;
      setMessage(
        votingError?.reason?.includes("Invalid candidate")
          ? "Kandidat yang dipilih tidak valid."
          : "Terjadi kesalahan saat voting. Silakan coba lagi."
      );
    }
  };

  return (
    <div className="min-h-screen from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-all">
      {/* Header Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-yellow-500 dark:text-white mb-2">
            Sistem E-Voting
          </h1>
          <p className="text-yellow-500 dark:text-gray-400">
            Pilih kandidat pilihanmu dengan aman menggunakan blockchain
          </p>
        </div>

        {/* Main Content Container */}
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Wallet Connection Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <svg
                  className="w-6 h-6 mr-2 text-yellow-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
                Koneksi Wallet
              </h2>
              {isVerified !== null && (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    isVerified
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                  }`}
                >
                  {isVerified ? "✓ Terverifikasi" : "✗ Belum Terverifikasi"}
                </span>
              )}
            </div>

            {/* Wallet Info & Actions */}
            {account ? (
              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Connected Wallet
                  </p>
                  <p className="font-mono text-sm text-gray-900 dark:text-white break-all">
                    {account}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={switchWallet}
                    className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg font-medium transition-all transform hover:scale-105 flex items-center justify-center"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                      />
                    </svg>
                    Ganti Wallet
                  </button>
                  <button
                    onClick={disconnectWallet}
                    className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-lg font-medium transition-all transform hover:scale-105 flex items-center justify-center"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Disconnect
                  </button>
                </div>
              </div>
            ) : (
              <ConnectWalletButton
                connectWallet={connectWallet}
                account={account}
              />
            )}
          </div>

          {/* Candidate Selection Card */}
          {account && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-6">
                <svg
                  className="w-6 h-6 mr-2 text-yellow-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Pilih Kandidat
                </h2>
              </div>

              {candidates.length > 0 ? (
                <CandidateList
                  candidates={candidates}
                  selectedCandidate={selectedCandidate}
                  setSelectedCandidate={setSelectedCandidate}
                />
              ) : (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Memuat daftar kandidat...
                  </p>
                </div>
              )}

              {/* Vote Button */}
              <div className="mt-6">
                <button
                  onClick={handleVote}
                  disabled={!account || selectedCandidate === null}
                  className={`w-full px-6 py-4 rounded-xl font-bold text-lg transition-all transform shadow-lg ${
                    !account || selectedCandidate === null
                      ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white hover:scale-105 hover:shadow-xl"
                  }`}
                >
                  {!account
                    ? "Hubungkan Wallet Terlebih Dahulu"
                    : selectedCandidate === null
                    ? "Pilih Kandidat untuk Vote"
                    : "🗳️ Kirim Vote"}
                </button>
              </div>
            </div>
          )}

          {/* Message Display */}
          {message && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <MessageDisplay message={message} />
            </div>
          )}

          {/* Block Info */}
          {account && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <svg
                  className="w-6 h-6 mr-2 text-yellow-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Informasi Blockchain
                </h2>
              </div>
              <BlockInfo />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VotePage;
