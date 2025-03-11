const Card = ({ type, count, isLoading, error }) => {
    const LoadingSpinner = () => (
      <div className="flex justify-center items-center w-full h-full bg-gray-100 rounded-lg">
        <div className="border-4 border-t-4 border-gray-200 border-t-blue-500 w-12 h-12 rounded-full animate-spin"></div>
      </div>
    );
  
    return (
      <div className="rounded-2xl bg-white/20 backdrop-blur-md p-4 flex-1 min-w-[130px] shadow-lg border border-white/30">
       
          {isLoading || error ? (
            <LoadingSpinner />
          ) : (
            <>
               <div className="flex justify-between items-center">
              {/* Optional span for year (commented out in your code) */}
              {/* <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
                {year}
              </span> */}
  
              {/* Optional "More" button */}
              {/* <img src="/more.png" alt="More" width={20} height={20} /> */}
              </div>
              <h1 className="text-3xl font-bold my-4 text-white">{count}</h1>
              <h2 className="capitalize text-sm font-medium text-white/80">{type}</h2>
            </>
          )}        
      </div>
    );
  };
  
  export default Card;
  