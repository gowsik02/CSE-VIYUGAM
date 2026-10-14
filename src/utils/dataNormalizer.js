/**
 * Dynamic Column Mapping and Data Normalizer Engine for CSE VIYUGAM
 * Handles intelligent deduplication, team member inclusion, and verification auditing
 */

const COLUMN_ALIASES = {
  name: ['name of the participant', 'participant name', 'full name', 'student name', 'name'],
  college: ['name of the college', 'name of the institute', 'collage name', 'college name', 'institution', 'collage', 'college', 'institute', 'organization'],
  email: ['email id', 'email address', 'email', 'e-mail'],
  phone: ['mobile number', 'phone number', 'contact number', 'mobile', 'phone', 'contact', 'whatsapp'],
  department: ['department', 'dept', 'branch', 'stream'],
  year: ['year of study', 'year', 'study year', 'grade'],
  amount: ['registration fee', 'amount', 'payment amount', 'fee', 'paid amount'],
  paymentStatus: ['payment status', 'paid status', 'transaction status', 'status'],
  verificationStatus: [
    'verification status',
    'verified status',
    'verification slide',
    'verification side',
    'verification',
    'verified',
    'admin verification',
    'approval status',
    'approval',
    'admin status',
    'is verified',
    'verify',
    'verified / non verified',
    'verified/not verified',
    'verified/non-verified',
  ],
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
 * Generates a canonical matching key for an institution.
 * Accounts for common Indian transliteration and spelling variations:
 * - "sakthi" vs "shakthi" vs "shakti" vs "sakti" (same college)
 * - "sree" vs "shree" vs "sri"
 * - "collage" vs "college"
 * - "engg" vs "engineering"
 * - "tech" vs "technology"
 * - "inst" vs "institute"
 */
export function getCollegeCanonicalKey(rawCollege) {
  if (!rawCollege) return '';
  let str = String(rawCollege).toLowerCase().trim();

  // Normalize phonetic variations of Sakthi / Shakthi
  str = str.replace(/shakthi/g, 'sakthi')
           .replace(/shakti/g, 'sakthi')
           .replace(/sakti/g, 'sakthi');

  // Normalize Sri / Sree / Shree
  str = str.replace(/\b(sree|shree)\b/g, 'sri');

  // Common spelling typos and abbreviations
  str = str.replace(/\bcollage\b/g, 'college');
  str = str.replace(/\bengg\b/g, 'engineering');
  str = str.replace(/\btech\b/g, 'technology');
  str = str.replace(/\binst\b/g, 'institute');

  // Strip punctuation and collapse spaces
  str = str.replace(/[.,\-_/()]/g, ' ').replace(/\s+/g, ' ').trim();
  return str;
}

/**
 * Normalizes and groups variations of college names case-insensitively.
 * Unifies "Sree Sakthi Engineering College" and "SREE SHAKTHI ENGINEERING COLLEGE" -> "Sree Sakthi Engineering College"
 * Converts "ppg institute of technology", "PPG INSTITUTE OF TECHNOLOGY" -> "PPG Institute of Technology"
 */
export function normalizeCollegeName(rawCollege, canonicalMap = new Map()) {
  if (!rawCollege) return 'Unspecified Institution';
  
  // Clean string: trim, collapse spaces
  const cleaned = String(rawCollege).trim().replace(/\s+/g, ' ');
  if (!cleaned) return 'Unspecified Institution';

  const lookupKey = getCollegeCanonicalKey(cleaned);

  // If we already have a canonical title-cased name for this key, return it
  if (canonicalMap.has(lookupKey)) {
    return canonicalMap.get(lookupKey);
  }

  // Convert to clean Title Case for display
  const titleCased = cleaned.split(' ').map(word => {
    const lower = word.toLowerCase();
    if (['of', 'in', 'at', 'nd', 'st', 'rd', 'th', 'to', 'and', 'for', 'the'].includes(lower)) {
      return lower;
    }
    // Keep acronyms uppercase
    if (['ppg', 'cse', 'it', 'kit', 'psg', 'skcet', 'srec', 'cit', 'gct', 'dsu', 'biet', 'anna', 'ssec', 'siet'].includes(lower)) {
      return lower.toUpperCase();
    }
    // Standardize shakthi / shakti to clean Sakthi display spelling
    if (lower === 'shakthi' || lower === 'shakti') {
      return 'Sakthi';
    }
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join(' ');

  canonicalMap.set(lookupKey, titleCased);
  return titleCased;
}

/**
 * Normalizes string for name equivalence checks
 * Removes dots, dashes, underscores, transliteration nuances (th -> t), extra spaces
 */
export function normalizeName(str) {
  if (!str) return '';
  return String(str)
    .toLowerCase()
    .replace(/[._\-]/g, ' ')
    .replace(/th/g, 't')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Robust participant name equivalence matcher
 * Prevents repeating names across primary registrations and team member columns
 * Handles:
 * - Order differences: "Swapna. S" vs "S Swapna"
 * - Dot / spacing differences: "Yashwanth.M" vs "YASHWANTH M"
 * - Compound spacing: "Sailaxmi. R" vs "Sai Laxmi R"
 * - Transliteration variations: "Chitra Devi. S" vs "Chithra Devi S"
 */
export function areNamesEquivalent(nameA, nameB) {
  if (!nameA || !nameB) return false;
  const normA = normalizeName(nameA);
  const normB = normalizeName(nameB);
  if (!normA || !normB) return false;
  if (normA === normB) return true;

  const tokensA = normA.split(' ').filter(Boolean);
  const tokensB = normB.split(' ').filter(Boolean);

  // Exact sorted token match (handles "Swapna S" vs "S Swapna")
  const sortedA = [...tokensA].sort().join('_');
  const sortedB = [...tokensB].sort().join('_');
  if (sortedA === sortedB) return true;

  // Condensed match ignoring all internal spaces (handles "Sailaxmi R" vs "Sai Laxmi R")
  const condA = normA.replace(/\s+/g, '');
  const condB = normB.replace(/\s+/g, '');
  if (condA === condB) return true;

  // Single-character initials vs core names check
  const initialsA = tokensA.filter(t => t.length === 1);
  const initialsB = tokensB.filter(t => t.length === 1);
  const coreA = tokensA.filter(t => t.length > 1).sort().join('_');
  const coreB = tokensB.filter(t => t.length > 1).sort().join('_');

  if (coreA && coreB && coreA === coreB) {
    if (initialsA.length > 0 && initialsB.length > 0) {
      return initialsA.some(init => initialsB.includes(init));
    }
    return true;
  }

  if (condA.length > 4 && condB.length > 4) {
    if (condA === condB + (initialsA[0] || '') || condB === condA + (initialsB[0] || '')) {
      return true;
    }
  }

  return false;
}

/**
 * Normalizes team name into a canonical grouping key.
 * Strips whitespace, case differences, and symbols (&, -, _) so that
 * "Vortex", "Vortex ", "COFFEE&CODE", and "COFFEE & CODE" group together flawlessly.
 */
export function normalizeTeamKey(teamName) {
  if (!teamName) return '';
  return String(teamName)
    .toLowerCase()
    .replace(/[\s\-_&]+/g, '')
    .trim();
}

/**
 * Formats a clean display name for a team.
 * Preserves uppercase acronyms and trims extraneous trailing/leading spaces.
 */
export function formatTeamDisplayName(teamName) {
  if (!teamName) return '';
  const cleaned = String(teamName).trim().replace(/\s+/g, ' ');
  if (!cleaned) return '';
  // If lowercase, convert to Title Case
  if (cleaned === cleaned.toLowerCase()) {
    return cleaned.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }
  return cleaned;
}

export function detectColumnMapping(headers = []) {
  const mapping = {};
  const lowerHeaders = headers.map(h => String(h || '').trim().toLowerCase());

  // Pass 1: Look for exact header matches
  Object.entries(COLUMN_ALIASES).forEach(([fieldKey, aliases]) => {
    const foundIndex = lowerHeaders.findIndex(h => aliases.includes(h));
    if (foundIndex !== -1) {
      mapping[fieldKey] = headers[foundIndex];
    }
  });

  // Pass 2: Fallback to substring matches for unmapped keys (preventing false matches)
  Object.entries(COLUMN_ALIASES).forEach(([fieldKey, aliases]) => {
    if (!mapping[fieldKey]) {
      const foundIndex = lowerHeaders.findIndex(h => {
        // Prevent paymentStatus from matching screenshot or proof columns
        if (fieldKey === 'paymentStatus' && (h.includes('screenshot') || h.includes('proof') || h.includes('receipt') || h.includes('upload'))) {
          return false;
        }
        // Prevent teamName from matching team member columns
        if (fieldKey === 'teamName' && (h.includes('member') || h.includes('teammate') || h.includes('size'))) {
          return false;
        }
        return aliases.some(alias => h.includes(alias));
      });
      if (foundIndex !== -1) {
        mapping[fieldKey] = headers[foundIndex];
      }
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

/**
 * Normalizes registration data from Google Sheets into comprehensive participant records.
 * Rules:
 * 1. New registrations from Google Sheets do NOT automatically go to Verified. They remain New / Pending unless verified by organizer.
 * 2. Team members who do not have a separate registration row are included as participants.
 * 3. Names are strictly deduplicated so no participant is repeated.
 */
export function normalizeRegistrationData(rawRows = [], headers = [], verificationState = {}) {
  const mapping = detectColumnMapping(headers);
  const canonicalCollegeMap = new Map();

  // Find all team member column headers
  const teamMemberHeaders = headers.filter(h => {
    const l = String(h || '').toLowerCase();
    return l.includes('team member') || l.includes('teammate') || l.includes('member');
  });

  let verifiedKeys = new Set();
  let unverifiedKeys = new Set();

  if (verificationState instanceof Set) {
    verifiedKeys = verificationState;
  } else if (verificationState && typeof verificationState === 'object') {
    verifiedKeys = verificationState.verifiedKeys || new Set();
    unverifiedKeys = verificationState.unverifiedKeys || new Set();
  }

  // 0. Pre-Pass: Build Canonical Team Map to group identical/spaced team names
  const canonicalTeamMap = new Map(); // teamKey -> best canonical display name
  rawRows.forEach((row) => {
    const rawTName = row[mapping.teamName] || '';
    const tKey = normalizeTeamKey(rawTName);
    if (tKey) {
      const formatted = formatTeamDisplayName(rawTName);
      if (!canonicalTeamMap.has(tKey)) {
        canonicalTeamMap.set(tKey, formatted);
      } else {
        const existing = canonicalTeamMap.get(tKey);
        // Prefer capitalized/longer representation over lowercase/shorter
        if (existing === existing.toLowerCase() && formatted !== formatted.toLowerCase()) {
          canonicalTeamMap.set(tKey, formatted);
        }
      }
    }
  });

  // 1. First Pass: Map each raw row as a Primary Registration
  const primaryRegistrations = rawRows.map((row, index) => {
    const rawName = row[mapping.name] || '';
    const rawCollege = row[mapping.college] || '';
    const rawEmail = row[mapping.email] || '';
    const rawPhone = row[mapping.phone] || '';
    const rawDept = row[mapping.department] || '';
    const rawYear = row[mapping.year] || '';
    const rawTxnId = row[mapping.transactionId] || '';
    const rawStatus = row[mapping.paymentStatus] || '';
    const rawVerifStatus = mapping.verificationStatus ? (row[mapping.verificationStatus] || '') : '';
    const rawAmount = row[mapping.amount];
    const rawTimestamp = row[mapping.timestamp] || '';
    const rawTeamName = row[mapping.teamName] || '';
    const rawTeamSize = row[mapping.teamSize] || '';
    const rawScreenshot = row[mapping.paymentScreenshot] || '';

    // Collect and clean team member names from all team member columns
    const teamMembers = [];
    teamMemberHeaders.forEach(tmHeader => {
      const cellVal = String(row[tmHeader] || '').trim();
      if (!cellVal) return;
      // Split on comma, semicolon, newline or plus in case multiple names in one cell
      const candidates = cellVal.split(/[,;\n\+]/);
      candidates.forEach(cand => {
        const member = cand.trim();
        if (
          member &&
          member.length > 1 &&
          !['none', 'nil', 'n/a', 'na', 'no', '-', 'null', 'undefined', 'not applicable'].includes(member.toLowerCase())
        ) {
          teamMembers.push(member);
        }
      });
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

    // Canonicalize team name so all members share the exact same formatted name
    const teamKey = normalizeTeamKey(rawTeamName);
    const teamName = teamKey ? canonicalTeamMap.get(teamKey) : '';
    const teamSize = String(rawTeamSize).trim();
    const paymentScreenshot = String(rawScreenshot).trim();

    // Unique candidate keys strictly isolated to THIS participant (immune to teammate collisions)
    const cleanNormName = normalizeName(name);
    const cleanNormCollege = college.toLowerCase().trim();
    const candidateKeys = [
      id,
      `row_${rowIndex}`,
      cleanNormName ? `name_${cleanNormName}` : null,
      cleanNormName && cleanNormCollege ? `namecol_${cleanNormName}_${cleanNormCollege}` : null,
    ].filter(Boolean);

    const isExplicitlyVerified = candidateKeys.some(k => verifiedKeys.has(k));
    const isExplicitlyUnverified = candidateKeys.some(k => unverifiedKeys.has(k));

    // Check sheet's explicit verification column (the 'verification slide')
    const rawVerifVal = mapping.verificationStatus ? String(row[mapping.verificationStatus] || '').trim().toLowerCase() : '';
    const isSheetYes = ['yes', 'y', 'verified', 'approved', 'true', 'ok', '1'].includes(rawVerifVal);
    const isSheetNo = ['no', 'n', 'unverified', 'non verified', 'not verified', 'false', '0', 'pending'].includes(rawVerifVal);

    // CRITICAL REQUIREMENT:
    // 1. If marked YES in Excel, they are verified.
    // 2. If organizer specifically verifies THIS participant in the website, they go to verified.
    // 3. Once verified, they never go back to unverified.
    // 1. Explicit website actions (Verify / Unverify) take precedence
    // 2. Fallback to Google Sheets / Excel verification slide (yes / no)
    let isVerified = false;
    let verificationSource = 'default';

    if (isExplicitlyVerified) {
      isVerified = true;
      verificationSource = 'manual_verified';
    } else if (isExplicitlyUnverified) {
      isVerified = false;
      verificationSource = 'manual_unverified';
    } else if (isSheetYes) {
      isVerified = true;
      verificationSource = 'excel_yes';
    } else if (isSheetNo) {
      isVerified = false;
      verificationSource = 'excel_no';
    } else {
      const explicitSheetStatus = String(rawStatus || '').trim().toLowerCase();
      if (['verified', 'approved', 'yes', 'true'].includes(explicitSheetStatus)) {
        isVerified = true;
        verificationSource = 'sheet_status';
      } else {
        isVerified = false;
        verificationSource = 'pending';
      }
    }

    const paymentStatus = isVerified ? 'Verified' : (transactionId || paymentScreenshot ? 'Pending Verification' : 'New / Pending');
    const amount = parseAmount(rawAmount);
    const events = parseEvents(row, mapping);

    return {
      id,
      rowIndex,
      displayRowIndex: String(rowIndex),
      name,
      college,
      email,
      phone,
      department,
      year,
      teamName,
      teamKey,
      teamSize,
      teamMembers,
      amount,
      isVerified,
      verificationSource,
      excelVerification: isVerified ? 'YES' : 'NO',
      excelVerificationRaw: rawVerifVal,
      paymentStatus,
      transactionId,
      paymentScreenshot,
      events,
      timestamp: rawTimestamp,
      rawRow: row,
      candidateKeys,
      isTeamMember: false,
      isLead: Boolean(teamName),
      teamRole: teamName ? 'Team Lead' : 'Individual',
      leadName: name,
      leadId: id,
    };
  });

  // 2. Resolve Team Leaders and Member Roles for Primary Registrations:
  // If a separate registration is also listed in team members of a team,
  // mark that separate registration as "Team Member" (NOT "Team Lead")
  const teamLeaders = new Map(); // teamKey -> first primary registrant of that team

  primaryRegistrations.forEach(p => {
    if (p.teamKey && !teamLeaders.has(p.teamKey)) {
      teamLeaders.set(p.teamKey, p);
    }
  });

  primaryRegistrations.forEach(p => {
    const leader = p.teamKey ? teamLeaders.get(p.teamKey) : null;

    // Check if p is listed in team members of ANY other primary registration
    const isListedInAnyTeamMembers = primaryRegistrations.some(other => {
      if (other.id === p.id) return false;
      return other.teamMembers && other.teamMembers.some(m => areNamesEquivalent(m, p.name));
    });

    if (isListedInAnyTeamMembers && leader && leader.id !== p.id) {
      // Separate registration that is also a team member -> Role: Team Member
      p.isTeamMember = true;
      p.isLead = false;
      p.teamRole = 'Team Member';
      p.leadName = leader.name;
      p.leadId = leader.id;
      p.parentId = leader.id;
    } else if (p.teamName) {
      // Primary creator / first registrant of the team -> Team Lead
      p.isTeamMember = false;
      p.isLead = true;
      p.teamRole = 'Team Lead';
      p.leadName = p.name;
      p.leadId = p.id;
    } else {
      // Registered with no team -> Individual
      p.isTeamMember = false;
      p.isLead = false;
      p.teamRole = 'Individual';
      p.leadName = p.name;
      p.leadId = p.id;
    }
  });

  // 3. Third Pass: Build full participant roster including team members who don't have separate registrations
  // Check if a name already exists as a separate primary registration in the Google Sheet
  const existsAsSeparateRegistration = (candidateName) => {
    return primaryRegistrations.some(p => areNamesEquivalent(p.name, candidateName));
  };

  const finalParticipants = [];

  // Check if name is already anywhere in the participant roster to strictly avoid repeating names
  const isAlreadyInRoster = (candidateName) => {
    return finalParticipants.some(p => areNamesEquivalent(p.name, candidateName));
  };

  primaryRegistrations.forEach((primary) => {
    // Add primary registrant if not already in roster
    if (!isAlreadyInRoster(primary.name)) {
      finalParticipants.push(primary);
    }

    // Process all team members listed under this primary registration
    let memberCounter = 1;
    primary.teamMembers.forEach((member) => {
      const cleanMemberName = String(member).trim();
      if (!cleanMemberName) return;

      // Rule: If team member's name exists as a separate registration row, DO NOT ADD (avoid duplicate)
      if (existsAsSeparateRegistration(cleanMemberName)) {
        return;
      }

      // Rule: Do not repeat names if already included in roster
      if (isAlreadyInRoster(cleanMemberName)) {
        return;
      }

      // Team member does not exist as separate registration -> Include as participant!
      const memberId = `${primary.id}-M${memberCounter}`;
      const memberDisplayIndex = `${primary.rowIndex}-M${memberCounter}`;
      const memberCleanNormName = normalizeName(cleanMemberName);
      const cleanCollegeNorm = primary.college.toLowerCase().trim();

      const memberCandidateKeys = [
        memberId,
        memberCleanNormName ? `name_${memberCleanNormName}` : null,
        memberCleanNormName && cleanCollegeNorm ? `namecol_${memberCleanNormName}_${cleanCollegeNorm}` : null,
        `row_${primary.rowIndex}_m_${memberCleanNormName}`,
      ].filter(Boolean);

      const isMemberExplicitlyVerified = memberCandidateKeys.some(k => verifiedKeys.has(k));
      const isMemberExplicitlyUnverified = memberCandidateKeys.some(k => unverifiedKeys.has(k));

      let memberVerified = false;
      let memberVerifSource = 'inherited';

      if (isMemberExplicitlyVerified) {
        // Specifically verified in the website: this specific member goes to Verified!
        memberVerified = true;
        memberVerifSource = 'manual_verified';
      } else if (isMemberExplicitlyUnverified) {
        memberVerified = false;
        memberVerifSource = 'manual_unverified';
      } else if (primary.verificationSource === 'excel_yes') {
        // Inherited from original Excel verification slide row marked YES
        memberVerified = true;
        memberVerifSource = 'excel_inherited';
      } else {
        // If primary was manually verified in the website, or if Excel marked NO, or pending:
        // Teammates STAY UNVERIFIED unless individually verified!
        memberVerified = false;
        memberVerifSource = 'team_member_unverified';
      }

      const memberParticipant = {
        id: memberId,
        rowIndex: primary.rowIndex,
        displayRowIndex: memberDisplayIndex,
        name: cleanMemberName,
        college: primary.college,
        email: primary.email ? `${primary.email}` : '',
        phone: primary.phone || '',
        department: primary.department,
        year: primary.year,
        teamName: primary.teamName,
        teamKey: primary.teamKey,
        teamSize: primary.teamSize,
        teamMembers: primary.teamMembers,
        amount: primary.amount,
        isVerified: memberVerified,
        verificationSource: memberVerifSource,
        excelVerification: memberVerified ? 'YES' : 'NO',
        excelVerificationRaw: primary.excelVerificationRaw || (memberVerified ? 'yes' : 'no'),
        paymentStatus: memberVerified ? 'Verified' : 'Pending Verification',
        transactionId: primary.transactionId,
        paymentScreenshot: primary.paymentScreenshot,
        events: primary.events,
        timestamp: primary.timestamp,
        rawRow: primary.rawRow,
        candidateKeys: memberCandidateKeys,
        isTeamMember: true,
        isSyntheticMember: true,
        isLead: false,
        teamRole: 'Team Member',
        leadName: primary.isLead ? primary.name : primary.leadName,
        leadId: primary.isLead ? primary.id : primary.leadId,
        parentId: primary.isLead ? primary.id : primary.leadId,
      };

      finalParticipants.push(memberParticipant);
      memberCounter++;
    });
  });

  return {
    normalizedData: finalParticipants,
    primaryRegistrations,
    columnMapping: mapping,
    detectedFields: {
      hasEvents: finalParticipants.some(r => r.events.length > 0),
      hasTimestamp: finalParticipants.some(r => r.timestamp !== ''),
    },
  };
}
