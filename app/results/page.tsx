"use client";
import { useEffect, useState } from "react";
import { connectToContract } from "@/utils/contract"; // Sesuaikan dengan path yang tepat

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
  // Set tipe candidates ke Candidate[]
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  // Fungsi untuk mengambil hasil voting
  const fetchResults = async () => {
    const contract = await connectToContract();
    if (contract) {
      try {
        const candidatesData = await contract.getAllCandidates();
        console.log("Raw candidates data:", candidatesData); // Log data raw yang diterima

        if (!candidatesData || candidatesData.length === 0) {
          console.error("Data kandidat kosong atau belum terdaftar");
          return;
        }

        // Parsing data menjadi bentuk yang sesuai
        const parsedCandidates = candidatesData.map(
          (candidate: RawCandidate) => ({
            id: candidate.id.toString(), // Pastikan id dikonversi dengan toString() jika berupa BigNumber
            name: candidate.name,
            voteCount: candidate.voteCount.toString(), // Pastikan voteCount dikonversi dengan toString() jika berupa BigNumber
          })
        );

        setCandidates(parsedCandidates); // Update state dengan data yang sudah diparse
      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    } else {
      console.error("Kontrak nggak nyambung.");
    }
  };

  useEffect(() => {
    // registerCandidates();
    fetchResults();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen p-6 text-blue-900 dark:text-yellow-300">
      <div className="rounded-lg text-yellow-500 shadow-lg max-w-xl w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Voting Results</h1>
        {candidates.length > 0 ? (
          <ul className="space-y-4">
            {candidates.map((candidate) => (
              <li
                key={candidate.id}
                className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all"
              >
                <span className="font-medium">{candidate.name}</span>
                <span className="text-sm">Votes: {candidate.voteCount}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No candidates found.
          </p>
        )}
      </div>
    </div>
  );
};

export default VotingResults;
