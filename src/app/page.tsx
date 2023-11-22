"use client";
/* eslint-disable camelcase */

import Link from "next/link";
import Image from "next/image";
import tree from "../../public/tree.png";
import React from "react";

export default function Home() {
  const tools = [
    { id: "CCA 全家桶", link: "/cca" },
    { id: "Homestead", link: "/homestead" },
    { id: "Affidavit, Death of Trustee", link: "/affidavit" },
    { id: "->All Fillable Form<-", link: "/pdf" },
  ];
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
        {tools.map((tool) => (
          <div key={tool.id} className="flex flex-col">
            <Link
              href={tool.link}
              className="mb-2 rounded-lg bg-gray-300 px-6 py-3 text-lg font-medium text-gray-700 shadow-md transition duration-300 hover:bg-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-400"
            >
              {tool.id}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
