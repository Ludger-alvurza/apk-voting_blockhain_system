"use client";
import { useEffect, useState } from "react";
import { connectToContract } from "@/utils/contract"; // Sesuaikan dengan path yang tepat

type Candidate = {
  id: string;
  name: string;
  voteCount: string;
};

const VotingResults = () => {
  // Set tipe candidates ke Candidate[]
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  const registerCandidates = async () => {
    const contract = await connectToContract();
    if (contract) {
      try {
        await contract.registerCandidate("Ludger");
        await contract.registerCandidate("Tessy");
        console.log("Candidates registered");
      } catch (error) {
        console.error("Error registering candidates:", error);
      }
    }
  };

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
        const parsedCandidates = candidatesData.map((candidate: any) => ({
          id: candidate.id.toString(), // Pastikan id dikonversi dengan toString() jika berupa BigNumber
          name: candidate.name,
          voteCount: candidate.voteCount.toString(), // Pastikan voteCount dikonversi dengan toString() jika berupa BigNumber
        }));

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
    <div>
      <h1>Voting Results</h1>
      {candidates.length > 0 ? (
        <ul>
          {candidates.map((candidate) => (
            <li key={candidate.id}>
              {candidate.name} - Votes: {candidate.voteCount}
            </li>
          ))}
        </ul>
      ) : (
        <p>No candidates found.</p>
      )}
    </div>
  );
};

export default VotingResults;
