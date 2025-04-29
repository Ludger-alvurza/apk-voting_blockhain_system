import React from "react";

interface Props {
  message: string;
}

const MessageDisplay: React.FC<Props> = ({ message }) => {
  if (!message) return null;

  const messageColor = message.includes("berhasil")
    ? "text-green-500"
    : "text-red-500";

  return (
    <p className={`mt-4 text-lg font-semibold ${messageColor}`}>{message}</p>
  );
};

export default MessageDisplay;
