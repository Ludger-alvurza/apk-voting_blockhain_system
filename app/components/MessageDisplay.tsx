import React from "react";
import styles from "../styles/components/MessageDisplay.module.css";

type MessageDisplayProps = {
  message: string;
};

const MessageDisplay: React.FC<MessageDisplayProps> = ({ message }) => {
  if (!message) return null;

  const isSuccess = message.includes("berhasil");

  return (
    <p className={`${styles.message} ${isSuccess ? styles.success : styles.error}`}>
      {message}
    </p>
  );
};

export default MessageDisplay;
