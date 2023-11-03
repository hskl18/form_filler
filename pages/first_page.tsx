"use client"

import { useRouter } from 'next/navigation';
import fieldsData from "../files/CCAFORM.json";

export default function First() {

  // Set up the router instance
  const router = useRouter();

  // Function to handle redirection
  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // prevent default form submission
    router.push('/second'); // replace with the path to your next page
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-screen-lg relative">
        <h1 className="text-2xl mb-4">Base Information</h1>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {fieldsData.first_check_list.map((item, index) => (
            <label key={index} className="flex items-center">
              <input 
                type="checkbox" 
                name={item} 
                className="mr-2"
              />
              {item}
            </label>
          ))}
        </div>
        
        <div className='flex-auto gap-4 px-10'>
          {fieldsData.first_fill.map(field => (
            <div key={field.id} className="mb-4 flex-1">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={field.id}>
                {field.required && <span className="text-red-500">*</span>} {field.label}:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id={field.id}
                type="text"
              />
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {fieldsData.second_check_list.map((item, index) => (
            <label key={index} className="flex items-center">
              <input 
                type="checkbox" 
                name={item} 
                className="mr-2"
              />
              {item}
            </label>
          ))}
        </div>
        
        
        <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline absolute right-2 m-4" 
          type="button"
          onClick={handleNext}
        >
          Next
        </button>
      </form>
    </div>
  );
}
