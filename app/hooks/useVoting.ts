import { useState, useEffect } from "react";
import { connectToContract } from "../../utils/contract";

const useVoting = (account: string | null) => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [message, setMessage] = useState<string>("");
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

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
  const checkIfVerified = async () => {
    if (!account) return;

    try {
      const response = await fetch(`/api/verify?address=${account}`);
      const data = await response.json();

      if (data.isVerified === false) {
        setIsVerified(false);
        setMessage("Wallet Anda belum terverifikasi.");
      } else {
        setIsVerified(true);
      }
    } catch (error) {
      console.error("Error checking verification status:", error);
      setMessage("Terjadi kesalahan saat mengecek status verifikasi.");
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
      checkIfVerified();
    }
  }, [account]);

  return {
    candidates,
    message,
    setMessage,
    checkIfVoted,
    voteForCandidate,
    isVerified,
  };
};

export default useVoting;
