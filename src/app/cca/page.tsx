"use client";
/* eslint-disable camelcase */

import React, { useState } from "react";
import { getPDF } from "../../../helper/func";

export default function Aff_death() {
  // form input data
  const [data, setFormData] = useState({
    fNum: "",
    name: "",
    caseNum: "",
    phone: "",
    agent: "",
    income: "",
  });
  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [id]: value }));
  };

  // handle pdf filling and download
  const fillPdfAndDownload = async (formData: any) => {
    if (formData.caseNum.length > 10) {
      alert("case number must be 10 digits");
      return;
    }
    if (formData.phone.replace(/\D/g, "").length > 10) {
      alert("phone number must be 10 digits");
      return;
    }
    const today = new Date();
    const today_str = `${
      today.getMonth() + 1
    }/${today.getDate()}/${today.getFullYear()}`;
    const current_month = today.getMonth() + 1;

    const nameParts = formData.name.split(" ");
    const lastName = nameParts.pop(); // Removes and returns the last element
    const firstName = nameParts.join(" "); // Joins the remaining elements

    // Remove all non-numeric characters
    const phone = formData.phone.replace(/\D/g, "");
    // Format the string to (XXX) XXX-XXXX
    const phoneNum = phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");

    let thousands = "";
    let hundreds = "";
    let cents = "";

    // Check if the income string contains a decimal point
    if (formData.income.includes(".")) {
      // Split the income string at the decimal point
      const parts = formData.income.split(".");

      // The part before the decimal point (thousands and hundreds)
      const wholePart = parts[0];

      // Extract thousands and hundreds if the length is sufficient
      if (wholePart.length > 3) {
        thousands = wholePart.slice(0, -3).padStart(3, "0");
        hundreds = wholePart.slice(-3);
      } else {
        hundreds = wholePart.padStart(3, "0");
      }

      // The part after the decimal point (cents)
      cents = parts[1].padEnd(2, "0");
    } else {
      // Check if the income string length is more than 3
      if (formData.income.length > 3) {
        // Extract the last three characters as hundreds
        hundreds = formData.income.slice(-3);

        // Extract the remaining part as thousands
        thousands = formData.income.slice(0, -3).padStart(3, "0");
      } else {
        // If the string is 3 characters or less, it's all in hundreds
        if (formData.income.length > 0) {
          hundreds = formData.income.padStart(3, "0");
        }
      }
      if (formData.income.length > 0) {
        cents = "00";
      }
    }

    // Additional code to handle the results goes here

    const ccaFill = {
      agent: formData.agent || "",
      filenum: formData.fNum || "",
      name: formData.name || "",
      date: today_str || "",
      case: formData.caseNum || "",
      phone: phoneNum || "",
      annuealincome: formData.income || "",
    };

    const attFill = {
      "Case Number": formData.caseNum || "",
      "First Name": firstName || "",
      "Last Name": lastName || "",
      MM: current_month.toString().padStart(2, "0") || "",
      DD: today.getDate().toString().padStart(2, "0") || "",
      YYYY: today.getFullYear().toString() || " ",

      Thousands: thousands || "",
      Hundreds: hundreds || "",
      Cents: cents || "",
    };

    const cashFill = {
      // cash: income || "",
      name: formData.name || "",
      date: today_str || "",
      what: phoneNum || " ",
      "Case Number": formData.caseNum || "",
      "First Name": firstName || "",
      "Last Name": lastName || "",
      MM: current_month.toString().padStart(2, "0") || "",
      DD: today.getDate().toString().padStart(2, "0") || "",
      YYYY: today.getFullYear().toString() || "",

      Thousands: thousands || "",
      Hundreds: hundreds || "",
      Cents: cents || "",
    };

    getPDF(
      attFill,
      formData,
      "../../files/cca/ATTESTATION FORM.pdf",
      "Attestation Form Income"
    );
    getPDF(
      cashFill,
      formData,
      "../../files/cca/CASH INCOME LETTER.pdf",
      "CASH INCOME LETTER"
    );

    getPDF(
      ccaFill,
      formData,
      "../../files/cca/CCA Change Form.pdf",
      "CCA Change Form"
    );
  };

  // Define form fields for rendering
  const fieldsData = [
    { id: "fNum", label: "FILE#" },
    { id: "name", label: "NAME" },
    { id: "agent", label: "AGENT" },
    { id: "caseNum", label: "CASE#" },
    { id: "phone", label: "PHONE" },
    { id: "income", label: "ANNUAL INCOME" },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
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
        <br />
        <button
          className="rounded bg-blue-400 px-4 py-2 font-bold text-white transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          type="button"
          onClick={() =>
            window.open(
              "https://apply.coveredca.com/lw-shopandcompare/?lang=en_EN",
              "_blank"
            )
          }
        >
          CCA Shop and Compare
        </button>
      </form>
    </div>
  );
}
