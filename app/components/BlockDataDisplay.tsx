import React, { useState, useEffect } from "react";

const BlockInfo = () => {
  const [block, setBlock] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchWithTimeout = async (
    url: string,
    options: any,
    timeout = 5000
  ) => {
    const controller = new AbortController();
    const signal = controller.signal;

    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, { ...options, signal });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  };

  useEffect(() => {
    const fetchBlockData = async () => {
      try {
        const response = await fetchWithTimeout("/api/blockData", {}, 5000); // 5 detik timeout
        if (!response.ok) {
          throw new Error("Failed to fetch block data.");
        }
        const data = await response.json();
        setBlock(data);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          setError("Request timed out. Please try again.");
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      }
    };

    fetchBlockData();
    const interval = setInterval(fetchBlockData, 10000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!block) {
    return <div className="text-gray-500">Loading...</div>;
  }

  return (
    <div className="bg-blue-100 dark:bg-black text-blue-900 dark:text-yellow-300 p-6 rounded-lg shadow-lg text-center">
      <h1 className="text-2xl font-bold mb-4">Block Information</h1>
      <p className="text-lg">Block Number: {block?.number?.toString()}</p>
      <p className="text-lg">Hash: {block?.hash}</p>
      <p>Miner: {block?.miner || "Unknown"}</p>
      <p>Transactions: {block?.transactions?.length || 0}</p>
      <p>Gas Used: {block?.gasUsed?.toString() || "0"}</p>
      <p className="text-lg">
        Timestamp: {new Date(Number(block?.timestamp) * 1000).toLocaleString()}
      </p>
    </div>
  );
};

export default BlockInfo;
