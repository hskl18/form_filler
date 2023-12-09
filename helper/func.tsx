// Define the type for the expected fetch data

/* eslint-disable camelcase */

import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";

export type fetchDataType = {
  street: string;
  city: string;
  zip: string;
  legalDescription: string;
  ain: string;
};

export async function searchProperty(address: any): Promise<fetchDataType> {
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

export function fileName(fileNum: string, name: string, formName: string) {
  const today = new Date();
  const current_month = today.getMonth() + 1;

  if (fileNum === "" && name === "") {
    return `${formName}.pdf`;
  } else {
    return `${fileNum} ${name.toUpperCase()} ${formName} ${current_month
      .toString()
      .padStart(2, "0")}-${today
      .getDate()
      .toString()
      .padStart(2, "0")}-${today.getFullYear()}${today.getFullYear()}.pdf`;
  }
}

export async function getPDF(
  baseData: any,
  formData: any,
  filePath: string,
  file: string
) {
  try {
    const pdfTemplateUrl = filePath;

    const arrayBuffer = await fetch(pdfTemplateUrl).then((res) => {
      if (!res.ok) throw new Error(`Error fetching PDF: ${res.statusText}`);
      return res.arrayBuffer();
    });

    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const form = pdfDoc.getForm();

    for (const [key, value] of Object.entries(baseData)) {
      const field = form.getTextField(key);

      if (typeof value === "string") field.setText(value);
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });

    saveAs(blob, `${fileName(formData.fNum, formData.name, file)}`);
  } catch (error: any) {
    console.error("Error filling PDF:", error);
  }
}
