import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Clean helper to call autoTable across different bundling environments
 */
function callAutoTable(doc, options) {
  if (typeof autoTable === 'function') {
    autoTable(doc, options);
  } else if (autoTable && typeof autoTable.default === 'function') {
    autoTable.default(doc, options);
  } else if (typeof doc.autoTable === 'function') {
    doc.autoTable(options);
  } else {
    throw new Error('autoTable plugin is not available');
  }
}

/**
 * Draws professional header on a PDF document page
 */
function drawDocumentHeader(doc, title, subtitle, eventName, participantCount) {
  // Top burgundy accent banner
  doc.setFillColor(115, 16, 16); // #731010 Burgundy
  doc.rect(0, 0, 210, 8, 'F');

  // Institution & Symposium Titles
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(115, 16, 16);
  doc.text('CSE VIYUGAM 2026', 14, 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139); // Slate-500
  doc.text('National Level Technical Symposium • Department of Computer Science & Engineering', 14, 26);

  // Event Name & Meta Box
  doc.setFillColor(248, 250, 252); // Slate-50
  doc.setDrawColor(226, 232, 240); // Slate-200
  doc.roundedRect(14, 31, 182, 18, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42); // Slate-900
  doc.text(`Event: ${eventName}`, 19, 40);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105); // Slate-600
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  doc.text(`Total Registered: ${participantCount} Participants   |   Generated: ${dateStr}`, 19, 45);
}

/**
 * Adds page numbering and official footer across all pages
 */
function addFooterToAllPages(doc) {
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // Footer divider line
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(14, 285, 196, 285);

    // Footer text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // Slate-400
    doc.text('CSE VIYUGAM 2026 • Official Event Participation Report', 14, 290);
    doc.text(`Page ${i} of ${pageCount}`, 196, 290, { align: 'right' });
  }
}

/**
 * Exports a single event's participants to a clean, professional PDF
 * Columns strictly requested:
 * - S.No (#)
 * - Name of Participant
 * - College Name
 * - Team Name
 */
export function exportSingleEventPDF(eventObj) {
  if (!eventObj) return;

  const eventName = eventObj.eventName || 'Event';
  const participants = Array.isArray(eventObj.participants) ? eventObj.participants : [];

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Draw header section
  drawDocumentHeader(doc, 'CSE VIYUGAM 2026', 'Official Event Report', eventName, participants.length);

  // Table rows with ONLY Participant Name, College Name, Team Name
  const tableRows = participants.map((p, idx) => [
    idx + 1,
    p.name ? String(p.name).trim() : 'Participant',
    p.college ? String(p.college).trim() : 'Unspecified Institution',
    p.teamName ? String(p.teamName).trim() : 'Individual',
  ]);

  // If no participants, show empty message row
  if (tableRows.length === 0) {
    tableRows.push(['-', 'No participants registered for this event yet', '-', '-']);
  }

  callAutoTable(doc, {
    startY: 53,
    head: [['#', 'Name of Participant', 'College Name', 'Team Name']],
    body: tableRows,
    theme: 'striped',
    margin: { left: 14, right: 14, bottom: 18 },
    styles: {
      font: 'helvetica',
      fontSize: 8.5,
      cellPadding: 3,
      textColor: [30, 41, 59], // Slate-800
      lineColor: [226, 232, 240],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [115, 16, 16], // Burgundy
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
      halign: 'left',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      1: { cellWidth: 58, fontStyle: 'bold' },
      2: { cellWidth: 72 },
      3: { cellWidth: 40 },
    },
  });

  addFooterToAllPages(doc);

  const sanitizedEventName = eventName.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
  doc.save(`CSE_VIYUGAM_2026_${sanitizedEventName}_Report.pdf`);
}

/**
 * Exports all events into a unified comprehensive PDF document
 * with each event having its own section and the exact 3 requested columns
 * (Participant Name, College Name, Team Name).
 */
export function exportAllEventsPDF(eventsList = []) {
  if (!eventsList || eventsList.length === 0) return;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const totalAllParticipants = eventsList.reduce((acc, e) => acc + (e.participants?.length || 0), 0);

  eventsList.forEach((evt, eventIdx) => {
    if (eventIdx > 0) {
      doc.addPage();
    }

    const eventName = evt.eventName || `Event #${eventIdx + 1}`;
    const participants = Array.isArray(evt.participants) ? evt.participants : [];

    drawDocumentHeader(doc, 'CSE VIYUGAM 2026', 'Official Symposium Event Report', eventName, participants.length);

    const tableRows = participants.map((p, idx) => [
      idx + 1,
      p.name ? String(p.name).trim() : 'Participant',
      p.college ? String(p.college).trim() : 'Unspecified Institution',
      p.teamName ? String(p.teamName).trim() : 'Individual',
    ]);

    if (tableRows.length === 0) {
      tableRows.push(['-', 'No participants registered for this event yet', '-', '-']);
    }

    callAutoTable(doc, {
      startY: 53,
      head: [['#', 'Name of Participant', 'College Name', 'Team Name']],
      body: tableRows,
      theme: 'striped',
      margin: { left: 14, right: 14, bottom: 18 },
      styles: {
        font: 'helvetica',
        fontSize: 8.5,
        cellPadding: 3,
        textColor: [30, 41, 59],
        lineColor: [226, 232, 240],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [115, 16, 16],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 9,
        halign: 'left',
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
      columnStyles: {
        0: { cellWidth: 12, halign: 'center' },
        1: { cellWidth: 58, fontStyle: 'bold' },
        2: { cellWidth: 72 },
        3: { cellWidth: 40 },
      },
    });
  });

  addFooterToAllPages(doc);

  doc.save('CSE_VIYUGAM_2026_All_Events_Report.pdf');
}
