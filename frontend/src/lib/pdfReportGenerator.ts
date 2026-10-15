import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ReportColumn {
  header: string;
  dataKey: string;
  alignment?: 'left' | 'center' | 'right';
  width?: number;
}

export interface HotelReportPdfOptions {
  title: string;
  subtitle?: string;
  period: string;
  categoryName?: string;
  summaryCards?: { label: string; value: string }[];
  columns: ReportColumn[];
  data: Record<string, any>[];
  filename?: string;
  grandTotals?: Record<string, string>;
  notes?: string;
}

export const generateHotelReportPdf = (options: HotelReportPdfOptions) => {
  const {
    title,
    period,
    summaryCards = [],
    columns,
    data,
    filename = 'Subra_Residency_Report.pdf',
    notes
  } = options;

  const sanitizeCurrency = (val: any): string => {
    if (val === null || val === undefined) return '';
    return String(val).replace(/₹\s?/g, 'Rs. ');
  };

  // Create A4 portrait PDF (or landscape if columns > 7)
  const isLandscape = columns.length > 7;
  const doc = new jsPDF({
    orientation: isLandscape ? 'l' : 'p',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 12;

  // --- 1. Official Corporate Header (Monochromatic / Neutral Audit Style) ---
  // Top thin accent bar (Charcoal)
  doc.setFillColor(31, 41, 55); // #1f2937
  doc.rect(0, 0, pageWidth, 4, 'F');

  // Hotel Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(17, 24, 39); // Clean black / charcoal
  doc.text('SUBRA RESIDENCY', margin, 13.5);

  // Proprietor Tagline
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(75, 85, 99); // Neutral professional slate
  doc.text('RAGUPATHI ANANDHALAKSHMI  •  PROPRIETORSHIP', margin, 18);

  // Address & Contacts
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(107, 114, 128);
  doc.text('NO.45-1/1187B2, Lal Bahadur Sastry Road, Kumbakonam, Thanjavur, Tamil Nadu - 612001', margin, 22);
  doc.text('Phone: +91 73958 09991 / 73958 09992  |  Email: subraresidency@gmail.com', margin, 25.5);

  // GSTIN & State Code
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text('GSTIN: ', margin, 29.5);
  doc.text('33AQQPA7394F2ZN', margin + 11, 29.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(107, 114, 128);
  doc.text(' | State Code: 33 (Tamil Nadu)', margin + 45, 29.5);

  // Document Title & Period (Right aligned)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(17, 24, 39);
  doc.text(title.toUpperCase(), pageWidth - margin, 13.5, { align: 'right' });

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(55, 65, 81);
  doc.text(`Period: ${period}`, pageWidth - margin, 18.5, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(107, 114, 128);
  const nowStr = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  doc.text(`Generated: ${nowStr}`, pageWidth - margin, 23, { align: 'right' });
  doc.text(`Property Management Audit Register`, pageWidth - margin, 26.5, { align: 'right' });

  // Divider Line
  doc.setDrawColor(209, 213, 219);
  doc.setLineWidth(0.4);
  doc.line(margin, 32, pageWidth - margin, 32);

  // --- 2. Summary KPI Boxes ---
  let startY = 35;
  if (summaryCards.length > 0) {
    const cardGap = 3;
    const totalGap = cardGap * (summaryCards.length - 1);
    const availableW = pageWidth - margin * 2;
    const cardW = (availableW - totalGap) / summaryCards.length;
    const cardH = 12;

    summaryCards.forEach((card, idx) => {
      const x = margin + idx * (cardW + cardGap);
      doc.setFillColor(249, 250, 251);
      doc.setDrawColor(209, 213, 219);
      doc.roundedRect(x, startY, cardW, cardH, 1.5, 1.5, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(107, 114, 128);
      doc.text(card.label.toUpperCase(), x + 3, startY + 4);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(17, 24, 39);
      doc.text(sanitizeCurrency(card.value), x + 3, startY + 9.5);
    });

    startY += 15;
  }

  // --- 3. Format Data for AutoTable ---
  const tableHeaders = columns.map(c => sanitizeCurrency(c.header));
  const tableRows = data.map((row, rowIdx) => {
    return columns.map(col => {
      if (col.dataKey === '_index') return String(rowIdx + 1);
      const val = row[col.dataKey];
      return val !== undefined && val !== null ? sanitizeCurrency(val) : '';
    });
  });

  const columnStyles: Record<number, any> = {};
  columns.forEach((col, idx) => {
    columnStyles[idx] = {
      halign: col.alignment || 'left',
      cellWidth: col.width ? col.width : 'auto',
    };
  });

  // --- 4. Render autoTable with corporate styling ---
  autoTable(doc, {
    startY: startY,
    head: [tableHeaders],
    body: tableRows,
    theme: 'grid',
    margin: { left: margin, right: margin, bottom: 22 },
    styles: {
      font: 'helvetica',
      fontSize: 7.5,
      cellPadding: 2,
      textColor: [17, 24, 39],
      lineColor: [209, 213, 219],
      lineWidth: 0.2,
      valign: 'middle',
      overflow: 'linebreak'
    },
    headStyles: {
      fillColor: [31, 41, 55], // Classic corporate dark slate / charcoal
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 7.5,
      halign: 'left',
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
    columnStyles: columnStyles,
    didDrawPage: (dataHook) => {
      // Footer on every page
      const pageNum = dataHook.pageNumber;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(156, 163, 175);
      doc.text(
        `Subra Residency Hotel Management System • Official Audit Statement • Page ${pageNum}`,
        margin,
        pageHeight - 6
      );
      doc.text(
        `Confidential & Proprietary`,
        pageWidth - margin,
        pageHeight - 6,
        { align: 'right' }
      );
    }
  });

  // --- 5. Signatures on Last Page ---
  const lastTable = (doc as any).lastAutoTable;
  let finalY = (lastTable ? lastTable.finalY : startY) + 8;

  // If near the bottom, add a new page for signatures
  if (finalY > pageHeight - 35) {
    doc.addPage();
    finalY = 20;
  }

  const sigBlockW = (pageWidth - margin * 2) / 3;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(55, 65, 81);

  // Prepared By
  doc.line(margin + 5, finalY + 12, margin + sigBlockW - 5, finalY + 12);
  doc.text('PREPARED BY', margin + sigBlockW / 2, finalY + 16, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(107, 114, 128);
  doc.text('Front Desk / Accounts Executive', margin + sigBlockW / 2, finalY + 19.5, { align: 'center' });

  // Official Seal
  doc.setDrawColor(209, 213, 219);
  doc.setLineDashPattern([1, 1], 0);
  doc.roundedRect(margin + sigBlockW + 8, finalY + 2, sigBlockW - 16, 12, 1, 1, 'D');
  doc.setLineDashPattern([], 0);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(156, 163, 175);
  doc.text('OFFICIAL HOTEL SEAL', margin + sigBlockW + sigBlockW / 2, finalY + 9, { align: 'center' });

  // Authorized By
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(55, 65, 81);
  doc.line(margin + sigBlockW * 2 + 5, finalY + 12, pageWidth - margin - 5, finalY + 12);
  doc.text('VERIFIED & AUTHORIZED BY', margin + sigBlockW * 2 + sigBlockW / 2, finalY + 16, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(107, 114, 128);
  doc.text('General Manager / Proprietor', margin + sigBlockW * 2 + sigBlockW / 2, finalY + 19.5, { align: 'center' });

  // Save PDF
  doc.save(filename);
};
