"use client";
/* eslint-disable camelcase */

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import { searchProperty } from "../../../helper/func";

export default function Homestead() {
  // form input data
  const [data, setFormData] = useState({
    name: "",
    spouse: "",
    third: "",
    street: "",
  });

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [id]: value }));
  };

  // handle pdf filling and download
  const fillPdfAndDownload = async (formData: any) => {
    const today = new Date();
    const current_year = today.getFullYear();
    const current_date = today.getDate();
    const current_month = today.getMonth() + 1;

    // Assuming searchProperty and legalDescription are implemented somewhere
    const info = await searchProperty(formData.street);
    let baseData = {};
    if (
      formData.third !== "" &&
      formData.spouse !== "" &&
      formData.name !== ""
    ) {
      baseData = {
        "recording-name": `${formData.name.toUpperCase()}`,
        name: formData.name,
        "mail-address": info.street,
        "mail-address-2": `${info.city} ${info.zip}`,
        name1: `${formData.name}`,
        city: info.city.slice(0, -3),
        "street address": `${info.street}, ${info.city}\n ${info.zip}`,
        "legal-description": `${info.legalDescription}`,
        name2: `${formData.spouse}`,
        name3: `${formData.third}`,
        "print-name-1": `${formData.name.toUpperCase()}`,
        "print-name-2": `${formData.spouse.toUpperCase()}`,
        "print-name-3": `${formData.third.toUpperCase()}`,
        "1print-name-1": `${formData.name.toUpperCase()}`,
        "2print-name-2": `${formData.spouse.toUpperCase()}`,
        "3print-name-3": `${formData.third.toUpperCase()}`,
        for3:
          formData.name + " AND " + formData.spouse + " AND " + formData.third,
      };
    } else if (
      formData.spouse !== "" &&
      formData.third === "" &&
      formData.name !== ""
    ) {
      baseData = {
        "recording-name": `${formData.name.toUpperCase()}`,
        name: formData.name,
        "mail-address": info.street,
        "mail-address-2": `${info.city} ${info.zip}`,
        name1: `${formData.name}`,
        city: info.city.slice(0, -3),
        "street address": `${info.street}, ${info.city}\n ${info.zip}`,
        "legal-description": `${info.legalDescription}`,
        name2: `${formData.spouse}`,
        "print-name-1": `${formData.name.toUpperCase()}`,
        "print-name-2": `${formData.spouse.toUpperCase()}`,
        "1print-name-1": `${formData.name.toUpperCase()}`,
        "2print-name-2": `${formData.spouse.toUpperCase()}`,
        for2: formData.name + " AND " + formData.spouse,
      };
    } else {
      baseData = {
        "recording-name": `${formData.name.toUpperCase()}`,
        name: formData.name,
        "mail-address": info.street,
        "mail-address-2": `${info.city} ${info.zip}`,
        name1: `${formData.name}`,
        city: info.city.slice(0, -3),
        "street address": `${info.street}, ${info.city}\n ${info.zip}`,
        "legal-description": `${info.legalDescription}`,
        for1: formData.name,
      };
    }

    try {
      let pdfTemplateUrl = "../../files/home/HOMESTEAD1.pdf";
      if (
        formData.third !== "" &&
        formData.spouse !== "" &&
        formData.name !== ""
      ) {
        pdfTemplateUrl = "../../files/home/HOMESTEAD 3 OWNERS FORM.pdf";
      } else if (
        formData.spouse !== "" &&
        formData.third === "" &&
        formData.name !== ""
      ) {
        pdfTemplateUrl = "../../files/home/HOMESTEAD 2 OWNERS FORM.pdf";
      }

      const arrayBuffer = await fetch(pdfTemplateUrl).then((res) => {
        if (!res.ok) throw new Error(`Error fetching PDF: ${res.statusText}`);
        return res.arrayBuffer();
      });

      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const form = pdfDoc.getForm();

      for (const [key, value] of Object.entries(baseData)) {
        const field = form.getTextField(key);

        if (typeof value === "string") {
          field.setText(value);
        } else {
          console.warn(`Value for field ${key} is not a string:`, value);
        }
      }
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      if (formData.spouse === "" && formData.third === "") {
        if (formData.name === "") {
          saveAs(blob, `HOMESTAED 1 OWNER FORM.pdf`);
        } else {
          saveAs(
            blob,
            `${formData.name.toUpperCase()} ${current_year} HOMESTAED 1 OWNER FORM ${current_month
              .toString()
              .padStart(2, "0")}-${current_date
              .toString()
              .padStart(2, "0")}-${current_year}${current_year}.pdf`
          );
        }
      }
      if (formData.spouse !== "" && formData.third === "") {
        if (formData.name === "") {
          saveAs(blob, `HOMESTAED 2 OWNER FORM.pdf`);
        } else {
          saveAs(
            blob,
            `${formData.name.toUpperCase()} ${current_year} HOMESTAED 2 OWNER FORM ${current_month
              .toString()
              .padStart(2, "0")}-${current_date
              .toString()
              .padStart(2, "0")}-${current_year}${current_year}.pdf`
          );
        }
      }
      if (formData.spouse !== "" && formData.third !== "") {
        if (formData.name === "") {
          saveAs(blob, `HOMESTAED 3 OWNER FORM.pdf`);
        } else {
          saveAs(
            blob,
            `${formData.name.toUpperCase()} ${current_year} HOMESTAED 3 OWNER FORM ${current_month
              .toString()
              .padStart(2, "0")}-${current_date
              .toString()
              .padStart(2, "0")}-${current_year}${current_year}.pdf`
          );
        }
      }
    } catch (error: any) {
      console.error("Error filling PDF:", error);
    }
  };

  // Define form fields for rendering
  const fieldsData = [
    { id: "name", label: "NAME" },
    { id: "spouse", label: "SPOUSE (OPTIONAL)" },
    { id: "third", label: "THIRD" },
    {
      id: "street",
      label:
        "ONLY STREET NAME (only required)(Enter example: 5320 peck rd 29, instead 5320 peck rd #29)",
    },
  ];

  const searchItem = [
    {
      label: "Open LA County Assessor Portal",
      url: "https://portal.assessor.lacounty.gov/",
    },
    {
      label: "Open ORANGE County Assessor Portal",
      url: "https://www.ocgis.com/ocpw/landrecords/",
    },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center py-2">
      <form className="mb-4 flex w-full max-w-4xl flex-col rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-2xl font-semibold text-gray-800">
          Home Declaration (for LA County)
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
          className="mb-2 rounded-lg bg-gray-300 px-6 py-3 text-lg font-medium text-gray-700 shadow-md transition duration-300 hover:bg-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-400"
          type="button"
          onClick={() => fillPdfAndDownload(data)}
        >
          Fill and Download PDF
        </button>
        {searchItem.map((item) => (
          <button
            key={item.label}
            className="mb-2 rounded-lg bg-gray-300 px-6 py-3 text-lg font-medium text-gray-700 shadow-md transition duration-300 hover:bg-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-400"
            type="button"
            onClick={() => window.open(item.url, "_blank")}
          >
            {item.label}
          </button>
        ))}
      </form>
    </div>
  );
}
