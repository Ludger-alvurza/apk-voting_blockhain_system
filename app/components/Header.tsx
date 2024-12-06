import React from "react";
import styles from "../styles/components/Header.module.css";

type HeaderProps = {
  account: string | null;
  connectWallet: () => void;
};

const Header: React.FC<HeaderProps> = ({ account, connectWallet }) => {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Vote for Your Favorite Candidate</h1>
      {!account ? (
        <button className={styles.button} onClick={connectWallet}>
          Connect Wallet
        </button>
      ) : (
        <p className={styles.connected}>Connected as: {account}</p>
      )}
    </header>
  );
};

export default Header;
