"use client";
/* eslint-disable camelcase */

import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";

export default function Aff_death() {
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
    street: "",
    county: "",
    name: "",
    decedentName: "",
    dateOfDeclarationOfTrust: "",
    signatoryName: "",
    dateOfDeed: "",
    documentNumber: "",
    bookNumber: "",
    pageNumber: "",
    trustName: "",
    feild: "",
  });

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [id]: value }));
  };

  // handle pdf filling and download
  const fillPdfAndDownload = async (formData: any) => {
    // Assuming searchProperty and legalDescription are implemented somewhere
    const info = await searchProperty(formData.street);
    const baseData = {
      "Printed Name of Trust": formData.trustName,
      "Recording Requested by": formData.name,
      Name: formData.name,
      "Mailing Address": `${info.street}`,
      "City State Zip": `${info.city},${info.zip}`,
      "Assessor's Parcel No": info.ain,
      County: `  ${formData.county}`,
      "Name of Declarant": formData.name,
      "Name of Decedent": formData.decedentName,
      "Date of Declaration of Trust": `${formData.dateOfDeclarationOfTrust}`,
      "Signed by": formData.signatoryName,
      "signed by continued": "",

      "Date of Deed": formData.dateOfDeed,
      "Document No": formData.documentNumber,
      "Book No": formData.bookNumber,
      "Page No": formData.pageNumber,
      "Name of County": formData.county,
      "County-2": formData.county,
      "Property Description": `${info.street},${info.city}, CA ${info.zip}\n${info.legalDescription}\n${formData.feild}`,
      "Name of Declarant-2": formData.name,
    };

    try {
      const pdfTemplateUrl = "../../files/aff/AffidavitOfDeath.pdf";

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
      saveAs(blob, `${formData.name}_filled_form.pdf`);
    } catch (error: any) {
      console.error("Error filling PDF:", error);
    }
  };

  // Define form fields for rendering
  const fieldsData = [
    {
      id: "street",
      label:
        "Address (street only) (Enter example: 5320 peck rd 29, instead 5320 peck rd #29)",
    },
    { id: "county", label: "County" },
    { id: "name", label: "Name (Surviving/Successor Trustee/Requstor)" },
    { id: "decedentName", label: "decedent name" },
    {
      id: "dateOfDeclarationOfTrust",
      label: "date of declaration of trust (Notary date of Trust)",
    },
    { id: "signatoryName", label: "signatory name (Trustor(s))" },
    { id: "dateOfDeed", label: "date of deed (dirst recoding date of trust)" },
    { id: "documentNumber", label: "document number (Instument #)" },
    { id: "bookNumber", label: "book number" },
    { id: "pageNumber", label: "page number" },
    { id: "trustName", label: "trust name" },
    { id: "feild", label: "Description (opional)" },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f2f2f2] py-2">
      <form className="mb-4 flex w-full max-w-4xl flex-col rounded-lg p-8">
        <h1 className="mb-6 text-2xl font-semibold text-gray-800">
          Affidavit - Death of Trustee
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
          className="mb-2 rounded-lg bg-gray-200 px-6 py-3 text-lg font-medium text-gray-700 shadow-md transition duration-300 hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-300"
          type="button"
          onClick={() => fillPdfAndDownload(data)}
        >
          Fill and Download PDF
        </button>

        <button
          className="mb-2 rounded-lg bg-gray-200 px-6 py-3 text-lg font-medium text-gray-700 shadow-md transition duration-300 hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-300"
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
