"use client";
/* eslint-disable camelcase */

import React from "react";
import Image from "next/image";
import { saveAs } from "file-saver";
import tree from "../../../public/tree.png";

export default function Homestead() {
  const forms = [
    {
      id: "HOMESTAED 1 OWNER FORM",
      link: "../../files/home/HOMESTEAD1.pdf",
    },
    {
      id: "HOMESTEAD 2 OWNERS FORM",
      link: "../../files/home/HOMESTEAD 2 OWNERS FORM.pdf",
    },
    {
      id: "HOMESTEAD 3 OWNERS FORM",
      link: "../../files/home/HOMESTEAD 3 OWNERS FORM.pdf",
    },
    { id: "null", link: "null" },
    { id: "CCA Change Form", link: "../../files/cca/CCA Change Form.pdf" },
    {
      id: "ATTESTATION FORM",
      link: "../../files/cca/ATTESTATION FORM.pdf",
    },
    {
      id: "AUTHORIZATION DELEGATE FORM.pdf",
      link: "../../files/cca/AUTHORIZATION DELEGATE FORM.pdf",
    },
    { id: "Affidavit Of Death", link: "../../files/aff/AffidavitOfDeath.pdf" },
    { id: "null", link: "null" },

    { id: "Family Trust", link: "../../files/other/FAMILY TRUST.pdf" },
    {
      id: "LIFE FROM FOR NON MED APP",
      link: "../../files/other/LIFE FROM FOR NON MED APP.pdf",
    },
  ];

  const downloadPdf = async (id: string, link: string) => {
    try {
      const pdfTemplateUrl = link;

      const response = await fetch(pdfTemplateUrl);
      if (!response.ok)
        throw new Error(`Error fetching PDF: ${response.statusText}`);
      const blob = await response.blob();
      saveAs(blob, id);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center py-2">
      <form className="mb-4 flex w-full max-w-4xl flex-col rounded-lg bg-gray-300 p-8 shadow-md">
        <div className="flex w-full justify-center">
          <Image src={tree} width={200} height={200} alt="APAC Logo" />
        </div>
        <div className="flex justify-center">
          <h1 className="mb-6 text-2xl font-semibold text-gray-800">
            Download All Fillable Forms
          </h1>
        </div>

        {forms.map((form) => (
          <div key={form.id} className="flex flex-col">
            {form.id !== "null" ? (
              <button
                onClick={() => downloadPdf(form.id, form.link)}
                className="mb-2 rounded-lg bg-gray-300 px-6 py-3 text-lg font-medium text-gray-700 shadow-md transition duration-300 hover:bg-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-400"
              >
                {"->"}
                {form.id}
                {"<-"}
              </button>
            ) : (
              <br />
            )}
          </div>
        ))}
      </form>
    </div>
  );
}
