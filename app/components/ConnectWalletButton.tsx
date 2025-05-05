import React from "react";

interface Props {
  account: string | null;
  connectWallet: () => void;
}

const ConnectWalletButton: React.FC<Props> = ({ account, connectWallet }) => {
  return !account ? (
    <button
      onClick={connectWallet}
      className="px-6 py-3 mt-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 dark:bg-yellow-500 dark:text-gray-900 dark:hover:bg-yellow-600 transition-all transform hover:scale-105 shadow-md"
    >
      Connect Wallet
    </button>
  ) : (
    <div className="text-lg text-gray-700 dark:text-gray-200 mb-4 p-4 rounded-lg bg-gray-100 dark:bg-gray-800 shadow-md">
      Connected as:{" "}
      <span className="font-semibold px-3 py-1 rounded-lg bg-blue-100 text-blue-800 dark:bg-yellow-500 dark:text-gray-900 ml-2">
        {account}
      </span>
    </div>
  );
};

export default ConnectWalletButton;
