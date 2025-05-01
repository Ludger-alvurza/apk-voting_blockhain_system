import React from "react";

interface Props {
  account: string | null;
  connectWallet: () => void;
}

const ConnectWalletButton: React.FC<Props> = ({ account, connectWallet }) => {
  return !account ? (
    <button
      onClick={connectWallet}
      className="px-4 py-2 mt-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
    >
      Connect Wallet
    </button>
  ) : (
    <p className="text-lg text-gray-700 mb-4">
      Connected as:{" "}
      <span className="font-semibold text-blue-500">{account}</span>
    </p>
  );
};

export default ConnectWalletButton;
