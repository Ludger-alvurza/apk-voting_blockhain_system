import { useState, useEffect, useCallback, useRef } from "react";
import { connectToContract } from "../../utils/contract";

// Define proper interface for a candidate
interface Candidate {
  id: number;
  name: string;
  voteCount: number;
  // Add any other properties your candidates have
}

const useVoting = (account: string | null) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
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

      if (allCandidates.length === 0) {
        setMessage("Belum ada kandidat.");
      } else {
        setCandidates(allCandidates);
      }
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

  const verificationCheckRef = useRef<boolean>(false);

  const checkIfVerified = useCallback(async () => {
    if (!account || verificationCheckRef.current) return;

    // Mark that we've started the verification check
    verificationCheckRef.current = true;

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
  }, [account]);

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
    } catch (error: unknown) {
      console.error("Error saat voting:", error);
      // Type guard to safely access error properties
      if (
        error &&
        typeof error === "object" &&
        "reason" in error &&
        typeof error.reason === "string" &&
        error.reason.includes("Invalid candidate")
      ) {
        setMessage("Kandidat yang dipilih tidak valid.");
      } else {
        setMessage("Terjadi kesalahan saat voting. Silakan coba lagi.");
      }
    }
  };

  useEffect(() => {
    if (account) {
      getCandidates();
      checkIfVerified();
    }

    // Reset the verification check flag when account changes
    return () => {
      verificationCheckRef.current = false;
    };
  }, [account, checkIfVerified]);

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
