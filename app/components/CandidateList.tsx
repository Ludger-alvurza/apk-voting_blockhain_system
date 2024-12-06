import React from "react";
import styles from "../styles/components/CandidateList.module.css";

type Candidate = { id: number; name: string };

type CandidateListProps = {
  candidates: Candidate[];
  selectedCandidate: number | null;
  setSelectedCandidate: (id: number) => void;
};

const CandidateList: React.FC<CandidateListProps> = ({
  candidates,
  selectedCandidate,
  setSelectedCandidate,
}) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Pilih Kandidat</h2>
      {candidates.length === 0 ? (
        <p className={styles.noCandidates}>Tidak ada kandidat yang tersedia.</p>
      ) : (
        <div className={styles.list}>
          {candidates.map((candidate) => (
            <button
              key={candidate.id}
              onClick={() => setSelectedCandidate(candidate.id)}
              className={`${styles.button} ${
                selectedCandidate === candidate.id ? styles.selected : ""
              }`}
            >
              {candidate.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CandidateList;
