"use client";
/* eslint-disable camelcase */

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";

export default function Aff_death() {
  const downloadPdfa = async () => {
    try {
      const pdfTemplateUrl = "../../files/cca/2024 CCA Change Form.pdf";

      const response = await fetch(pdfTemplateUrl);
      if (!response.ok)
        throw new Error(`Error fetching PDF: ${response.statusText}`);
      const blob = await response.blob();
      saveAs(blob, `2024 CCA Change Form.pdf`);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  const downloadPdfb = async () => {
    try {
      const pdfTemplateUrl = "../../files/cca/ATTESTATION FORM.pdf";

      const response = await fetch(pdfTemplateUrl);
      if (!response.ok)
        throw new Error(`Error fetching PDF: ${response.statusText}`);
      const blob = await response.blob();
      saveAs(blob, `ATTESTATION FORM.pdf`);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  const downloadPdfc = async () => {
    try {
      const pdfTemplateUrl = "../../files/cca/AUTHORIZATION DELEGATE FORM.pdf";

      const response = await fetch(pdfTemplateUrl);
      if (!response.ok)
        throw new Error(`Error fetching PDF: ${response.statusText}`);
      const blob = await response.blob();
      saveAs(blob, `AUTHORIZATION DELEGATE FORM.pdf`);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  // form input data
  const [data, setFormData] = useState({
    fnum: "",
    fname: "",
    lname: "",
    casenum: "",
  });

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [id]: value }));
  };

  // handle pdf filling and download
  const fillPdfAndDownload = async (formData: any) => {
    const today = new Date();
    const today_str = `${
      today.getMonth() + 1
    }/${today.getDate()}/${today.getFullYear()}`;
    const current_year = today.getFullYear();
    const current_date = today.getDate();
    const current_month = today.getMonth() + 1;

    // Assuming searchProperty and legalDescription are implemented somewhere
    const baseData_a = {
      filenum: formData.fnum,
      name: formData.fname + " " + formData.lname,
      date:
        current_month +
        "/" +
        current_date +
        "/" +
        current_year.toString().slice(-2),
      case: formData.casenum,
    };

    const baseData_c = {
      file_num: formData.fnum,
      name: formData.fname + " " + formData.lname,
      case_id: formData.casenum,
      date: today_str,
    };

    const baseData_b = {
      "Case Number": formData.casenum,
      "First Name": formData.fname,
      "Last Name": formData.lname,
      MM: current_month.toString().padStart(2, "0"),
      DD: current_date.toString().padStart(2, "0"),
      YYYY: current_year.toString().padStart(4, "0"),
    };

    try {
      const pdfTemplateUrl = "../../files/cca/2024 CCA Change Form.pdf";

      const arrayBuffer = await fetch(pdfTemplateUrl).then((res) => {
        if (!res.ok) throw new Error(`Error fetching PDF: ${res.statusText}`);
        return res.arrayBuffer();
      });

      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const form = pdfDoc.getForm();

      for (const [key, value] of Object.entries(baseData_a)) {
        const field = form.getTextField(key);

        if (typeof value === "string") {
          field.setText(value);
        } else {
          console.warn(`Value for field ${key} is not a string:`, value);
        }
      }
      // form.flatten(); will cost a bug

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      saveAs(blob, `2024 CCA Change Form.pdf`);
    } catch (error: any) {
      console.error("Error filling PDF:", error);
    }

    try {
      const pdfTemplateUrl = "../../files/cca/ATTESTATION FORM.pdf";

      const arrayBuffer = await fetch(pdfTemplateUrl).then((res) => {
        if (!res.ok) throw new Error(`Error fetching PDF: ${res.statusText}`);
        return res.arrayBuffer();
      });

      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const form = pdfDoc.getForm();

      for (const [key, value] of Object.entries(baseData_b)) {
        const field = form.getTextField(key);

        if (typeof value === "string") {
          field.setText(value);
        } else {
          console.warn(`Value for field ${key} is not a string:`, value);
        }
      }
      // form.flatten(); will cost a bug

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      saveAs(blob, `Attestation-Form-Income.pdf`);
    } catch (error: any) {
      console.error("Error filling PDF:", error);
    }

    try {
      const pdfTemplateUrl = "../../files/cca/AUTHORIZATION DELEGATE FORM.pdf";

      const arrayBuffer = await fetch(pdfTemplateUrl).then((res) => {
        if (!res.ok) throw new Error(`Error fetching PDF: ${res.statusText}`);
        return res.arrayBuffer();
      });

      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const form = pdfDoc.getForm();

      for (const [key, value] of Object.entries(baseData_c)) {
        const field = form.getTextField(key);

        if (typeof value === "string") {
          field.setText(value);
        } else {
          console.warn(`Value for field ${key} is not a string:`, value);
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      saveAs(blob, `AUTHORIZATION DELEGATE FORM.pdf`);
    } catch (error: any) {
      console.error("Error filling PDF:", error);
    }
  };

  // Define form fields for rendering
  const fieldsData = [
    { id: "fnum", label: "file number" },
    { id: "fname", label: "first name" },
    { id: "lname", label: "last name" },
    { id: "casenum", label: "case number" },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center py-2">
      <form className="mb-4 flex w-full max-w-4xl flex-col rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-2xl font-semibold text-gray-800">
          CCA 全家桶
        </h1>

        {fieldsData.map((field) => (
          <div key={field.id} className="flex flex-col">
            <label
              className="mb-2 text-sm font-semibold text-gray-700"
              htmlFor={field.id}
            >
              {field.label}:
            </label>
            <input
              className="w-full appearance-none rounded-md border px-3 py-2 leading-tight text-gray-700 shadow focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              id={field.id}
              type="text"
              onChange={handleChange}
            />
          </div>
        ))}

        <br />

        <button
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          type="button"
          onClick={() => fillPdfAndDownload(data)}
        >
          Fill and Download PDF
        </button>

        <br />
        <br />

        <h1 className="mb-6 text-2xl font-semibold text-gray-800">
          just download the fillable PDF
        </h1>

        <button
          className="rounded bg-blue-400 px-4 py-2 font-bold text-white transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          type="button"
          onClick={downloadPdfa}
        >
          CCA form
        </button>
        <br />

        <button
          className="rounded bg-blue-400 px-4 py-2 font-bold text-white transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          type="button"
          onClick={downloadPdfb}
        >
          Attestation Form
        </button>
        <br />
        <button
          className="rounded bg-blue-400 px-4 py-2 font-bold text-white transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          type="button"
          onClick={downloadPdfc}
        >
          AUTHORIZATION DELEGATE FORM
        </button>

        <br />
      </form>
    </div>
  );
}
