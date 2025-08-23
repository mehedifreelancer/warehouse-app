// utils/exportUtils.ts
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface ExportPDFOptions {
  title?: string;
  orientation?: "portrait" | "landscape";
  fontSize?: number;
  headerColor?: [number, number, number];
  fileName?: string;
  headers: string[];
  dataKeys: string[];
  mergeFields?: string[];
}

export const exportToPDF = (data: any[], options: ExportPDFOptions): void => {
  if (!data?.length) return;

  const {
    title = "Production Report",
    orientation = "landscape",
    fontSize = 8,
    headerColor = [28, 152, 216],
    fileName = `production-${new Date().toISOString().slice(0, 10)}.pdf`,
    headers,
    dataKeys,
    mergeFields = []
  } = options;

  // Process data to group identical workstations
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

  // Prepare table body with all hours and correct totals
  const body: any[] = [];
  groupedData.forEach(group => {
    // Calculate ACTUAL group total by summing all hourly productions
    let actualGroupTotal = 0;
    group._groupRows.forEach((row: any) => {
      row.hourlyProductionList?.forEach((hour: any) => {
        actualGroupTotal += hour.production || 0;
      });
    });

    // Add group header row (hours first, then total at end)
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

    // Add ACTUAL calculated total at the end
    headerRow.push(actualGroupTotal);

    body.push(headerRow);

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

      // Add empty value for total column in subsequent rows
      dataRow.push('');

      body.push(dataRow);
    });
  });

  // Create PDF
  const doc = new jsPDF({ orientation });

  // Add title
  doc.setFontSize(16);
  doc.text(title, 14, 15);

  // Generate table with hours first and total last
  autoTable(doc, {
    head: [headers.filter(h => h !== 'Total')
      .concat(Array.from({ length: 9 }, (_, i) => `H ${i + 1}`))
      .concat(['Total'])], // Total column at end
    body: body,
    startY: 25,
    styles: {
      fontSize,
      cellPadding: 3,
      valign: 'middle'
    },
    headStyles: {
      fillColor: headerColor,
      textColor: 255,
      fontStyle: 'bold'
    },
    columnStyles: {
      // Make hour columns narrower
      ...Object.fromEntries(
        Array.from({ length: 9 }, (_, i) => [
          headers.length - 1 + i, // -1 because we removed Total from headers
          { cellWidth: 10 }
        ])
      ),
      // Make total column normal width
      [headers.length - 1 + 9]: { cellWidth: 'auto' }
    },
    didDrawCell: (data) => {
      if (data.row.index < body.length && body[data.row.index][0] !== '') {
        data.cell.styles.fillColor = [240, 240, 240];
      }
    }
  });

  doc.save(fileName);
};

export const exportHourlyProductionPDF = (
  data: any[],
  date: Date,
  meta: { buyerName: string; styleName: string }
) => {
  exportToPDF(data, {
    title: `Hourly Production - ${meta.buyerName} (${meta.styleName})`,
    headers: [
      "Layout", "Work Station", "Operator",
      "Machine Type", "SMV" // Total removed from here
    ],
    dataKeys: [
      "layoutName", "workStationName", "operatorName",
      "machineType", "smv", "_groupTotal" // Kept for filtering
    ],
    mergeFields: ["workStationName", "layoutName"],
    fileName: `production-${date.toISOString().slice(0, 10)}.pdf`
  });
};