const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    // Funktion för att skapa sidnummer
    const getPages = () => {
      const pages = [];
      for (
        let i = Math.max(1, currentPage - 2);
        i <= Math.min(totalPages, currentPage + 2);
        i++
      ) {
        pages.push(i);
      }
      return pages;
    };
  
    const pages = getPages();
  
    return (
      <div className="flex justify-center items-center space-x-2 mt-4">
        {/* Föregående Knapp */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 border rounded ${
            currentPage === 1
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Föregående
        </button>
  
        {/* Sidnummer */}
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 border rounded ${
              currentPage === page
                ? "bg-blue-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        ))}
  
        {/* Nästa Knapp */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 border rounded ${
            currentPage === totalPages
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Nästa
        </button>
      </div>
    );
  };
  
  export default Pagination;
  