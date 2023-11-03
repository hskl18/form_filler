"use client"
import React, { useState } from 'react';

export default function Home() {
  const [address, setAddress] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async (event) => {
    event.preventDefault();
    setError('');
    setResults([]);

    try {
      const response = await fetch(`https://portal.assessor.lacounty.gov/api/search?search=${encodeURIComponent(address)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data && data.Parcels && data.Parcels.length > 0) {
        setResults(data.Parcels);
      } else {
        setError('No results found or empty data set returned.');
      }
    } catch (e) {
      setError(`There was a problem fetching the data: ${e.message}`);
    }
  };
  function copyToClipboard(text) {
    // Create a new textarea element and give it the value of the text to copy
    const textarea = document.createElement('textarea');
    textarea.value = text;
    // Set the textarea to be invisible and append it to the body
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    // Select the text inside the textarea and copy it
    textarea.select();
    document.execCommand('copy');
    // Remove the textarea from the body after copying
    document.body.removeChild(textarea);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md">
        <h1 className="text-3xl text-center font-semibold mb-6">Property Search</h1>
        <form onSubmit={handleSearch} className="mb-4">
          <div className="flex items-center border-b border-teal-500 py-2">
            <input
              className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter address"
              required
            />
            <button
              className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
              type="submit"
            >
              Search
            </button>
          </div>
        </form>
        {error && <p className="text-center text-red-500">{error}</p>}
        <div>
          {results.length > 0 ? (
            <ul className="list-disc">
              {results.map((parcel, index) => (
                <li key={index} className="mt-3">
                  <p className="text-sm font-bold">Steet Address: {parcel.SitusStreet}</p>
                  <p className="text-sm">AIN: {parcel.AIN} <br />
                  Legal Description: {parcel.LegalDescription}</p>
                  <button 
                    onClick={() => copyToClipboard(`AIN: ${parcel.AIN}\nLegal Description: ${parcel.LegalDescription}`)}
                    className="text-blue-600 hover:text-blue-800 visited:text-purple-600"
                  >
                    Copy
                  </button>

                </li>
              ))}
            </ul>
          ) : (
            !error && <p className="text-center">No data to display. Enter an address and click Search.</p>
          )}
        </div>
      </div>
    </div>
  )
}
