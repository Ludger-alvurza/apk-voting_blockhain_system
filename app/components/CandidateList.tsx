import React from "react";

interface Candidate {
  id: number;
  name: string;
}

interface Props {
  candidates: Candidate[];
  selectedCandidate: number | null;
  setSelectedCandidate: (id: number) => void;
}

const CandidateList: React.FC<Props> = ({
  candidates,
  selectedCandidate,
  setSelectedCandidate,
}) => {
  return candidates.length === 0 ? (
    <p className="text-gray-500 text-center">
      Tidak ada kandidat yang tersedia.
    </p>
  ) : (
    <div className="grid grid-cols-1 gap-4 bg-gray-100 p-4 rounded-lg shadow-md">
      {candidates.map((candidate) => (
        <button
          key={candidate.id}
          onClick={() => setSelectedCandidate(candidate.id)}
          className={`px-4 py-2 w-full text-white rounded-lg transition-all ${
            selectedCandidate === candidate.id
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-gray-500 hover:bg-gray-600"
          }`}
        >
          {candidate.name}
        </button>
      ))}
    </div>
  );
};

export default CandidateList;
