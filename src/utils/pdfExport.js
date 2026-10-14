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
function addFooterToAllPages(doc, reportName = 'Official Symposium Report') {
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
    doc.text(`CSE VIYUGAM 2026 • ${reportName}`, 14, 290);
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
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 50, fontStyle: 'bold' },
        2: { cellWidth: 62 },
        3: { cellWidth: 32 },
        4: { cellWidth: 28, halign: 'center', fontStyle: 'bold' },
      },
    });
  });

  addFooterToAllPages(doc, 'Official All Events Participation Report');

  doc.save('CSE_VIYUGAM_2026_All_Events_Report.pdf');
}

/**
 * Sorts participants strictly in TEAM-WISE order:
 * 1. Teams with named squads come first, sorted alphabetically by team name.
 * 2. Within each team, Team Lead is listed first, followed by Team Members.
 * 3. Individual registrations (no team) come after all teams, sorted by college and name.
 */
export function sortParticipantsTeamWise(participants = []) {
  return [...participants].sort((a, b) => {
    const rawTeamA = (a.teamName || '').trim();
    const rawTeamB = (b.teamName || '').trim();

    const isIndividualA = !rawTeamA || ['individual', 'none', 'n/a', 'na', '-', 'nil'].includes(rawTeamA.toLowerCase());
    const isIndividualB = !rawTeamB || ['individual', 'none', 'n/a', 'na', '-', 'nil'].includes(rawTeamB.toLowerCase());

    // Teams / squads come before individual registrations
    if (!isIndividualA && isIndividualB) return -1;
    if (isIndividualA && !isIndividualB) return 1;

    // Both are teams: sort by Team Name alphabetically
    if (!isIndividualA && !isIndividualB) {
      const cmpTeam = rawTeamA.toLowerCase().localeCompare(rawTeamB.toLowerCase());
      if (cmpTeam !== 0) return cmpTeam;

      // Inside same squad: Team Lead comes first!
      const isLeadA = a.isLead || a.teamRole === 'Team Lead';
      const isLeadB = b.isLead || b.teamRole === 'Team Lead';
      if (isLeadA && !isLeadB) return -1;
      if (!isLeadA && isLeadB) return 1;

      // Then by displayRowIndex or name
      return (a.name || '').localeCompare(b.name || '');
    }

    // Both are individuals: sort by College then Name
    const cmpCol = (a.college || '').toLowerCase().localeCompare((b.college || '').toLowerCase());
    if (cmpCol !== 0) return cmpCol;
    return (a.name || '').localeCompare(b.name || '');
  });
}

/**
 * Draws official verification roster header on PDF
 */
function drawVerificationHeader(doc, title, count, isVerified, totalAmount) {
  // Top accent banner
  if (isVerified) {
    doc.setFillColor(16, 120, 60); // Emerald
  } else {
    doc.setFillColor(190, 24, 60); // Rose
  }
  doc.rect(0, 0, 210, 8, 'F');

  // Institution & Symposium Titles
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(115, 16, 16); // Burgundy primary branding
  doc.text('CSE VIYUGAM 2026', 14, 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139); // Slate-500
  doc.text('National Level Technical Symposium • Department of Computer Science & Engineering', 14, 26);

  // Meta Box
  doc.setFillColor(248, 250, 252); // Slate-50
  doc.setDrawColor(226, 232, 240); // Slate-200
  doc.roundedRect(14, 31, 182, 19, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  if (isVerified) {
    doc.setTextColor(22, 101, 52); // Emerald-800
  } else {
    doc.setTextColor(159, 18, 57); // Rose-800
  }
  doc.text(title, 19, 39);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105); // Slate-600
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const amountStr = totalAmount !== undefined ? `   |   Total Fee: Rs. ${totalAmount.toLocaleString('en-IN')}` : '';
  const statusLabel = isVerified ? 'Classification: YES in Excel' : 'Classification: NO in Excel';
  doc.text(`Total: ${count} Participants${amountStr}   |   ${statusLabel}   |   Order: Team-Wise   |   Date: ${dateStr}`, 19, 45);
}

/**
 * Exports verified participants (YES in Excel) to a clean, professional PDF
 * STRICTLY SORTED IN TEAM-WISE ORDER with Team / Squad as a prominent column
 */
export function exportVerifiedReportPDF(participants = [], options = {}) {
  const verifiedList = participants.filter(p => p.isVerified);
  const sortedList = sortParticipantsTeamWise(verifiedList);
  const totalAmount = sortedList.reduce((acc, p) => acc + (p.amount || 250), 0);

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  drawVerificationHeader(
    doc,
    'OFFICIAL VERIFIED ATTENDEES ROSTER (TEAM-WISE ORDER)',
    sortedList.length,
    true,
    totalAmount
  );

  const tableRows = sortedList.map((p, idx) => [
    idx + 1,
    p.teamName && !['individual', 'none', 'n/a', 'nil', '-'].includes(p.teamName.trim().toLowerCase())
      ? p.teamName.trim().toUpperCase()
      : 'Individual',
    p.name ? String(p.name).trim() : 'Participant',
    p.teamRole || (p.isTeamMember ? 'Member' : (p.teamName ? 'Lead' : 'Individual')),
    p.college ? String(p.college).trim() : 'Unspecified Institution',
    p.department ? `${p.department} (${p.year || ''})` : 'CSE',
    'YES (Verified)',
  ]);

  if (tableRows.length === 0) {
    tableRows.push(['-', 'No verified participants found', '-', '-', '-', '-', '-']);
  }

  callAutoTable(doc, {
    startY: 54,
    head: [['#', 'Team / Squad', 'Participant Name', 'Role', 'College / Institution', 'Dept & Year', 'Excel Status']],
    body: tableRows,
    theme: 'striped',
    margin: { left: 14, right: 14, bottom: 18 },
    styles: {
      font: 'helvetica',
      fontSize: 8,
      cellPadding: 2.8,
      textColor: [30, 41, 59],
      lineColor: [226, 232, 240],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [16, 120, 60], // Emerald-700
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
      halign: 'left',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 32, fontStyle: 'bold' }, // Team / Squad
      2: { cellWidth: 38, fontStyle: 'bold' }, // Participant Name
      3: { cellWidth: 16, halign: 'center' },   // Role
      4: { cellWidth: 48 },                    // College
      5: { cellWidth: 22 },                    // Dept & Year
      6: { cellWidth: 18, halign: 'center', fontStyle: 'bold' }, // Excel Status
    },
  });

  addFooterToAllPages(doc, 'Verified Attendees Official Roster (Team-Wise Order)');
  doc.save('CSE_VIYUGAM_2026_Verified_Participants_Report.pdf');
}

/**
 * Exports non-verified participants (NO in Excel) to an official audit PDF
 * STRICTLY SORTED IN TEAM-WISE ORDER with Team / Squad as a prominent column
 */
export function exportNonVerifiedReportPDF(participants = [], options = {}) {
  const nonVerifiedList = participants.filter(p => !p.isVerified);
  const sortedList = sortParticipantsTeamWise(nonVerifiedList);
  const totalAmount = sortedList.reduce((acc, p) => acc + (p.amount || 250), 0);

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  drawVerificationHeader(
    doc,
    'NON-VERIFIED AUDIT ROSTER (TEAM-WISE ORDER)',
    sortedList.length,
    false,
    totalAmount
  );

  const tableRows = sortedList.map((p, idx) => [
    idx + 1,
    p.teamName && !['individual', 'none', 'n/a', 'nil', '-'].includes(p.teamName.trim().toLowerCase())
      ? p.teamName.trim().toUpperCase()
      : 'Individual',
    p.name ? String(p.name).trim() : 'Participant',
    p.college ? String(p.college).trim() : 'Unspecified Institution',
    p.department ? `${p.department} (${p.year || ''})` : 'CSE',
    p.transactionId ? String(p.transactionId).trim() : 'None',
    'NO (Non-Verified)',
  ]);

  if (tableRows.length === 0) {
    tableRows.push(['-', 'No non-verified submissions found (All participants are verified)', '-', '-', '-', '-', '-']);
  }

  callAutoTable(doc, {
    startY: 54,
    head: [['#', 'Team / Squad', 'Participant Name', 'College / Institution', 'Dept & Year', 'Transaction ID', 'Excel Status']],
    body: tableRows,
    theme: 'striped',
    margin: { left: 14, right: 14, bottom: 18 },
    styles: {
      font: 'helvetica',
      fontSize: 8,
      cellPadding: 2.8,
      textColor: [30, 41, 59],
      lineColor: [226, 232, 240],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [190, 24, 60], // Rose-700
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
      halign: 'left',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 32, fontStyle: 'bold' }, // Team / Squad
      2: { cellWidth: 38, fontStyle: 'bold' }, // Participant Name
      3: { cellWidth: 48 },                    // College
      4: { cellWidth: 22 },                    // Dept & Year
      5: { cellWidth: 18, fontStyle: 'bold' }, // Txn ID
      6: { cellWidth: 16, halign: 'center', fontStyle: 'bold' }, // Excel Status
    },
  });

  addFooterToAllPages(doc, 'Non-Verified Submissions Audit Report (Team-Wise Order)');
  doc.save('CSE_VIYUGAM_2026_Non_Verified_Participants_Report.pdf');
}

/**
 * Universal verification report PDF export helper
 */
export function exportVerificationReportPDF(participants = [], type = 'verified') {
  if (type === 'non_verified' || type === 'unverified' || type === 'new') {
    return exportNonVerifiedReportPDF(participants);
  }
  return exportVerifiedReportPDF(participants);
}

