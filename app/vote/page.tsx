"use client";
import React, { useState, useEffect } from "react";
import { connectToContract } from "../../utils/contract"; // Pastikan connectToContract sudah benar
import { createPublicClient, http, Block } from "viem";
import { sepolia } from "viem/chains";

// Membuat client untuk mengambil data block
const client = createPublicClient({
  chain: sepolia,
  transport: http(
    "https://eth-sepolia.g.alchemy.com/v2/AAIxRJlEf_mZPpsoPNLgjISEIV2U-xzB"
  ), // Ganti dengan API Key kamu
});

interface VotingContract {
  vote(candidateId: number): Promise<any>;
  candidates(candidateId: number): Promise<any>;
}

// Type guard untuk memastikan kontrak memiliki metode 'vote' dan 'candidates'
const isVotingContract = (contract: any): contract is VotingContract => {
  return (
    "vote" in contract &&
    typeof contract.vote === "function" &&
    "candidates" in contract &&
    typeof contract.candidates === "function"
  );
};

const VotePage: React.FC = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(
    null
  );
  const [message, setMessage] = useState<string>("");
  const [blockData, setBlockData] = useState<Block | null>(null);

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
          "Error while connecting to wallet. Please check your MetaMask network."
        );
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const getBlockData = async () => {
    try {
      const latestBlockNumber = await client.getBlockNumber();
      const block: Block = await client.getBlock({
        blockNumber: latestBlockNumber,
      });
      setBlockData(block);
    } catch (error) {
      console.error("Error fetching block data:", error);
      setMessage("Error fetching block data.");
    }
  };

  useEffect(() => {
    if (account) {
      getBlockData();
    }
  }, [account]);

  const checkCandidateValidity = async (candidateId: number) => {
    try {
      const contract = await connectToContract();
      if (!contract) {
        setMessage("Contract is not connected.");
        return false;
      }

      if (!isVotingContract(contract)) {
        setMessage("Contract methods not found.");
        return false;
      }

      const candidate = await contract.candidates(candidateId); // Cek kandidat berdasarkan ID
      if (!candidate || candidate.id === 0) {
        setMessage("Candidate is not valid.");
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error checking candidate:", error);
      setMessage("Error while checking candidate.");
      return false;
    }
  };
  const [candidates, setCandidates] = useState<any[]>([]); // Simpan kandidat

  const getCandidates = async () => {
    try {
      const contract = await connectToContract();
      if (!contract) {
        setMessage("Contract tidak terhubung.");
        return;
      }

      if (!isVotingContract(contract)) {
        setMessage("Metode kontrak tidak ditemukan.");
        return;
      }

      const allCandidates = await contract.getAllCandidates();
      setCandidates(allCandidates);
    } catch (error) {
      console.error("Error mengambil kandidat:", error);
      setMessage("Error saat mengambil kandidat.");
    }
  };

  useEffect(() => {
    if (account) {
      getCandidates(); // Ambil kandidat waktu account terhubung
    }
  }, [account]);

  const vote = async () => {
    if (selectedCandidate === null) {
      alert("Silakan pilih kandidat!");
      return;
    }

    // Pastikan kandidat yang dipilih valid
    const isValid = await checkCandidateValidity(selectedCandidate);
    if (!isValid) {
      alert("Pilih kandidat yang valid!");
      return;
    }

    try {
      const contract = await connectToContract();
      if (!contract) {
        setMessage("Contract tidak terhubung.");
        return;
      }

      if (!isVotingContract(contract)) {
        setMessage("Metode kontrak tidak ditemukan.");
        return;
      }

      console.log("Mencoba vote untuk kandidat:", selectedCandidate);

      // Lanjutkan proses vote
      const tx = await contract.vote(selectedCandidate);
      console.log("Transaksi dikirim:", tx);

      setMessage("Voting berhasil! Menunggu transaksi diproses...");

      // Tunggu transaksi selesai
      const txReceipt = await tx.wait();
      console.log("Bukti transaksi:", txReceipt);

      if (txReceipt.status === 0) {
        console.error("Transaksi gagal dengan alasan revert:", txReceipt);
        setMessage("Transaksi gagal. Silakan coba lagi.");
      } else {
        setMessage("Vote sudah tercatat!");
      }
    } catch (error: any) {
      console.error("Error saat voting:", error);
      setMessage("Terjadi kesalahan saat voting. Silakan coba lagi.");
    }
  };

  const bigIntReplacer = (key: string, value: any) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  };

  return (
    <div>
      <h1>Vote for Your Favorite Candidate</h1>
      {!account ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <p>Connected as: {account}</p>
      )}

      <div>
        <h2>Pilih Kandidat</h2>
        {candidates.length === 0 ? (
          <p>Tidak ada kandidat yang tersedia.</p>
        ) : (
          candidates.map((candidate: any) => (
            <button
              key={candidate.id}
              onClick={() => setSelectedCandidate(candidate.id)}
              style={{
                backgroundColor:
                  selectedCandidate === candidate.id ? "green" : "",
              }}
            >
              {candidate.name}
            </button>
          ))
        )}
      </div>

      <button onClick={vote}>Vote</button>

      {message && <p>{message}</p>}

      {blockData && (
        <div>
          <h3>Block Data</h3>
          <pre>{JSON.stringify(blockData, bigIntReplacer, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default VotePage;
