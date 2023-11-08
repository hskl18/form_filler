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
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({ ...prevState, [id]: value }));
  };

  const fillPdfAndDownload = async (formData) => {
    console.log('Starting PDF fill-in process');
  
    try {
      // Set the relative path to the PDF template within your project
      const pdfTemplateUrl = '../../files/Homestead.pdf';
  
      // Fetch the PDF template
      const arrayBuffer = await fetch(pdfTemplateUrl).then(res => {
        if (!res.ok) throw new Error(`Error fetching PDF: ${res.statusText}`);
        return res.arrayBuffer();
      });
      console.log('PDF template fetched');
  
      // Load the PDF document
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      console.log('PDF loaded');
  
      // This should be your actual fields and values you wish to update
      const formValues = {
        name: formData.name,
        // ... other form fields and their corresponding values
      };
  
      // Fill the form with values
      const form = pdfDoc.getForm();
      for (const [key, value] of Object.entries(formValues)) {
        const field = form.getTextField(key);
        if (field) {
          field.setText(value);
          console.log(`Field ${key} set to ${value}`);
        } else {
          console.log(`No field named ${key} found`);
        }
      }
  
      form.flatten();
  
      // Save the filled PDF
      const pdfBytes = await pdfDoc.save();
      console.log('PDF saved');
  
      // Trigger the download
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      saveAs(blob, `${formData.name}_filled_form.pdf`);
      console.log('Download should now trigger');
    } catch (error) {
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
// Client-side version of `search_property` function
async function searchProperty(address) {
  const urlAddress = encodeURIComponent(address);
  try {
    const response = await fetch(`https://your.api/endpoint?address=${urlAddress}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Process your data and return the legal description
    // Replace the return below with your actual logic
    return data.legalDescription;
  } catch (error) {
    console.error(`There was a problem fetching the property data: ${error}`);
    return ''; // Return an empty string or some error indicator as appropriate
  }
}