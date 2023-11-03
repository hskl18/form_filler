"use client"

import { useRouter } from 'next/navigation';
import fieldsData from "../files/CCAFORM.json";

export default function Second() {
  const router = useRouter();

  const handlePrev = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push('/');
  };

  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push('/second');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-screen-lg relative">
        <h1 className="text-2xl mb-4">Information needs change</h1>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {fieldsData.third_check_list.map((item, index) => (
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

        <h3 className="text-2xl mb-4">Please Check All That Apply</h3>

        {/* Radio buttons for fourth_fill */}
        <div className=" flex-auto flex-wrap gap-2 mb-4">
          {fieldsData.fourth_fill.map((item, index) => (
            <label key={item.id} className="flex items-center">
              <input 
                type="radio" 
                name="fourth_fill" 
                value={item.id}
                className="mr-2"
              />
              {item.label}
            </label>
          ))}
        </div>
        
        <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline absolute left-2 m-4" 
          type="button"
          onClick={handlePrev}
        >
          Back
        </button>

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
