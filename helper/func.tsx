// Define the type for the expected fetch data
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

// Define a function to create a form field
function createButton(text: any, onClick: any) {
  return (
    <button
      className="rounded bg-blue-500 px-4 py-2 font-bold text-white transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
      type="button"
      onClick={onClick}
    >
      {text}
    </button>
  );
}
