"use client";
import React, { useState } from "react";
import ConnectWalletButton from "../components/ConnectWalletButton";
import CandidateList from "../components/CandidateList";
import MessageDisplay from "../components/MessageDisplay";
import useVoting from "../hooks/useVoting";
import BlockInfo from "../components/BlockDataDisplay";

const VotePage: React.FC = () => {
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
    const chainId = "0xaa36a7"; // Sepolia chain ID
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
      alert(
        "Failed to switch network. Ensure MetaMask is properly configured."
      );
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

  const handleVote = async () => {
    if (selectedCandidate === null) {
      alert("Silakan pilih kandidat!");
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
      setMessage("Lo udah pernah voting. Cuma bisa sekali, bro!");
      return;
    }

    try {
      await voteForCandidate(selectedCandidate);
      setMessage("Vote sudah tercatat! Terima kasih telah berpartisipasi.");
    } catch (error: any) {
      console.error("Error saat voting:", error);
      setMessage(
        error?.reason?.includes("Invalid candidate")
          ? "Kandidat yang dipilih tidak valid."
          : "Terjadi kesalahan saat voting. Silakan coba lagi."
      );
    }
  };

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-200 transition-all flex flex-col items-center justify-center p-6">
      <ConnectWalletButton connectWallet={connectWallet} account={account} />
      <div className="w-full max-w-md bg-yellow-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-6 rounded-lg shadow-md mt-6 border border-yellow-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Pilih Kandidat</h2>
        <CandidateList
          candidates={candidates}
          selectedCandidate={selectedCandidate}
          setSelectedCandidate={setSelectedCandidate}
        />
      </div>
      <button
        onClick={handleVote}
        className="mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 dark:bg-yellow-500 dark:hover:bg-yellow-600 text-white dark:text-gray-900 rounded-lg transition-all transform hover:scale-105 font-medium"
        disabled={!account || selectedCandidate === null}
      >
        Vote
      </button>
      <MessageDisplay message={message} />
      <div className="mt-6">
        <BlockInfo />
      </div>
    </div>
  );
};

export default VotePage;
