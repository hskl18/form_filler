"use client";
/* eslint-disable camelcase */

import { useRouter } from "next/navigation";
// import { saveAs } from "file-saver";
import Image from "next/image";
import tree from "../../public/tree.png";
import React from "react";

export default function Home() {
  // Set up the router instance
  const router = useRouter();

  // Function to handle redirection
  const homestead = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // prevent default form submission
    router.push("/homestead"); // replace with the path to your next page
  };

  const aff_death = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // prevent default form submission
    router.push("/aff_death"); // replace with the path to your next page
  };

  const cca_tool = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // prevent default form submission
    router.push("/cca"); // replace with the path to your next page
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="flex w-full justify-center">
          <Image src={tree} width={200} height={200} alt="APAC Logo" />
        </div>

        <br />

        <h1 className="mb-8 text-4xl font-bold text-gray-800">
          APAC Form Filler Home Page
        </h1>

        <button
          onClick={cca_tool}
          className="mb-2 mr-2 rounded-lg bg-blue-400 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          CCA 全家桶
        </button>

        <button
          onClick={homestead}
          className="mb-2 mr-2 rounded-lg bg-blue-400 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Homestead
        </button>

        <button
          onClick={aff_death}
          className="mb-2 mr-2 rounded-lg bg-blue-400 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Affidavit - Death of Trustee
        </button>
      </div>
    </div>
  );
}
