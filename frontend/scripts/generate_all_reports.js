// frontend/scripts/generate_all_reports.js
// Corporate Professional Audit Report Generator (Neutral Monochromatic / CA Audit Style)

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const { jsPDF } = await import('jspdf');
  const autoTable = (await import('jspdf-autotable')).default;

  const outDir = path.resolve(__dirname, '../../reports');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  function sanitizeCurrency(val) {
    if (val === null || val === undefined) return '';
    return String(val).replace(/₹\s?/g, 'Rs. ');
  }

  function createCorporateDoc(title, period, summaryCards, isLandscape = false) {
    const doc = new jsPDF({
      orientation: isLandscape ? 'l' : 'p',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 11;

    // Top Header Bar (Classic Charcoal Accent)
    doc.setFillColor(31, 41, 55); // #1f2937
    doc.rect(0, 0, pageWidth, 4, 'F');

    // Hotel Brand & Legal Entity (Neutral Black / Charcoal)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.setTextColor(17, 24, 39);
    doc.text('SUBRA RESIDENCY', margin, 13);

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(75, 85, 99);
    doc.text('RAGUPATHI ANANDHALAKSHMI  •  PROPRIETORSHIP', margin, 17.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(107, 114, 128);
    doc.text('NO.45-1/1187B2, Lal Bahadur Sastry Road, Kumbakonam, Thanjavur, Tamil Nadu - 612001', margin, 21.5);
    doc.text('Phone: +91 73958 09991 / 73958 09992  |  Email: subraresidency@gmail.com', margin, 25);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(17, 24, 39);
    doc.text('GSTIN: ', margin, 29);
    doc.text('33AQQPA7394F2ZN', margin + 10, 29);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text(' | State Code: 33 (Tamil Nadu)', margin + 43, 29);

    // Document Title & Audit Details (Right Aligned, Dark Neutral)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(17, 24, 39);
    doc.text(title.toUpperCase(), pageWidth - margin, 13, { align: 'right' });

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(55, 65, 81);
    doc.text(`Audit Period: ${period}`, pageWidth - margin, 18, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(107, 114, 128);
    const nowStr = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
    doc.text(`Generated: ${nowStr}`, pageWidth - margin, 22.5, { align: 'right' });
    doc.text(`Official Hospitality Management Statement`, pageWidth - margin, 26, { align: 'right' });

    // Clean Divider Line
    doc.setDrawColor(209, 213, 219);
    doc.setLineWidth(0.4);
    doc.line(margin, 31.5, pageWidth - margin, 31.5);

    // Summary KPI Cards (Monochromatic Neutral Box)
    let startY = 34.5;
    if (summaryCards && summaryCards.length > 0) {
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

    return { doc, startY, pageWidth, pageHeight, margin };
  }

  function addSignaturesAndFooters(doc, startY, pageWidth, pageHeight, margin) {
    const lastTable = doc.lastAutoTable;
    let finalY = (lastTable ? lastTable.finalY : startY) + 7;

    if (finalY > pageHeight - 32) {
      doc.addPage();
      finalY = 18;
    }

    const sigBlockW = (pageWidth - margin * 2) / 3;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(55, 65, 81);

    // Prepared By
    doc.line(margin + 5, finalY + 11, margin + sigBlockW - 5, finalY + 11);
    doc.text('PREPARED BY', margin + sigBlockW / 2, finalY + 15, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(107, 114, 128);
    doc.text('Duty Officer / Front Office', margin + sigBlockW / 2, finalY + 18.5, { align: 'center' });

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
    doc.line(margin + sigBlockW * 2 + 5, finalY + 11, pageWidth - margin - 5, finalY + 11);
    doc.text('VERIFIED & AUTHORIZED BY', margin + sigBlockW * 2 + sigBlockW / 2, finalY + 15, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(107, 114, 128);
    doc.text('Ragupathi Anandhalakshmi (Proprietor)', margin + sigBlockW * 2 + sigBlockW / 2, finalY + 18.5, { align: 'center' });
  }

  // ==========================================
  // Report 2: Hospitality Accounts & Revenue Report
  // ==========================================
  console.log('Generating Report 2: Accounts & Revenue (Professional Neutral)...');
  {
    const { doc, startY, pageWidth, pageHeight, margin } = createCorporateDoc(
      'Accounts & Financial Revenue Report',
      'October 2026 (Monthly Audit)',
      [
        { label: 'Gross Revenue', value: 'Rs. 8,12,199.00' },
        { label: 'Net Taxable Tariff', value: 'Rs. 7,25,178.00' },
        { label: 'GST Collected (12%)', value: 'Rs. 87,021.00' },
        { label: 'Settled Bookings', value: '142 Folios' },
        { label: 'Avg Daily Rate (ADR)', value: 'Rs. 3,450.00' }
      ],
      true
    );

    // Exact proportional column widths ensuring full fit within available 275mm landscape width
    const headers = ['#', 'Txn ID', 'Booking Ref', 'Guest Name', 'Room Assigned', 'Check-In', 'Check-Out', 'Method', 'Taxable (Rs.)', 'CGST (Rs.)', 'SGST (Rs.)', 'Total Paid (Rs.)'];
    const rows = [
      ['1', 'PAY_TNIHN40XB8IEH', 'HBK202610144E42', 'Kirtheeswaran G R M', 'Room AR1-1 (Double AC)', '14/10/2026', '15/10/2026', 'Razorpay', '2,990.18', '179.41', '179.41', '3,349.00'],
      ['2', 'PAY_TN982736154AF', 'HBK20261009444E', 'Sundaresan S', 'Room 102 (Deluxe AC)', '09/10/2026', '12/10/2026', 'Razorpay', '7,901.79', '474.11', '474.11', '8,850.00'],
      ['3', 'PAY_TN445892110CS', 'HBK20261008129B', 'Anand Kumar V', 'Room 204 (Suite AC)', '08/10/2026', '10/10/2026', 'Cash Counter', '5,803.57', '348.21', '348.21', '6,500.00'],
      ['4', 'PAY_TN778219033RZ', 'HBK20261007882K', 'Meenakshi Raman', 'Room 105 (Standard AC)', '07/10/2026', '08/10/2026', 'Razorpay', '2,678.57', '160.71', '160.71', '3,000.00'],
      ['5', 'PAY_TN662190884CD', 'HBK20261005112P', 'Rajesh Kanna P', 'Room 201 (Triple Family)', '05/10/2026', '07/10/2026', 'Card POS', '8,214.29', '492.86', '492.86', '9,200.00'],
      ['6', 'PAY_TN551098223UP', 'HBK20261004991M', 'Gowri Shankar R', 'Room 103 (Double AC)', '04/10/2026', '05/10/2026', 'UPI / GPay', '2,990.18', '179.41', '179.41', '3,349.00'],
      ['7', 'PAY_TN331092117RZ', 'HBK20261002008L', 'Dr. Senthil Nathan', 'Room 302 (Executive Suite)', '02/10/2026', '04/10/2026', 'Razorpay', '9,821.43', '589.29', '589.29', '11,000.00'],
      ['8', 'PAY_TN229108344CS', 'HBK20261001449A', 'Venkatesan M', 'Room 104 (Standard Non-AC)', '01/10/2026', '02/10/2026', 'Cash Counter', '1,607.14', '96.43', '96.43', '1,800.00']
    ];

    autoTable(doc, {
      startY,
      head: [headers],
      body: rows,
      theme: 'grid',
      margin: { left: margin, right: margin, bottom: 22 },
      styles: {
        fontSize: 7.5,
        cellPadding: 2.2,
        font: 'helvetica',
        textColor: [17, 24, 39],
        lineColor: [209, 213, 219],
        lineWidth: 0.2,
        overflow: 'linebreak'
      },
      headStyles: {
        fillColor: [31, 41, 55], // Dark Charcoal
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 7.5,
        halign: 'left'
      },
      alternateRowStyles: { fillColor: [249, 250, 251] },
      columnStyles: {
        0: { halign: 'center' },
        5: { halign: 'center' },
        6: { halign: 'center' },
        8: { halign: 'right' },
        9: { halign: 'right' },
        10: { halign: 'right' },
        11: { halign: 'right', fontStyle: 'bold', textColor: [17, 24, 39] }
      },
      didDrawPage: (dataHook) => {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(156, 163, 175);
        doc.text(
          `Subra Residency • Accounts & Financial Revenue Audit Statement • Page ${dataHook.pageNumber}`,
          margin,
          pageHeight - 6
        );
        doc.text(
          `Confidential & Statutory Document`,
          pageWidth - margin,
          pageHeight - 6,
          { align: 'right' }
        );
      }
    });

    addSignaturesAndFooters(doc, startY, pageWidth, pageHeight, margin);
    const pdfBytes = doc.output('arraybuffer');
    fs.writeFileSync(path.join(outDir, '02_Accounts_Financial_Revenue_Report.pdf'), Buffer.from(pdfBytes));
  }

  // ==========================================
  // Report 3: Room Status & Occupancy Report
  // ==========================================
  console.log('Generating Report 3: Room Status & Occupancy...');
  {
    const { doc, startY, pageWidth, pageHeight, margin } = createCorporateDoc(
      'Room Status & Live Occupancy Register',
      'Daily Audit: 15 October 2026',
      [
        { label: 'Total Inventory', value: '28 Rooms' },
        { label: 'Occupied Rooms', value: '19 (68%)' },
        { label: 'Available Clean', value: '7 Rooms' },
        { label: 'Under Cleaning', value: '2 Rooms' }
      ],
      false
    );

    const headers = ['Room', 'Category', 'Floor', 'Status', 'Current Occupant', 'Check-In', 'Exp. Departure', 'Tariff/Nt (Rs.)'];
    const rows = [
      ['AR1-1', 'Standard Double AC', '1st Floor', 'Occupied', 'Kirtheeswaran G R M', '14/10 13:14', '15/10 11:00', '2,990.00'],
      ['102', 'Deluxe Double AC', '1st Floor', 'Occupied', 'Sundaresan S', '09/10 12:00', '15/10 11:00', '3,450.00'],
      ['103', 'Deluxe Double AC', '1st Floor', 'Available', '— (Vacant Clean)', '—', '—', '3,450.00'],
      ['104', 'Standard Non-AC', '1st Floor', 'Available', '— (Vacant Clean)', '—', '—', '1,800.00'],
      ['105', 'Standard Double AC', '1st Floor', 'Cleaning', 'Housekeeping in Progress', '—', '—', '2,990.00'],
      ['201', 'Triple Family Suite', '2nd Floor', 'Occupied', 'Rajesh Kanna P', '13/10 14:30', '16/10 11:00', '4,500.00'],
      ['202', 'Deluxe Double AC', '2nd Floor', 'Occupied', 'Kalyanasundaram T', '14/10 18:00', '17/10 11:00', '3,450.00'],
      ['203', 'Executive Suite AC', '2nd Floor', 'Occupied', 'Sivakumar N', '12/10 11:00', '15/10 11:00', '5,200.00'],
      ['204', 'Executive Suite AC', '2nd Floor', 'Available', '— (Vacant Clean)', '—', '—', '5,200.00'],
      ['301', 'Presidential Temple View', '3rd Floor', 'Occupied', 'Dr. Senthil Nathan', '14/10 16:00', '18/10 11:00', '6,500.00'],
      ['302', 'Presidential Temple View', '3rd Floor', 'Cleaning', 'Turnover Cleaning', '—', '—', '6,500.00'],
      ['303', 'Deluxe Double AC', '3rd Floor', 'Occupied', 'Venkataraman R', '13/10 12:00', '15/10 11:00', '3,450.00']
    ];

    autoTable(doc, {
      startY,
      head: [headers],
      body: rows,
      theme: 'grid',
      margin: { left: margin, right: margin, bottom: 22 },
      styles: {
        fontSize: 7.5,
        cellPadding: 2.2,
        font: 'helvetica',
        textColor: [17, 24, 39],
        lineColor: [209, 213, 219],
        lineWidth: 0.2,
        overflow: 'linebreak'
      },
      headStyles: {
        fillColor: [31, 41, 55],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 7.5
      },
      alternateRowStyles: { fillColor: [249, 250, 251] },
      columnStyles: {
        0: { fontStyle: 'bold', halign: 'center' },
        3: { fontStyle: 'bold' },
        7: { halign: 'right', fontStyle: 'bold' }
      },
      didDrawPage: (dataHook) => {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(156, 163, 175);
        doc.text(
          `Subra Residency • Room Inventory & Live Occupancy Register • Page ${dataHook.pageNumber}`,
          margin,
          pageHeight - 6
        );
        doc.text(
          `Official Daily Report`,
          pageWidth - margin,
          pageHeight - 6,
          { align: 'right' }
        );
      }
    });

    addSignaturesAndFooters(doc, startY, pageWidth, pageHeight, margin);
    const pdfBytes = doc.output('arraybuffer');
    fs.writeFileSync(path.join(outDir, '03_Room_Status_and_Occupancy_Report.pdf'), Buffer.from(pdfBytes));
  }

  // ==========================================
  // Report 4: Guest Directory & Police Verification Stay Report
  // ==========================================
  console.log('Generating Report 4: Guest Directory...');
  {
    const { doc, startY, pageWidth, pageHeight, margin } = createCorporateDoc(
      'Guest Directory & Police Verification Register',
      'October 2026 Statutory Police & Tourism Ledger',
      [
        { label: 'Total In-House Guests', value: '38 Guests' },
        { label: 'Domestic Residents', value: '36' },
        { label: 'Foreign Nationals', value: '2' },
        { label: 'Govt. Photo IDs Verified', value: '100% Verified' }
      ],
      true
    );

    const headers = ['#', 'Booking ID', 'Guest Full Name', 'Mobile Number', 'Permanent Address & City', 'Nationality', 'ID Proof Type', 'Govt. ID Ref Number', 'Room', 'Arrival Date', 'Departure'];
    const rows = [
      ['1', 'HBK202610144E42', 'Kirtheeswaran G R M', '+91 90926 31299', 'Kamarajar Salai, Thanjavur, TN', 'Indian', 'Aadhaar Card', 'XXXX-XXXX-4912', 'AR1-1', '14/10/2026', '15/10/2026'],
      ['2', 'HBK20261009444E', 'Sundaresan S', '+91 98401 23456', 'T. Nagar, Chennai, Tamil Nadu', 'Indian', 'Driving License', 'TN-01-2018-0912', '102', '09/10/2026', '15/10/2026'],
      ['3', 'HBK20261013881C', 'Michael Sterling', '+44 7911 123456', 'Manchester, United Kingdom', 'British', 'Passport', 'GB-992817410', '301', '14/10/2026', '18/10/2026'],
      ['4', 'HBK20261005112P', 'Rajesh Kanna P', '+91 94432 99182', 'RS Puram, Coimbatore, TN', 'Indian', 'Aadhaar Card', 'XXXX-XXXX-7721', '201', '13/10/2026', '16/10/2026'],
      ['5', 'HBK20261008129B', 'Anand Kumar V', '+91 97890 11223', 'Malleshwaram, Bangalore, KA', 'Indian', 'Voter ID', 'KA-04-V-88192', '204', '08/10/2026', '10/10/2026'],
      ['6', 'HBK20261002008L', 'Dr. Senthil Nathan', '+91 98410 44556', 'Anna Nagar, Madurai, TN', 'Indian', 'Aadhaar Card', 'XXXX-XXXX-1109', '302', '02/10/2026', '04/10/2026'],
      ['7', 'HBK20261012994K', 'Kalyanasundaram T', '+91 98840 77123', 'West Mambalam, Chennai, TN', 'Indian', 'Aadhaar Card', 'XXXX-XXXX-8834', '202', '14/10/2026', '17/10/2026']
    ];

    autoTable(doc, {
      startY,
      head: [headers],
      body: rows,
      theme: 'grid',
      margin: { left: margin, right: margin, bottom: 22 },
      styles: {
        fontSize: 7.5,
        cellPadding: 2.2,
        font: 'helvetica',
        textColor: [17, 24, 39],
        lineColor: [209, 213, 219],
        lineWidth: 0.2,
        overflow: 'linebreak'
      },
      headStyles: {
        fillColor: [31, 41, 55],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 7.5
      },
      alternateRowStyles: { fillColor: [249, 250, 251] },
      columnStyles: {
        0: { halign: 'center' },
        7: { fontStyle: 'bold' },
        8: { halign: 'center', fontStyle: 'bold' },
        9: { halign: 'center' },
        10: { halign: 'center' }
      },
      didDrawPage: (dataHook) => {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(156, 163, 175);
        doc.text(
          `Subra Residency • Guest Verification & Tourism Register • Page ${dataHook.pageNumber}`,
          margin,
          pageHeight - 6
        );
        doc.text(
          `Official Law Enforcement Record`,
          pageWidth - margin,
          pageHeight - 6,
          { align: 'right' }
        );
      }
    });

    addSignaturesAndFooters(doc, startY, pageWidth, pageHeight, margin);
    const pdfBytes = doc.output('arraybuffer');
    fs.writeFileSync(path.join(outDir, '04_Guest_Directory_Stay_Report.pdf'), Buffer.from(pdfBytes));
  }

  // ==========================================
  // Report 5: Master Bookings Summary Report
  // ==========================================
  console.log('Generating Report 5: Master Bookings Summary...');
  {
    const { doc, startY, pageWidth, pageHeight, margin } = createCorporateDoc(
      'Master Bookings Summary Register',
      'Q3 / Q4 2026 Operational Log',
      [
        { label: 'Total Reservations', value: '186 Folios' },
        { label: 'Online / Direct Web', value: '114 (61%)' },
        { label: 'Walk-in Bookings', value: '72 (39%)' },
        { label: 'Total Value Booked', value: 'Rs. 11,48,500.00' }
      ],
      true
    );

    const headers = ['#', 'Booking ID', 'Guest Name', 'Phone', 'Room Category', 'Assigned', 'Check-In', 'Check-Out', 'Nts', 'Source', 'Amount (Rs.)', 'Payment', 'Status'];
    const rows = [
      ['1', 'HBK202610144E42', 'Kirtheeswaran G R M', '9092631299', 'Standard Double AC', 'AR1-1', '14/10/2026', '15/10/2026', '1', 'Website', '3,349.00', 'Paid (Razorpay)', 'Checked-in'],
      ['2', 'HBK20261009444E', 'Sundaresan S', '9840123456', 'Deluxe Double AC', '102', '09/10/2026', '12/10/2026', '3', 'Website', '8,850.00', 'Paid (Razorpay)', 'Stay-in'],
      ['3', 'HBK20261008129B', 'Anand Kumar V', '9789011223', 'Executive Suite AC', '204', '08/10/2026', '10/10/2026', '2', 'Walk-in', '6,500.00', 'Paid (Cash)', 'Checked-out'],
      ['4', 'HBK20261007882K', 'Meenakshi Raman', '9841100922', 'Standard Double AC', '105', '07/10/2026', '08/10/2026', '1', 'Website', '3,000.00', 'Paid (Razorpay)', 'Checked-out'],
      ['5', 'HBK20261005112P', 'Rajesh Kanna P', '9443299182', 'Triple Family Suite', '201', '05/10/2026', '07/10/2026', '2', 'Walk-in', '9,200.00', 'Paid (Card POS)', 'Checked-out'],
      ['6', 'HBK20261004991M', 'Gowri Shankar R', '9884011220', 'Standard Double AC', '103', '04/10/2026', '05/10/2026', '1', 'Website', '3,349.00', 'Paid (UPI)', 'Checked-out'],
      ['7', 'HBK20261002008L', 'Dr. Senthil Nathan', '9841044556', 'Presidential Temple View', '302', '02/10/2026', '04/10/2026', '2', 'Website', '11,000.00', 'Paid (Razorpay)', 'Checked-out'],
      ['8', 'HBK20261001449A', 'Venkatesan M', '9444109822', 'Standard Non-AC', '104', '01/10/2026', '02/10/2026', '1', 'Walk-in', '1,800.00', 'Paid (Cash)', 'Checked-out']
    ];

    autoTable(doc, {
      startY,
      head: [headers],
      body: rows,
      theme: 'grid',
      margin: { left: margin, right: margin, bottom: 22 },
      styles: {
        fontSize: 7.5,
        cellPadding: 2.2,
        font: 'helvetica',
        textColor: [17, 24, 39],
        lineColor: [209, 213, 219],
        lineWidth: 0.2,
        overflow: 'linebreak'
      },
      headStyles: {
        fillColor: [31, 41, 55],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 7.5
      },
      alternateRowStyles: { fillColor: [249, 250, 251] },
      columnStyles: {
        0: { halign: 'center' },
        5: { halign: 'center' },
        6: { halign: 'center' },
        7: { halign: 'center' },
        8: { halign: 'center' },
        10: { halign: 'right', fontStyle: 'bold' },
        12: { fontStyle: 'bold' }
      },
      didDrawPage: (dataHook) => {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(156, 163, 175);
        doc.text(
          `Subra Residency • Master Bookings Audit Register • Page ${dataHook.pageNumber}`,
          margin,
          pageHeight - 6
        );
        doc.text(
          `Confidential Operations Document`,
          pageWidth - margin,
          pageHeight - 6,
          { align: 'right' }
        );
      }
    });

    addSignaturesAndFooters(doc, startY, pageWidth, pageHeight, margin);
    const pdfBytes = doc.output('arraybuffer');
    fs.writeFileSync(path.join(outDir, '05_Master_Bookings_Summary_Report.pdf'), Buffer.from(pdfBytes));
  }

  console.log('All sample reports regenerated successfully in ' + outDir);
}

main().catch(err => {
  console.error('Error generating reports:', err);
  process.exit(1);
});
