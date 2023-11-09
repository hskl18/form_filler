"use client"

import { useRouter } from 'next/navigation';

export default function Home() {
  // Set up the router instance
  const router = useRouter();

  // Function to handle redirection
  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // prevent default form submission
    router.push('/homestead'); // replace with the path to your next page
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Form Filler Home Page</h1>
        <button 
          onClick={handleNext}
          className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Homestead
        </button>
      </div>
    </div>
  )
}
