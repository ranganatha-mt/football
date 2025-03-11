const Pagination = ({ page, total, limit, setPage, fetchData, search='', userType='' }) => {
    const totalPages = Math.ceil(total / limit);
    const maxPagesToShow = 5; // Limit the number of visible pages
  
    const getPageNumbers = () => {
      let pages = [];
      if (totalPages <= maxPagesToShow) {
        pages = Array.from({ length: totalPages }, (_, i) => i + 1);
      } else {
        if (page <= 3) {
          pages = [1, 2, 3, "...", totalPages];
        } else if (page >= totalPages - 2) {
          pages = [1, "...", totalPages - 2, totalPages - 1, totalPages];
        } else {
          pages = [1, "...", page - 1, page, page + 1, "...", totalPages];
        }
      }
      return pages;
    };
  
    return (
      <div className="p-4 flex items-center justify-between text-gray-500">
        {/* Previous Button */}
        <button
          className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
  
        {/* Page Numbers */}
        <div className="flex items-center gap-2 text-sm">
          {getPageNumbers().map((p, index) =>
            p === "..." ? (
              <span key={index} className="px-2">...</span>
            ) : (
              <button
                key={index}
                className={`px-2 rounded-sm  ${
                  page === p ? "bg-blue-300 text-white" : "bg-slate-200"
                }`}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            )
          )}
        </div>
  
        {/* Next Button */}
        <button
          className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={page * limit >= total}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    );
  };
  
  export default Pagination;
  