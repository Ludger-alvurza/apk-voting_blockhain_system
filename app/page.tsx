"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ContainerTextFlip } from "@/components/ui/container-text-flip";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen ">
      <main className="flex flex-col gap-8 items-center sm:items-start text-center sm:text-left w-full max-w-4xl">
        {/* Animasi Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl sm:text-6xl font-extrabold text-foreground dark:text-yellow-500"
        >
          Welcome to Vote DAPPS
        </motion.h1>

        {/* Animasi Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-xl text-foreground/80 dark:text-gray-300 mb-8 max-w-2xl"
        >
          Your decentralized voting platform. Start casting your vote today!
        </motion.p>

        {/* Animasi Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="flex gap-6 items-center justify-center sm:justify-start"
        >
          <Link
            href="/login"
            className="px-8 py-3 text-lg font-semibold text-white bg-yellow-500 rounded-full shadow-md hover:bg-yellow-600 transition-all transform hover:scale-105 dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:text-gray-900"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-8 py-3 text-lg font-semibold text-white bg-blue-600 rounded-full shadow-md hover:bg-blue-700 transition-all transform hover:scale-105 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            Register
          </Link>
        </motion.div>

        {/* Animasi Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mt-12 w-full flex justify-center sm:justify-start"
        >
          <ContainerTextFlip
            words={[
              "decentralized",
              "transparent",
              "secure",
              "trusted",
              "immutable",
              "efficient",
            ]}
            interval={3000}
            className="text-yellow-400"
            textClassName="text-4xl font-bold"
            animationDuration={700}
          />
        </motion.div>
      </main>
    </div>
  );
}
