"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion"; // Import motion from framer-motion

const LogoutButton: React.FC = () => {
  const router = useRouter();

  // State untuk mengatur tampilan modal konfirmasi
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fungsi untuk menangani logout
  const handleLogout = async () => {
    try {
      // Call the logout API to clear the session
      const response = await fetch("/api/logout", { method: "POST" });

      if (!response.ok) {
        throw new Error("Failed to logout.");
      }

      // Redirect user to the login page
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Fungsi untuk membuka modal konfirmasi
  const openModal = () => setIsModalOpen(true);

  // Fungsi untuk menutup modal konfirmasi
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      {/* Tombol Logout */}
      <button
        onClick={openModal}
        className="px-4 mt-2 py-2 text-white font-semibold rounded-lg shadow-md bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
      >
        Logout
      </button>

      {/* Modal Konfirmasi Logout */}
      {isModalOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          initial={{ opacity: 0 }} // Mulai dengan opacity 0
          animate={{ opacity: 1 }} // Muncul dengan opacity 1
          exit={{ opacity: 0 }} // Menghilang dengan opacity 0
          transition={{ duration: 0.3 }} // Durasi transisi
        >
          <motion.div
            className="bg-white p-6 rounded-lg shadow-lg w-1/3"
            initial={{ scale: 0.8 }} // Mulai dengan skala lebih kecil
            animate={{ scale: 1 }} // Muncul dengan skala normal
            exit={{ scale: 0.8 }} // Menghilang dengan skala lebih kecil
            transition={{ duration: 0.3 }} // Durasi transisi
          >
            <h2 className="text-2xl font-bold mb-4 text-yellow-500">
              Konfirmasi Logout
            </h2>
            <p className="mb-4 text-yellow-400">
              Apakah Anda yakin ingin logout?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-700 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default LogoutButton;
