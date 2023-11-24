"use client";
/* eslint-disable camelcase */

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";

export default function Aff_death() {
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

    const baseData_b = {
      "Case Number": `${formData.casenum}`,
      "First Name": formData.fname,
      "Last Name": formData.lname,
    };

    const baseData_c = {
      file_num: formData.fnum,
      name: formData.fname + " " + formData.lname,
      case_id: formData.casenum,
      date: today_str,
    };

    const baseData_d = {
      name: formData.fname + " " + formData.lname,
      date: today_str,
      "Case Number": `${formData.casenum}`,
      "First Name": formData.fname,
      "Last Name": formData.lname,
    };

    try {
      const pdfTemplateUrl = "../../files/cca/CCA Change Form.pdf";

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
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });

      if (
        formData.fnum === "" &&
        formData.fname === "" &&
        formData.lname === "" &&
        formData.casenum === ""
      ) {
        saveAs(blob, `2024 CCA Change Form.pdf`);
      } else {
        saveAs(
          blob,
          `${
            formData.fnum
          } ${formData.fname.toUpperCase()} ${formData.lname.toUpperCase()} ${current_year} CCA Change Form ${current_month
            .toString()
            .padStart(2, "0")}-${current_date
            .toString()
            .padStart(2, "0")}-${current_year}${current_year}.pdf`
        );
      }
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

        if (typeof value === "string") field.setText(value);
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });

      if (
        formData.fnum === "" &&
        formData.fname === "" &&
        formData.lname === "" &&
        formData.casenum === ""
      ) {
        saveAs(blob, `Attestation-Form-Income`);
      } else {
        saveAs(
          blob,
          `${
            formData.fnum
          } ${formData.fname.toUpperCase()} ${formData.lname.toUpperCase()} ${current_year} Attestation-Form-Income ${current_month
            .toString()
            .padStart(2, "0")}-${current_date
            .toString()
            .padStart(2, "0")}-${current_year}${current_year}.pdf`
        );
      }
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
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });

      if (
        formData.fnum === "" &&
        formData.fname === "" &&
        formData.lname === "" &&
        formData.casenum === ""
      ) {
        saveAs(blob, `AUTHORIZATION DELEGATE FORM`);
      } else {
        saveAs(
          blob,
          `${
            formData.fnum
          } ${formData.fname.toUpperCase()} ${formData.lname.toUpperCase()} ${current_year} AUTHORIZATION DELEGATE FORM ${current_month
            .toString()
            .padStart(2, "0")}-${current_date
            .toString()
            .padStart(2, "0")}-${current_year}${current_year}.pdf`
        );
      }
    } catch (error: any) {
      console.error("Error filling PDF:", error);
    }

    try {
      const pdfTemplateUrl = "../../files/cca/CASH INCOME LETTER.pdf";

      const arrayBuffer = await fetch(pdfTemplateUrl).then((res) => {
        if (!res.ok) throw new Error(`Error fetching PDF: ${res.statusText}`);
        return res.arrayBuffer();
      });

      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const form = pdfDoc.getForm();

      for (const [key, value] of Object.entries(baseData_d)) {
        const field = form.getTextField(key);

        if (typeof value === "string") {
          field.setText(value);
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });

      if (
        formData.fnum === "" &&
        formData.fname === "" &&
        formData.lname === "" &&
        formData.casenum === ""
      ) {
        saveAs(blob, `CASH INCOME LETTER.pdf`);
      } else {
        saveAs(
          blob,
          `${
            formData.fnum
          } ${formData.fname.toUpperCase()} ${formData.lname.toUpperCase()} ${current_year} CASH INCOME LETTER ${current_month
            .toString()
            .padStart(2, "0")}-${current_date
            .toString()
            .padStart(2, "0")}-${current_year}${current_year}.pdf`
        );
      }
    } catch (error: any) {
      console.error("Error filling PDF:", error);
    }
  };

  // Define form fields for rendering
  const fieldsData = [
    { id: "fnum", label: "FILE NUMBER" },
    { id: "fname", label: "FIRST NAME" },
    { id: "lname", label: "LAST NAME" },
    { id: "casenum", label: "CASE NUMBER" },
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
          className="rounded bg-blue-400 px-4 py-2 font-bold text-white transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          type="button"
          onClick={() => fillPdfAndDownload(data)}
        >
          领取全家桶
        </button>
      </form>
    </div>
  );
}
