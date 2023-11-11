"use client"

import { useRouter } from 'next/navigation';
import { saveAs } from 'file-saver';
import Image from 'next/image';
import tree from '../../public/tree.jpg';


export default function Home() {
  // Set up the router instance
  const router = useRouter();

  const downloadPdf = async () => {
    try {
      let pdfTemplateUrl = '../../files/2024 CCA Change Form 10-03-2023.pdf';
  
      const response = await fetch(pdfTemplateUrl);
      if (!response.ok) throw new Error(`Error fetching PDF: ${response.statusText}`);
      const blob = await response.blob();
      saveAs(blob, `2024 CCA Change Form 10-03-2023.pdf`);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };
  

  // Function to handle redirection
  const homestead = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // prevent default form submission
    router.push('/homestead'); // replace with the path to your next page
  };

  const aff_death = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // prevent default form submission
    router.push('/aff_death'); // replace with the path to your next page
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      
      <div className="text-center">

        <div className='w-full flex justify-center'>
          <Image src={tree} width={200} height={200} alt="APAC Logo" />
        </div>

        <br />
        
        <h1 className="text-4xl font-bold text-gray-800 mb-8">APAC Form Filler Home Page</h1>

        <button 
          onClick={downloadPdf}
          className="text-white bg-blue-400 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          CCA Form
        </button>

        <button 
          onClick={homestead}
          className="text-white bg-blue-400 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Homestead
        </button>

        <button 
          onClick={aff_death}
          className="text-white bg-blue-400 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Affidavit - Death of Trustee
        </button>
      </div>
    </div>
  )
}
