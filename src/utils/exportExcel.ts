// utils/exportUtils.ts
import * as XLSX from 'xlsx';

interface ExportExcelOptions {
  fileName?: string;
  headers: string[];
  dataKeys: string[];
  mergeFields?: string[];
  sheetName?: string;
}

export const exportToExcel = (data: any[], options: ExportExcelOptions): void => {
  if (!data?.length) return;

  const {
    fileName = `export-${new Date().toISOString().slice(0, 10)}.xlsx`,
    headers,
    dataKeys,
    mergeFields = [],
    sheetName = 'Sheet1'
  } = options;

  // Process data to group identical rows
  const groupedData: any[] = [];
  let currentGroupKey = '';
  let currentGroupRows: any[] = [];

  data.forEach((row) => {
    const groupKey = mergeFields.map(field => row[field]).join('|');
    
    if (groupKey !== currentGroupKey) {
      if (currentGroupRows.length > 0) {
        groupedData.push({
          _isGroupHeader: true,
          ...currentGroupRows[0],
          _groupRows: [...currentGroupRows]
        });
      }
      currentGroupKey = groupKey;
      currentGroupRows = [row];
    } else {
      currentGroupRows.push(row);
    }
  });

  // Add the last group
  if (currentGroupRows.length > 0) {
    groupedData.push({
      _isGroupHeader: true,
      ...currentGroupRows[0],
      _groupRows: [...currentGroupRows]
    });
  }

  // Prepare worksheet data with Total column at the end
  const wsData: any[][] = [];
  
  // Create headers with Total at the end
  const excelHeaders = [
    ...headers.filter(h => h !== 'Total'),
    ...Array.from({ length: 9 }, (_, i) => `Hour ${i + 1}`),
    'Total' // Now at the very end
  ];
  wsData.push(excelHeaders);

  groupedData.forEach(group => {
    // Calculate actual group total
    const groupTotal = group._groupRows.reduce((sum: number, row: any) => {
      return sum + (row.hourlyProductionList?.reduce(
        (hourSum: number, hour: any) => hourSum + (hour.production || 0), 0
      )) || 0;
    }, 0);

    // Add group header row (without _groupTotal in the middle)
    const headerRow = dataKeys
      .filter(key => key !== '_groupTotal')
      .map(key => {
        if (key.startsWith('hour-')) return '';
        return group[key] ?? '';
      });

    // Add hourly production (9 hours)
    for (let i = 0; i < 9; i++) {
      headerRow.push(group._groupRows[0]?.hourlyProductionList?.[i]?.production ?? '0');
    }

    // Add total at the very end
    headerRow.push(groupTotal);

    wsData.push(headerRow);

    // Add remaining rows in group
    group._groupRows.slice(1).forEach((row: any) => {
      const dataRow = dataKeys
        .filter(key => key !== '_groupTotal')
        .map(key => {
          if (mergeFields.includes(key)) return '';
          if (key.startsWith('hour-')) return '';
          return row[key] ?? '';
        });

      // Add hourly production for this row
      for (let i = 0; i < 9; i++) {
        dataRow.push(row.hourlyProductionList?.[i]?.production ?? '0');
      }

      // Empty cell for total in subsequent rows
      dataRow.push('');

      wsData.push(dataRow);
    });
  });

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  // Export the file
  XLSX.writeFile(wb, fileName);
};

// Specialized function for hourly production
export const exportHourlyProductionExcel = (
  data: any[],
  date: Date,
  meta: { buyerName: string; styleName: string }
) => {
  exportToExcel(data, {
    fileName: `production-${date.toISOString().slice(0, 10)}.xlsx`,
    headers: [
      "Layout", "Work Station", "Operator",
      "Machine Type", "SMV" // Total removed from here
    ],
    dataKeys: [
      "layoutName", "workStationName", "operatorName",
      "machineType", "smv", "_groupTotal" // Kept for filtering
    ],
    mergeFields: ["workStationName", "layoutName"],
    sheetName: "Hourly Production"
  });
};