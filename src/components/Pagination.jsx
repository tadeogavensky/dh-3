

export const Pagination = ({currentPage, vehiclesPerPage,setCurrentPage,totalVehicles}) => {

    const pageNumber = []

    for (let i=1; i<= Math.ceil(totalVehicles/vehiclesPerPage); i++){
        
        pageNumber.push(i)
    }
    function Next ()
    {
        setCurrentPage(currentPage + 1)
    }
    function back ()
    {
        setCurrentPage(currentPage - 1)
    }
    return ( 
        <div className="flex justify-center">
            <div className=" bg-white rounded-lg font-[Poppins] flex items-center">
                <button onClick={back}
                className={`h-12 border-2 border-r-0 border-primary px-4 rounded-l-lg hover:bg-primary hover:text-white 
                ${currentPage === 1 ? "cursor-not-allowed opacity-30" : ""}`} disabled={currentPage === 1}>
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" fillRule="evenodd">                            
                        </path>
                    </svg>
                </button>
                {
                    pageNumber.map((pg, i) => (
                    <button key={i} onClick={() => setCurrentPage(pg)} className={`h-12 border-2 border-r-0 border-primary
                    w-12 ${currentPage === pg && 'bg-primary text-white'}`}>{pg}</button>
                    ))
                }
                <button onClick={Next} 
                className={`h-12 border-2 border-primary px-4 rounded-r-lg hover:bg-primary hover:text-white
                ${currentPage >= pageNumber.length ? "cursor-not-allowed opacity-30 border-l-0 " : ""}`} disabled={currentPage >= pageNumber.length}>
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" fillRule="evenodd">                            
                        </path>
                    </svg>
                </button>
            </div>
        </div>
    )
}