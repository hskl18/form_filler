"use client";

import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { saveAs } from 'file-saver';

export default function Home() {
  
  const [data, setFormData] = useState({
    name: '',
    trustName: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    county: '',
    agent: '',
  });

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prevState => ({ ...prevState, [id]: value }));
  };
  

  const fillPdfAndDownload = async (formData: any) => {
    // Assuming searchProperty and legalDescription are implemented somewhere
    const legalDescription = await searchProperty(formData.street);
    const today = new Date();
    const today_str = `${today.getMonth() + 1}/${today.getDate()}`;
    const current_year = today.getFullYear();
  
    const baseData = {
      'Text24': formData.name + ", Trustee",
      'Text2': formData.trustName,
      'Text3': formData.street,
      'Text4': `${formData.city}, ${formData.state}, ${formData.zip}`,
      // 'Text41': 'formData.zip',
      'Text5': `${formData.name}, TRUSTEE OF THE ${formData.trustName.toUpperCase()}`,
      'Text6': formData.city,
      'Text7': formData.county,
      'Text8': formData.state,
      'Text9': `${formData.street}, ${formData.city} ${formData.state} ${formData.zip}`,
      'Text10': legalDescription, // assuming this comes from the searchProperty function
      'MMMM D': today_str,
      'YYYY': `${current_year}`,
      'Text Field0': `${formData.name}, Trustee`,
      'Text14': formData.county,
      'Text15': `${today_str}/${current_year}`,
      'Text16': formData.agent,
      'Text17': formData.name
    };
  
    try {
      const pdfTemplateUrl = '../../files/Homestead.pdf';
      const arrayBuffer = await fetch(pdfTemplateUrl).then(res => {
        if (!res.ok) throw new Error(`Error fetching PDF: ${res.statusText}`);
        return res.arrayBuffer();
      });
  
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const form = pdfDoc.getForm();
  
      for (const [key, value] of Object.entries(baseData)) {
        const field = form.getTextField(key);
        if (field) {
          field.setText(value);
        } else {
          // If the field is not found, you may want to handle it differently
          console.warn(`No field named ${key} found`);
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
    { id: 'trustName', label: 'Trust Name' },
    { id: 'street', label: 'Street' },
    { id: 'city', label: 'City' },
    { id: 'county', label: 'County' },
    { id: 'state', label: 'State' },
    { id: 'zip', label: 'ZIP Code' },
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
      </form>
    </div>

  );
}

async function searchProperty(address:any) {
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
      const resultString = `AIN: ${firstParcel.AIN}\nLegal Description: ${firstParcel.LegalDescription}`;
      return resultString;
    } else {
      return 'No results found or empty data set returned.';
    }
  } catch (e:any) {
    // Handle any errors that occur during the request
    return `There was a problem fetching the data: ${e.message}`;
  }
}
