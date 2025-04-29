"use client";
import React, { useState, useEffect } from "react";
import { connectToContract } from "../../utils/contract"; // Pastikan connectToContract sudah benar
import { createPublicClient, http, Block } from "viem";
import { sepolia } from "viem/chains";
import Header from "../components/Header";
import ConnectWalletButton from "../components/ConnectWalletButton";
import CandidateList from "../components/CandidateList";
import MessageDisplay from "../components/MessageDisplay";
import useVoting from "../components/useVoting";

const VotePage: React.FC = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(
    null
  );

  const { candidates, message, setMessage, checkIfVoted, voteForCandidate } =
    useVoting(account);

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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <Header />
      <ConnectWalletButton connectWallet={connectWallet} account={account} />
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Pilih Kandidat
        </h2>
        <CandidateList
          candidates={candidates}
          selectedCandidate={selectedCandidate}
          setSelectedCandidate={setSelectedCandidate}
        />
      </div>
      <button
        onClick={handleVote}
        className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
      >
        Vote
      </button>
      <MessageDisplay message={message} />
    </div>
  );
};

export default VotePage;
