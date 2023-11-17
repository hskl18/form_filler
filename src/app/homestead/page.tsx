"use client";
/* eslint-disable camelcase */

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";

export default function Homestead() {
  const downloadPdf = async () => {
    try {
      const pdfTemplateUrl = "../../files/Homestead.pdf";

      const response = await fetch(pdfTemplateUrl);
      if (!response.ok)
        throw new Error(`Error fetching PDF: ${response.statusText}`);
      const blob = await response.blob();
      saveAs(blob, `Homestead.pdf`);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  const downloadPdfs = async () => {
    try {
      const pdfTemplateUrl = "../../files/HomesteadSpouse.pdf";

      const response = await fetch(pdfTemplateUrl);
      if (!response.ok)
        throw new Error(`Error fetching PDF: ${response.statusText}`);
      const blob = await response.blob();
      saveAs(blob, `HomesteadSpouse.pdf`);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  // Define the type for the expected fetch data
  type fetchDataType = {
    street: string;
    city: string;
    zip: string;
    legalDescription: string;
    ain: string;
  };

  async function searchProperty(address: any): Promise<fetchDataType> {
    try {
      const urlAddress = encodeURIComponent(address);
      const response = await fetch(
        `https://portal.assessor.lacounty.gov/api/search?search=${urlAddress}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data && data.Parcels && data.Parcels.length > 0) {
        const firstParcel = data.Parcels[0];
        // Create the string with AIN and Legal Description
        const result: fetchDataType = {
          street: firstParcel.SitusStreet || "",
          city: firstParcel.SitusCity || "",
          zip: firstParcel.SitusZipCode || "",
          ain: firstParcel.AIN || "",
          legalDescription:
            `AIN: ${firstParcel.AIN}\nLegal Description: ${firstParcel.LegalDescription}` ||
            "",
        };
        return result;
      } else {
        throw new Error("No results found or empty data set returned.");
      }
    } catch (e: any) {
      // Handle any errors that occur during the request
      throw new Error(`There was a problem fetching the data: ${e.message}`);
    }
  }

  // form input data
  const [data, setFormData] = useState({
    name: "",
    spouse: "",
    street: "",
    agent: "",
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
    if (formData.spouse === "") {
      baseData = {
        Text24: `${formData.name.toUpperCase()}`,
        Text2: formData.name,
        Text3: info.street,
        Text4: `${info.city} ${info.zip}`,
        // 'Text41': info.zip,
        Text5: `${formData.name}`,
        Text6: info.city,
        // Text7: formData.county,
        // Text8: "California",
        Text9: `${info.street}, ${info.city}\n ${info.zip}`,
        Text10: `${info.legalDescription}`, // assuming this comes from the searchProperty function
        // 'MMMM D': today_str,
        // 'YYYY': `${current_year}`,
        "Text Field0": `${formData.name}`,
        Text14: formData.county,
        // 'Text15': `${today_str}/${current_year}`,
        Text16: formData.agent,
        Text17: formData.name,
      };
    } else {
      baseData = {
        "recording-name": formData.name,
        "mail-name": formData.name,
        "mail-address": info.street,
        "mail-address-2": `${info.city} ${info.zip}`,
        "spouse-1": formData.name,
        "spouse-2": formData.spouse,
        city: info.city,
        "street address": `${info.street}, ${info.city}\n ${info.zip}`,
        "print-name-1": formData.name,
        "print-name-2": formData.spouse,
        "legal-description": info.legalDescription,
        Text16: formData.agent,
        Text17: formData.name,
        "Text-ud3lxdkmRq": "Los Angeles",
      };
    }

    try {
      let pdfTemplateUrl = "";
      if (formData.spouse === "") {
        pdfTemplateUrl = "../../files/home/HOMESTAED 1 OWNER FORM.pdf";
      } else {
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
      // form.flatten(); will cost a bug
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      if (formData.spouse === "") {
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
      } else {
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
    } catch (error: any) {
      console.error("Error filling PDF:", error);
    }
  };

  // Define form fields for rendering
  const fieldsData = [
    { id: "name", label: "Name" },
    { id: "spouse", label: "Spouse (Optional)" },
    {
      id: "street",
      label:
        "Street (require!)(Enter example: 5320 peck rd 29, instead 5320 peck rd #29)",
    },
    { id: "agent", label: "Agent" },
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
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          type="button"
          onClick={() => fillPdfAndDownload(data)}
        >
          Fill and Download PDF
        </button>

        <br />
        <br />

        <button
          className="rounded bg-blue-400 px-4 py-2 font-bold text-white transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          type="button"
          onClick={downloadPdf}
        >
          Just download the fillable PDF
        </button>
        <br />
        <button
          className="rounded bg-blue-400 px-4 py-2 font-bold text-white transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          type="button"
          onClick={downloadPdfs}
        >
          Just download the fillable PDF for Spouse
        </button>
        <br />
        <button
          className="rounded bg-blue-400 px-4 py-2 font-bold text-white transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          type="button"
          onClick={() =>
            window.open("https://portal.assessor.lacounty.gov/", "_blank")
          }
        >
          Open LA County Assessor Portal
        </button>
      </form>
    </div>
  );
}
