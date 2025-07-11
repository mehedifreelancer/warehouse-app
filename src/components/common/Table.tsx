import React, { useState } from 'react';
import addIcon from '.../../../../assets/icons/Table/add.svg';
import editIcon from '.../../../../assets/icons/Table/edit.svg'
import viewIcon from '.../../../../assets/icons/Table/view.svg'
import deleteIcon from '.../../../../assets/icons/Table/delete.svg'
import { ChevronDown, ChevronRight } from 'lucide-react';


interface Organization {
  id: number;
  name: string;
  parentOrg: string;
  isLine: boolean;
  isFinishing: boolean;
  code: string;
  address: string;
  startTime: string;
  lunchStartTime: string;
  lunchEndTime: string;
  workingHour: number;
  expanded?: boolean;
  level?: number;
}

const Table: React.FC = () => {
//   ================= Sample data based on the image ======================//
  const allOrganizations: Organization[] = [
    {
      id: 1,
      name: "Root",
      parentOrg: "",
      isLine: true,
      isFinishing: true,
      code: "123",
      address: "Dhaka",
      startTime: "12:00",
      lunchStartTime: "13:00",
      lunchEndTime: "14:00",
      workingHour: 10,
      expanded: true,
      level: 0
    },
    {
      id: 2,
      name: "4A Yarn Dyeing Ltd",
      parentOrg: "Root",
      isLine: true,
      isFinishing: true,
      code: "",
      address: "",
      startTime: "08:00",
      lunchStartTime: "13:00",
      lunchEndTime: "14:00",
      workingHour: 10,
      expanded: true,
      level: 1
    },
    {
      id: 3,
      name: "4A-1 IST",
      parentOrg: "4A Yarn Dyeing Ltd",
      isLine: true,
      isFinishing: true,
      code: "",
      address: "",
      startTime: "08:00",
      lunchStartTime: "13:00",
      lunchEndTime: "14:00",
      workingHour: 10,
      expanded: true,
      level: 2
    },
    {
      id: 4,
      name: "4A-1 IST",
      parentOrg: "4A-1 IST",
      isLine: true,
      isFinishing: true,
      code: "",
      address: "",
      startTime: "08:00",
      lunchStartTime: "13:00",
      lunchEndTime: "14:00",
      workingHour: 10,
      level: 3
    },
    {
      id: 5,
      name: "4A-1 IST",
      parentOrg: "4A-1 IST",
      isLine: true,
      isFinishing: true,
      code: "",
      address: "",
      startTime: "08:00",
      lunchStartTime: "13:00",
      lunchEndTime: "14:00",
      workingHour: 10,
      level: 3
    },
    {
      id: 6,
      name: "4A-1 IST",
      parentOrg: "4A-1 IST",
      isLine: true,
      isFinishing: true,
      code: "",
      address: "",
      startTime: "08:00",
      lunchStartTime: "13:00",
      lunchEndTime: "14:00",
      workingHour: 10,
      level: 3
    },
    {
      id: 7,
      name: "4A-1 IST",
      parentOrg: "4A-1 IST",
      isLine: true,
      isFinishing: true,
      code: "",
      address: "",
      startTime: "08:00",
      lunchStartTime: "13:00",
      lunchEndTime: "14:00",
      workingHour: 10,
      level: 3
    },
    {
      id: 8,
      name: "4A-1 IST",
      parentOrg: "4A-1 IST",
      isLine: true,
      isFinishing: true,
      code: "",
      address: "",
      startTime: "08:00",
      lunchStartTime: "13:00",
      lunchEndTime: "14:00",
      workingHour: 10,
      level: 3
    },
    {
      id: 9,
      name: "4A-1 IST",
      parentOrg: "4A-1 IST",
      isLine: true,
      isFinishing: true,
      code: "",
      address: "",
      startTime: "08:00",
      lunchStartTime: "13:00",
      lunchEndTime: "14:00",
      workingHour: 10,
      level: 3
    },
    {
      id: 10,
      name: "4A-1 IST",
      parentOrg: "4A-1 IST",
      isLine: true,
      isFinishing: true,
      code: "",
      address: "",
      startTime: "08:00",
      lunchStartTime: "13:00",
      lunchEndTime: "14:00",
      workingHour: 10,
      level: 3
    },
    {
      id: 11,
      name: "App Test 123",
      parentOrg: "Root",
      isLine: true,
      isFinishing: true,
      code: "",
      address: "",
      startTime: "08:00",
      lunchStartTime: "13:00",
      lunchEndTime: "14:00",
      workingHour: 10,
      level: 1
    },
    {
      id: 12,
      name: "Aqua Diamond",
      parentOrg: "Root",
      isLine: true,
      isFinishing: false,
      code: "123",
      address: "Maldives",
      startTime: "08:00",
      lunchStartTime: "13:00",
      lunchEndTime: "14:00",
      workingHour: 10,
      level: 1
    },
    {
      id: 13,
      name: "myh_In1",
      parentOrg: "Root",
      isLine: false,
      isFinishing: false,
      code: "myh_In1",
      address: "Dhaka",
      startTime: "08:00",
      lunchStartTime: "13:00",
      lunchEndTime: "14:00",
      workingHour: 10,
      level: 1
    }
  ];

//   ============= Pagination state ===================//
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(allOrganizations.length / itemsPerPage);

//   ====== Get current items =========//
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = allOrganizations.slice(indexOfFirstItem, indexOfLastItem);

//   ========= Handle page change ===========//
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

//    ============ Generate page numbers  ============//
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push('...');
        }
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="w-full flex flex-col" style={{ height: 'calc(100vh - 200px)' }}>
        {/* ================ Container =============== */}
      <div className="overflow-auto flex-1 rounded-t-md">
        {/* ============ Table Container ============ */}
        <table className="w-full border-collapse">
            {/* ================= Table Header ============= */}
          <thead className=''>
            <tr className="bg-gray-50 sticky top-0 z-1">
              <th className="px-1 text-center py-3 text-[#444050] text-[15px] leading-[100%] border-b border-gray-200">
                ORG Name
              </th>
              <th className="px-1 text-center py-3 text-[#444050] text-[15px] leading-[100%] border-b border-gray-200">
                Parent Org
              </th>
              <th className="px-1 text-center py-3 text-[#444050] text-[15px] leading-[100%] border-b border-gray-200">
                Is Line
              </th>
              <th className="px-1 text-center py-3 text-[#444050] text-[15px] leading-[100%] border-b border-gray-200">
                Is Finishing
              </th>
              <th className="px-1 text-center py-3 text-[#444050] text-[15px] leading-[100%] border-b border-gray-200">
                Code
              </th>
              <th className="px-1 text-center py-3 text-[#444050] text-[15px] leading-[100%] border-b border-gray-200">
                Address
              </th>
              <th className="px-1 text-center py-3 text-[#444050] text-[15px] leading-[100%] border-b border-gray-200">
                Start Time
              </th>
              <th className="px-1 text-center py-3 text-[#444050] text-[15px] leading-[100%] border-b border-gray-200">
                Lunch Start Time
              </th>
              <th className="px-1 text-center py-3 text-[#444050] text-[15px] leading-[100%] border-b border-gray-200">
                Lunch End Time
              </th>
              <th className="px-1 text-center py-3 text-[#444050] text-[15px] leading-[100%] border-b border-gray-200">
                Working Hour
              </th>
              <th className="px-1 text-center py-3 text-[#444050] text-[15px] leading-[100%] border-b border-gray-200">
                Actions
              </th>
            </tr>
          </thead>

          {/* ========================= Table Body ==================== */}
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((org) => (
              <tr key={org.id} className="hover:bg-gray-50">
                <td className="px-2 py-2 whitespace-nowrap">
                  <div className="flex items-center justify-center">
                    <div className="flex-shrink-0 pr-2">
                      {org.expanded ? (
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      ) : org.level !== 3 ? (
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      ) : null}
                    </div>
                    <div className="ml-4 text-sm text-[#6D6B77] text-center" style={{ marginLeft: `${org.level ? org.level * 20 : 0}px` }}>
                      {org.name}
                    </div>
                  </div>
                </td>
                <td className=" text-center py-2 whitespace-nowrap text-sm text-gray-500">
                  {org.parentOrg}
                </td>
                <td className=" py-2 whitespace-nowrap">
                  <div className="flex justify-center">
                    <div className={`h-5 w-5 border border-indigo-600 rounded ${org.isLine ? 'bg-indigo-100' : ''}`}>
                      {org.isLine && <div className="h-full w-full flex text-center items-center justify-center text-indigo-600">✓</div>}
                    </div>
                  </div>
                </td>
                <td className="px-2 py-2 whitespace-nowrap">
                  <div className="flex justify-center">
                    <div className={`h-5 w-5 border border-gray-300 rounded ${org.isFinishing ? 'bg-gray-100' : ''}`}>
                      {org.isFinishing && <div className="h-full w-full flex items-center justify-center text-gray-500">✓</div>}
                    </div>
                  </div>
                </td>
                <td className=" py-2 text-center whitespace-nowrap text-sm text-gray-500">
                  {org.code}
                </td>
                <td className="py-2 text-center whitespace-nowrap text-sm text-gray-500">
                  {org.address}
                </td>
                <td className=" py-2 text-center whitespace-nowrap text-sm text-gray-500">
                  {org.startTime}
                </td>
                <td className="py-2 text-center whitespace-nowrap text-sm text-gray-500">
                  {org.lunchStartTime}
                </td>
                <td className=" py-2 text-center whitespace-nowrap text-sm text-gray-500">
                  {org.lunchEndTime}
                </td>
                <td className=" py-2 text-center whitespace-nowrap text-sm text-gray-500">
                  {org.workingHour}
                </td>
                {/* ===================== Action Button Icons ================= */}
                <td className="py-2 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button className="p-1 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100">
                      <img className='w-4 h-4' src={addIcon}/>
                    </button>
                    <button className="p-1 rounded-full bg-yellow-50 text-yellow-500 hover:bg-yellow-100">
                      <img className='w-[15.59px] h-[15.59px]' src={editIcon}/>
                    </button>
                    <button className="p-1 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100">
                      <img className='w-[19px] h-[13px]' src={viewIcon}/>
                    </button>
                    <button className="p-1 rounded-full bg-red-50 text-red-500 hover:bg-red-100">
                      <img className='w-[14px] h-[15.77px]' src={deleteIcon}/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* ======================================= Pagination Part ========================== */}
      <div className="bg-white p-4 flex items-center justify-between border-t border-gray-200 sm:px-6 sticky bottom-0 rounded-b-md">
        <div className="flex-1 flex justify-between sm:hidden">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(indexOfLastItem, allOrganizations.length)}
              </span> of{' '}
              <span className="font-medium">{allOrganizations.length}</span> entries
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <span className="sr-only">Previous</span>
                <ChevronRight className="h-5 w-5 transform rotate-180" />
              </button>
              
              {getPageNumbers().map((page, index) => (
                <React.Fragment key={index}>
                  {page === '...' ? (
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                      ...
                    </span>
                  ) : (
                    <button
                      onClick={() => handlePageChange(Number(page))}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === page
                          ? 'border-indigo-500 bg-indigo-500 text-white hover:bg-indigo-600'
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  )}
                </React.Fragment>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;