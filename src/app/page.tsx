"use client";
/* eslint-disable camelcase */

import Link from "next/link";
import Image from "next/image";
import tree from "../../public/tree.png";
import React from "react";

export default function Home() {
  const tools = [
    { id: "CCA 全家桶", link: "/cca" },
    { id: "Homestead 桶", link: "/homestead" },
    { id: "Affidavit, Death of Trustee", link: "/affidavit" },
    { id: "->全部文件桶<-", link: "/pdf" },
    {
      id: "HEALTH RISK ASSESSMENT （健康调查表）",
      link: "https://forms.gle/izKG5vvZJp5oMcn38",
    },
    {
      id: "修改，更进，或者添加新的表格点我！",
      link: "mailto:thb182003@gmail.com",
      isEmail: true,
    },
  ];
  return (
    <div className="flex h-screen items-center justify-center bg-gray-300">
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
            {tool.link.startsWith("https://forms.gle/") ? (
              <a
                href={tool.link}
                target="_blank" // This opens the link in a new tab
                rel="noopener noreferrer" // This is for security reasons
                className="mb-2 rounded-lg bg-gray-300 px-6 py-3 text-lg font-medium text-gray-700 shadow-md transition duration-300 hover:bg-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-400"
              >
                {tool.id}
              </a>
            ) : (
              <Link
                href={tool.link}
                className="mb-2 rounded-lg bg-gray-300 px-6 py-3 text-lg font-medium text-gray-700 shadow-md transition duration-300 hover:bg-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-400"
              >
                {tool.id}
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
