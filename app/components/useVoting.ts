import { useState, useEffect } from "react";
import { connectToContract } from "../../utils/contract";
import { createPublicClient, http, Block } from "viem";
import { sepolia } from "viem/chains";

const client = createPublicClient({
  chain: sepolia,
  transport: http("https://eth-sepolia.g.alchemy.com/v2/your-api-key"),
});

const useVoting = (account: string | null) => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [message, setMessage] = useState<string>("");

  const getCandidates = async () => {
    try {
      const contract = await connectToContract();
      if (!contract) {
        setMessage("Contract tidak terhubung.");
        return;
      }

      const allCandidates = await contract.getAllCandidates();
      setCandidates(allCandidates);
    } catch (error) {
      console.error("Error mengambil kandidat:", error);
      setMessage("Error saat mengambil kandidat.");
    }
  };

  const checkIfVoted = async (): Promise<boolean> => {
    try {
      const contract = await connectToContract();
      if (!contract) {
        setMessage("Contract tidak terhubung.");
        return false;
      }

      const hasVoted = await contract.hasVoted(account);
      if (hasVoted) {
        setMessage("Lo udah pernah voting. Cuma bisa sekali, bro!");
      }
      return hasVoted;
    } catch (error) {
      console.error("Error mengecek status voting:", error);
      setMessage("Terjadi kesalahan saat mengecek status voting.");
      return false;
    }
  };

  const voteForCandidate = async (candidateId: number): Promise<void> => {
    try {
      const contract = await connectToContract();
      if (!contract) {
        setMessage("Contract tidak terhubung.");
        return;
      }

      const tx = await contract.vote(candidateId);
      setMessage("Voting berhasil! Menunggu transaksi diproses...");

      const txReceipt = await tx.wait();
      if (txReceipt.status === 0) {
        console.error("Transaksi gagal:", txReceipt);
        setMessage("Transaksi gagal. Silakan coba lagi.");
      } else {
        setMessage("Vote sudah tercatat!");
      }
    } catch (error: any) {
      console.error("Error saat voting:", error);
      setMessage(
        error?.reason?.includes("Invalid candidate")
          ? "Kandidat yang dipilih tidak valid."
          : "Terjadi kesalahan saat voting. Silakan coba lagi."
      );
    }
  };

  useEffect(() => {
    if (account) {
      getCandidates();
    }
  }, [account]);

  return { candidates, message, setMessage, checkIfVoted, voteForCandidate };
};

export default useVoting;
