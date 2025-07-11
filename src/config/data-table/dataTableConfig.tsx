
export const pageToShow = 5;
export const rowsToShow = 10;
export const paginatorTemplate = {
    layout:
      "CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink",
    CurrentPageReport: (options: any) => {
      const start = options.first;
      const end = Math.min(options.first + options.rows, options.totalRecords);
      const isLastPage = end === options.totalRecords;
      const displayEnd = isLastPage ? end : end - 1;
  
      return (
        <span className="text-gray-600 dark:text-[cAcAcA]! text-sm paginator-text absolute left-[15px]">
          Showing {start} to {displayEnd} of {options.totalRecords} entries
        </span>
      );
    },
  };
  