"use client";

import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';

export default function Homestead() {

  const downloadPdf = async () => {
    try {
      let pdfTemplateUrl = '../../files/Homestead.pdf';
  
      const response = await fetch(pdfTemplateUrl);
      if (!response.ok) throw new Error(`Error fetching PDF: ${response.statusText}`);
      const blob = await response.blob();
      saveAs(blob, `Homestead.pdf`);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  const downloadPdfs = async () => {
    try {
      let pdfTemplateUrl = '../../files/HomesteadSpouse.pdf';
  
      const response = await fetch(pdfTemplateUrl);
      if (!response.ok) throw new Error(`Error fetching PDF: ${response.statusText}`);
      const blob = await response.blob();
      saveAs(blob, `HomesteadSpouse.pdf`);
    } catch (error) {
      console.error('Error downloading PDF:', error);
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

  async function searchProperty(address:any): Promise<fetchDataType> {
    try {
      const urlAddress = encodeURIComponent(address);
      const response = await fetch(`https://portal.assessor.lacounty.gov/api/search?search=${urlAddress}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data && data.Parcels && data.Parcels.length > 0) {
        const firstParcel = data.Parcels[0];
        // Create the string with AIN and Legal Description
        const result: fetchDataType = {
          street: firstParcel.SitusStreet || '',
          city: firstParcel.SitusCity || '',
          zip: firstParcel.SitusZipCode || '',
          ain: firstParcel.AIN || '',
          legalDescription: `AIN: ${firstParcel.AIN}\nLegal Description: ${firstParcel.LegalDescription}` || ''
        };
        return result;
      } else {
        throw new Error('No results found or empty data set returned.');
      }
    } catch (e:any) {
      // Handle any errors that occur during the request
      throw new Error(`There was a problem fetching the data: ${e.message}`);
    }
  }
  
  //form input data
  const [data, setFormData] = useState({
    name: '',
    spouse: '',
    street: '',
    county: '',
    agent: '',
  });


  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prevState => ({ ...prevState, [id]: value }));
  };
  
  //handle pdf filling and download
  const fillPdfAndDownload = async (formData: any) => {
    // Assuming searchProperty and legalDescription are implemented somewhere
    const info = await searchProperty(formData.street);
    // const today = new Date();
    // const today_str = `${today.getMonth() + 1}/${today.getDate()}`;
    // const current_year = today.getFullYear();
    let baseData = {};
    if (formData.spouse=== ''){
      baseData = {
        'Text24': `\n ${formData.name.toUpperCase()}`,
        'Text2': formData.name,
        'Text3': info.street,
        'Text4': `${info.city}, CA ${info.zip}`,
        // 'Text41': info.zip,
        'Text5': `${formData.name}`,
        'Text6': info.city,
        'Text7': formData.county,
        'Text8': "California",
        'Text9': `${info.street}, ${info.city},\nCA ${info.zip}`,
        'Text10': `\n${info.legalDescription}`, // assuming this comes from the searchProperty function
        // 'MMMM D': today_str,
        // 'YYYY': `${current_year}`,
        // 'Text Field0': `${formData.name}, Trustee`,
        'Text14': formData.county,
        // 'Text15': `${today_str}/${current_year}`,
        'Text16': formData.agent,
        'Text17': formData.name
      };
    }
    else{
      baseData = {
        'Assessors Parcel No APN': info.ain,
        'recording-name':formData.name,
        'mail-name':formData.name,
        'mail-address':info.street,
        'mail-address-2':`${info.city}, CA ${info.zip}`,
        'spouse-1':formData.name,
        'spouse-2':formData.spouse,
        'city':info.city,
        'street address':info.street,
        'print-name-1': formData.name,
        'print-name-2': formData.spouse,
        'legal-description':info.legalDescription,
      }
    }
    
  
    try {
      let pdfTemplateUrl ='';
      if (formData.spouse=== '') {pdfTemplateUrl = '../../files/Homestead.pdf';}
      else {pdfTemplateUrl = '../../files/HomesteadSpouse.pdf';}

      const arrayBuffer = await fetch(pdfTemplateUrl).then(res => {
        if (!res.ok) throw new Error(`Error fetching PDF: ${res.statusText}`);
        return res.arrayBuffer();
      });
  
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const form = pdfDoc.getForm();
  
      for (const [key, value] of Object.entries(baseData)) {
        const field = form.getTextField(key);

        if (typeof value === 'string') {
          field.setText(value);
        } else {
          console.warn(`Value for field ${key} is not a string:`, value);
        }

      }
  
      form.flatten();
  
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      saveAs(blob, `${formData.name}_filled_form.pdf`);
    } catch (error:any) {
      console.error('Error filling PDF:', error);
    }
  };

  

  // Define form fields for rendering
  const fieldsData = [
    { id: 'name', label: 'Name' },
    { id: 'spouse', label: 'Spouse' },
    { id: 'street', label: 'Street (Enter example: 5320 peck rd 29, instead 5320 peck rd #29)' },
    // { id: 'city', label: 'City' },
    { id: 'county', label: 'County' },
    // { id: 'zip', label: 'ZIP Code' },
    { id: 'agent', label: 'Agent' },
    // Add other fields as needed
  ];

  return (
    <div className="flex items-center justify-center min-h-screen py-2">
      <form className="bg-white shadow-md rounded-lg p-8 mb-4 flex flex-col w-full max-w-4xl">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Home Declaration</h1>
      
        {fieldsData.map((field) => (
          <div key={field.id} className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-2" htmlFor={field.id}>
              {field.label}:
            </label>
            <input
              className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              id={field.id}
              type="text"
              onChange={handleChange}
            />
          </div>
        ))}
      
        <br />
        <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" 
          type="button"
          onClick={() => fillPdfAndDownload(data)}
        >
          Fill and Download PDF
        </button>
        

        <br />
        <br />

        <button 
          className="bg-blue-400 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" 
          type="button"
          onClick={downloadPdf}
        >
          Just download the fillable PDF
        </button>
        <br />
        <button 
          className="bg-blue-400 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" 
          type="button"
          onClick={downloadPdfs}
        >
          Just download the fillable PDF for Spouse
        </button>
        <br />
        <button 
          className="bg-blue-400 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" 
          type="button"
          onClick={() => window.open('https://portal.assessor.lacounty.gov/', '_blank')}
        >
          Open LA County Assessor Portal
        </button>


      </form>
    </div>

  );
}