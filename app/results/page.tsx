"use client";
import { useEffect, useState } from "react";
import { connectToContract } from "@/utils/contract";

// Define the type for raw candidate data from the contract
interface RawCandidate {
  id: { toString: () => string };
  name: string;
  voteCount: { toString: () => string };
}

// Define the type for processed candidate data
type Candidate = {
  id: string;
  name: string;
  voteCount: string;
};

const VotingResults = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getUserFriendlyError = (error: unknown): string => {
    const errorMessage =
      error instanceof Error
        ? error.message
        : typeof error === "string"
        ? error
        : String(error);

    // Contract errors
    if (errorMessage.includes("Kontrak nggak nyambung")) {
      return "Gagal terhubung ke smart contract. Periksa koneksi kamu.";
    }
    if (errorMessage.includes("Data kandidat kosong")) {
      return "Belum ada kandidat yang terdaftar. Hubungi admin untuk mendaftarkan kandidat.";
    }

    // MetaMask/Wallet errors
    if (errorMessage.includes("MetaMask is not installed")) {
      return "MetaMask belum terinstall. Silakan install MetaMask terlebih dahulu.";
    }

    // Network errors
    if (errorMessage.includes("network") || errorMessage.includes("Network")) {
      return "Koneksi bermasalah. Periksa internet kamu dan coba lagi.";
    }

    // Default error
    return "Gagal memuat data kandidat. Silakan refresh halaman atau hubungi admin.";
  };

  const fetchResults = async () => {
    setLoading(true);
    setError(null);

    try {
      const contract = await connectToContract();

      if (!contract) {
        throw new Error("Kontrak nggak nyambung.");
      }

      const candidatesData = await contract.getAllCandidates();
      console.log("Raw candidates data:", candidatesData);

      if (!candidatesData || candidatesData.length === 0) {
        throw new Error("Data kandidat kosong atau belum terdaftar");
      }

      // Parsing data menjadi bentuk yang sesuai
      const parsedCandidates = candidatesData.map(
        (candidate: RawCandidate) => ({
          id: candidate.id.toString(),
          name: candidate.name,
          voteCount: candidate.voteCount.toString(),
        })
      );

      setCandidates(parsedCandidates);
    } catch (err: unknown) {
      console.error("Error fetching candidates:", err);
      const friendlyError = getUserFriendlyError(err);
      setError(friendlyError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <div className="rounded-lg shadow-lg max-w-xl w-full">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-yellow-500 dark:text-white">
          Hasil Voting
        </h1>

        {/* Error Display */}
        {error && (
          <div className="p-4 rounded-lg mb-6 border-l-4 bg-red-50 border-red-500 text-red-900 dark:bg-red-900/20 dark:border-red-500 dark:text-red-200">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-600 dark:text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="font-medium text-sm">{error}</p>
                <button
                  onClick={fetchResults}
                  className="mt-3 inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 transition-colors"
                >
                  Coba Lagi
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && !error && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 dark:border-yellow-400"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Memuat data kandidat...
            </p>
          </div>
        )}

        {/* Candidates List */}
        {!loading && !error && candidates.length > 0 && (
          <ul className="space-y-4">
            {candidates.map((candidate) => (
              <li
                key={candidate.id}
                className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-yellow-500 dark:bg-yellow-600 rounded-full flex items-center justify-center text-white font-bold">
                    {candidate.id}
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {candidate.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Suara:
                  </span>
                  <span className="text-lg font-bold text-yellow-600 dark:text-yellow-400">
                    {candidate.voteCount}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Empty State */}
        {!loading && !error && candidates.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <svg
              className="h-16 w-16 text-gray-400 dark:text-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <p className="mt-4 text-gray-600 dark:text-gray-400 text-center">
              Belum ada kandidat yang terdaftar.
            </p>
            <button
              onClick={fetchResults}
              className="mt-4 px-4 py-2 text-sm font-medium rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VotingResults;
