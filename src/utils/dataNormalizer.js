/**
 * Dynamic Column Mapping and Data Normalizer Engine for CSE VIYUGAM
 */

const COLUMN_ALIASES = {
  name: ['name of the participant', 'participant name', 'full name', 'student name', 'name'],
  college: ['name of the college', 'name of the institute', 'collage name', 'college name', 'institution', 'collage', 'college', 'institute', 'organization'],
  email: ['email id', 'email address', 'email', 'e-mail'],
  phone: ['mobile number', 'phone number', 'contact number', 'mobile', 'phone', 'contact', 'whatsapp'],
  department: ['department', 'dept', 'branch', 'stream'],
  year: ['year of study', 'year', 'study year', 'grade'],
  amount: ['registration fee', 'amount', 'payment amount', 'fee', 'paid amount'],
  paymentStatus: ['payment status', 'status', 'payment', 'paid status', 'transaction status'],
  transactionId: ['transaction id', 'txn id', 'upi transaction id', 'utr', 'payment id'],
  timestamp: ['timestamp', 'registration date', 'date', 'time'],
  techEvents: ['select technical events', 'select the technical events', 'technical events', 'technical event'],
  nonTechEvents: ['select  non-technical events', 'select non-technical events', 'select the non-technical events', 'non-technical events', 'non-technical event'],
  generalEvent: ['select event', 'event name', 'event', 'registered event', 'events'],
  teamName: ['team name', 'team'],
  teamSize: ['team size', 'size of team'],
  paymentScreenshot: ['upload payment screenshot', 'payment screenshot', 'payment proof', 'screenshot', 'payment receipt'],
};

/**
 * Normalizes and groups variations of college names case-insensitively.
 * Converts "ppg institute of technology", "PPG INSTITUTE OF TECHNOLOGY", etc. -> "PPG Institute of Technology"
 */
export function normalizeCollegeName(rawCollege, canonicalMap = new Map()) {
  if (!rawCollege) return 'Unspecified Institution';
  
  // Clean string: trim, collapse spaces, lowercase for matching key
  const cleaned = String(rawCollege).trim().replace(/\s+/g, ' ');
  if (!cleaned) return 'Unspecified Institution';

  const lookupKey = cleaned.toLowerCase();

  // If we already have a canonical title-cased name for this key, return it
  if (canonicalMap.has(lookupKey)) {
    return canonicalMap.get(lookupKey);
  }

  // Convert to clean Title Case for display
  const titleCased = cleaned.split(' ').map(word => {
    if (word.length <= 2 && ['of', 'in', 'at', 'nd', 'st', 'rd', 'th'].includes(word.toLowerCase())) {
      return word.toLowerCase();
    }
    // Keep acronyms like PPG, CSE, IT, KIT, PSG uppercase
    if (['ppg', 'cse', 'it', 'kit', 'psg', 'skcet', 'srec', 'cit', 'gct', 'dsu'].includes(word.toLowerCase())) {
      return word.toUpperCase();
    }
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join(' ');

  canonicalMap.set(lookupKey, titleCased);
  return titleCased;
}

export function detectColumnMapping(headers = []) {
  const mapping = {};
  const lowerHeaders = headers.map(h => String(h || '').trim().toLowerCase());

  Object.entries(COLUMN_ALIASES).forEach(([fieldKey, aliases]) => {
    let foundIndex = lowerHeaders.findIndex(h => aliases.includes(h));
    if (foundIndex === -1) {
      foundIndex = lowerHeaders.findIndex(h => aliases.some(alias => h.includes(alias)));
    }
    if (foundIndex !== -1) {
      mapping[fieldKey] = headers[foundIndex];
    }
  });

  return mapping;
}

export function parseAmount(val) {
  if (val === undefined || val === null) return 250;
  const str = String(val).replace(/[^0-9.]/g, '');
  const num = parseFloat(str);
  if (!isNaN(num) && num > 0) return num;
  return 250;
}

export function parseEvents(row, mapping) {
  const events = new Set();
  const addEventString = (str) => {
    if (!str) return;
    const parts = String(str).split(/[,;/]+/);
    parts.forEach(p => {
      const cleaned = p.trim();
      if (cleaned && cleaned.length > 1 && !['none', 'nil', 'n/a'].includes(cleaned.toLowerCase())) {
        events.add(cleaned);
      }
    });
  };

  if (mapping.techEvents && row[mapping.techEvents]) addEventString(row[mapping.techEvents]);
  if (mapping.nonTechEvents && row[mapping.nonTechEvents]) addEventString(row[mapping.nonTechEvents]);
  if (mapping.generalEvent && row[mapping.generalEvent]) addEventString(row[mapping.generalEvent]);

  return Array.from(events);
}

export function normalizeRegistrationData(rawRows = [], headers = [], verificationState = {}) {
  const mapping = detectColumnMapping(headers);
  const canonicalCollegeMap = new Map();

  // Find all team member columns
  const teamMemberHeaders = headers.filter(h => {
    const l = String(h || '').toLowerCase();
    return l.includes('team member');
  });

  let verifiedKeys = new Set();
  let unverifiedKeys = new Set();

  if (verificationState instanceof Set) {
    verifiedKeys = verificationState;
  } else if (verificationState && typeof verificationState === 'object') {
    verifiedKeys = verificationState.verifiedKeys || new Set();
    unverifiedKeys = verificationState.unverifiedKeys || new Set();
  }

  const normalized = rawRows.map((row, index) => {
    const rawName = row[mapping.name] || '';
    const rawCollege = row[mapping.college] || '';
    const rawEmail = row[mapping.email] || '';
    const rawPhone = row[mapping.phone] || '';
    const rawDept = row[mapping.department] || '';
    const rawYear = row[mapping.year] || '';
    const rawTxnId = row[mapping.transactionId] || '';
    const rawStatus = row[mapping.paymentStatus] || '';
    const rawAmount = row[mapping.amount];
    const rawTimestamp = row[mapping.timestamp] || '';
    const rawTeamName = row[mapping.teamName] || '';
    const rawTeamSize = row[mapping.teamSize] || '';
    const rawScreenshot = row[mapping.paymentScreenshot] || '';

    // Collect team members
    const teamMembers = [];
    teamMemberHeaders.forEach(tmHeader => {
      const member = String(row[tmHeader] || '').trim();
      if (member && member.length > 1 && !['none', 'nil', 'n/a'].includes(member.toLowerCase())) {
        teamMembers.push(member);
      }
    });

    const rowIndex = row._rowIndex || index + 1;
    const id = `REG-${String(rowIndex).padStart(4, '0')}`;
    const name = String(rawName).trim() || `Participant #${rowIndex}`;
    
    // Standardize & group college names case-insensitively
    const college = normalizeCollegeName(rawCollege, canonicalCollegeMap);
    
    const email = String(rawEmail).trim().toLowerCase();
    const phone = String(rawPhone).trim();
    const department = String(rawDept).trim() || 'CSE / IT';
    const year = String(rawYear).trim() || 'N/A';
    const transactionId = String(rawTxnId).trim();
    const teamName = String(rawTeamName).trim();
    const teamSize = String(rawTeamSize).trim();
    const paymentScreenshot = String(rawScreenshot).trim();

    const candidateKeys = [
      id,
      `row_${rowIndex}`,
      transactionId && transactionId.length > 2 ? `txn_${transactionId}` : null,
      email && email.length > 3 ? `email_${email}` : null,
      phone && phone.length > 4 ? `phone_${phone}` : null,
      name && college ? `namecol_${name.toLowerCase().trim()}_${college.toLowerCase().trim()}` : null,
    ].filter(Boolean);

    const isExplicitlyVerified = candidateKeys.some(k => verifiedKeys.has(k));
    const isExplicitlyUnverified = candidateKeys.some(k => unverifiedKeys.has(k));

    let isVerified = false;
    if (isExplicitlyVerified) {
      isVerified = true;
    } else if (isExplicitlyUnverified) {
      isVerified = false;
    } else {
      isVerified = transactionId.length > 4 && (rawStatus.toLowerCase().includes('paid') || Boolean(paymentScreenshot));
    }

    const paymentStatus = isVerified ? 'Verified' : 'New / Pending';
    const amount = parseAmount(rawAmount);
    const events = parseEvents(row, mapping);

    return {
      id,
      rowIndex,
      name,
      college,
      email,
      phone,
      department,
      year,
      teamName,
      teamSize,
      teamMembers,
      amount,
      isVerified,
      paymentStatus,
      transactionId,
      paymentScreenshot,
      events,
      timestamp: rawTimestamp,
      rawRow: row,
    };
  });

  return {
    normalizedData: normalized,
    columnMapping: mapping,
    detectedFields: {
      hasEvents: normalized.some(r => r.events.length > 0),
      hasTimestamp: normalized.some(r => r.timestamp !== ''),
    },
  };
}
