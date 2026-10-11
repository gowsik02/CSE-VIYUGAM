/**
 * Analytics Engine for CSE VIYUGAM
 * Calculates dynamic statistics over filtered datasets
 */

import { formatCurrency } from './formatters.js';
import { normalizeTeamKey, formatTeamDisplayName } from './dataNormalizer.js';

export function calculateSummaryMetrics(data = [], hasGenderColumn = false) {
  const totalParticipants = data.length;

  const collegesSet = new Set(data.map(d => d.college).filter(Boolean));
  const totalColleges = collegesSet.size;

  let maleCount = 0;
  let femaleCount = 0;
  let otherCount = 0;
  let unknownGenderCount = 0;

  let verifiedCount = 0;
  let newCount = 0;
  let verifiedAmount = 0;
  let newAmount = 0;

  data.forEach(item => {
    // Gender counters if present
    if (item.gender === 'Male') maleCount++;
    else if (item.gender === 'Female') femaleCount++;
    else if (item.gender === 'Other') otherCount++;
    else unknownGenderCount++;

    // Verification and Revenue breakdown
    if (item.isVerified) {
      verifiedCount++;
      verifiedAmount += item.amount || 250;
    } else {
      newCount++;
      newAmount += item.amount || 250;
    }
  });

  const totalAmount = verifiedAmount + newAmount;
  const malePercent = totalParticipants > 0 ? ((maleCount / totalParticipants) * 100).toFixed(1) : '0.0';
  const femalePercent = totalParticipants > 0 ? ((femaleCount / totalParticipants) * 100).toFixed(1) : '0.0';
  const verifiedRate = totalParticipants > 0 ? ((verifiedCount / totalParticipants) * 100).toFixed(1) : '0.0';

  return {
    totalParticipants,
    totalColleges,
    hasGenderColumn,
    maleCount,
    malePercent,
    femaleCount,
    femalePercent,
    otherCount,
    unknownGenderCount,
    verifiedCount,
    newCount,
    verifiedAmount,
    newAmount,
    totalAmount,
    verifiedRate,
  };
}

export function calculateGenderDistribution(data = [], hasGenderColumn = false) {
  if (!hasGenderColumn) {
    return [];
  }

  let male = 0;
  let female = 0;
  let other = 0;

  data.forEach(item => {
    if (item.gender === 'Male') male++;
    else if (item.gender === 'Female') female++;
    else if (item.gender === 'Other') other++;
  });

  const result = [];
  if (male > 0) result.push({ name: 'Male', value: male, color: '#1E40AF' });
  if (female > 0) result.push({ name: 'Female', value: female, color: '#BE185D' });
  if (other > 0) result.push({ name: 'Other', value: other, color: '#047857' });

  return result;
}

export function calculateCollegeParticipation(data = [], limit = 10) {
  const collegeMap = {};

  data.forEach(item => {
    const col = item.college || 'Unspecified';
    if (!collegeMap[col]) {
      collegeMap[col] = {
        college: col,
        participants: 0,
        male: 0,
        female: 0,
        verified: 0,
        newRegs: 0,
        amount: 0,
      };
    }

    collegeMap[col].participants += 1;
    if (item.gender === 'Male') collegeMap[col].male += 1;
    else if (item.gender === 'Female') collegeMap[col].female += 1;

    if (item.isVerified) {
      collegeMap[col].verified += 1;
      collegeMap[col].amount += item.amount || 250;
    } else {
      collegeMap[col].newRegs += 1;
    }
  });

  const sorted = Object.values(collegeMap).sort((a, b) => b.participants - a.participants);
  const total = data.length;

  const topColleges = sorted.slice(0, limit).map((c, index) => ({
    rank: index + 1,
    ...c,
    percentage: total > 0 ? ((c.participants / total) * 100).toFixed(1) : '0.0',
  }));

  const allColleges = sorted.map((c, index) => ({
    rank: index + 1,
    ...c,
    percentage: total > 0 ? ((c.participants / total) * 100).toFixed(1) : '0.0',
  }));

  return {
    topColleges,
    allColleges,
    totalColleges: sorted.length,
  };
}

export function calculatePaymentSummary(data = []) {
  let verifiedCount = 0;
  let newCount = 0;
  let verifiedRevenue = 0;
  let newRevenue = 0;

  const collegeRevenue = {};

  data.forEach(item => {
    const col = item.college || 'Unspecified';
    const amt = item.amount || 250;

    if (item.isVerified) {
      verifiedCount++;
      verifiedRevenue += amt;
      collegeRevenue[col] = (collegeRevenue[col] || 0) + amt;
    } else {
      newCount++;
      newRevenue += amt;
    }
  });

  const statusDonut = [
    { name: 'Verified Registrations', value: verifiedCount, color: '#16A34A' },
    { name: 'New Registrations', value: newCount, color: '#CA8A04' },
  ];

  const topRevenueColleges = Object.entries(collegeRevenue)
    .map(([college, revenue]) => ({ college, revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8);

  return {
    verifiedCount,
    newCount,
    verifiedRevenue,
    newRevenue,
    totalRevenue: verifiedRevenue + newRevenue,
    statusDonut,
    topRevenueColleges,
  };
}

export function calculateEventParticipation(data = []) {
  const eventCounts = {};

  data.forEach(item => {
    if (Array.isArray(item.events)) {
      item.events.forEach(event => {
        if (event) {
          eventCounts[event] = (eventCounts[event] || 0) + 1;
        }
      });
    }
  });

  return Object.entries(eventCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function calculateEventDetailedBreakdown(data = []) {
  const eventMap = {};

  data.forEach(item => {
    if (Array.isArray(item.events) && item.events.length > 0) {
      item.events.forEach(eventName => {
        if (eventName) {
          if (!eventMap[eventName]) {
            eventMap[eventName] = {
              eventName,
              count: 0,
              participants: [],
            };
          }

          eventMap[eventName].count += 1;
          eventMap[eventName].participants.push({
            sNo: eventMap[eventName].count,
            id: item.id,
            rowIndex: item.rowIndex,
            name: item.name || 'Participant',
            college: item.college || 'Unspecified Institution',
            department: item.department || 'N/A',
            year: item.year || 'N/A',
            phone: item.phone || '',
            email: item.email || '',
            isVerified: item.isVerified || false,
            timestamp: item.timestamp || '',
          });
        }
      });
    }
  });

  return Object.values(eventMap).sort((a, b) => b.count - a.count);
}


export function calculateRegistrationTrend(data = []) {
  const dateMap = {};

  data.forEach(item => {
    if (item.timestamp) {
      let dateKey = item.timestamp;
      try {
        const d = new Date(item.timestamp);
        if (!isNaN(d.getTime())) {
          dateKey = d.toISOString().split('T')[0];
        }
      } catch (e) {}

      dateMap[dateKey] = (dateMap[dateKey] || 0) + 1;
    }
  });

  return Object.entries(dateMap)
    .map(([date, registrations]) => ({ date, registrations }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function calculateDataQuality(data = []) {
  let validCount = 0;
  let missingName = 0;
  let missingCollege = 0;
  let missingGender = 0;

  const affectedRecords = {
    missingName: [],
    missingCollege: [],
    missingGender: [],
  };

  data.forEach(item => {
    let isValid = true;

    if (!item.name || item.name.includes('Participant #')) {
      missingName++;
      isValid = false;
      affectedRecords.missingName.push(item);
    }
    if (!item.college || item.college === 'Unspecified Institution') {
      missingCollege++;
      isValid = false;
      affectedRecords.missingCollege.push(item);
    }
    if (item.gender === 'Unknown') {
      missingGender++;
      affectedRecords.missingGender.push(item);
    }

    if (isValid) validCount++;
  });

  const duplicates = detectDuplicates(data);

  return {
    totalRecords: data.length,
    validCount,
    missingName,
    missingCollege,
    missingGender,
    duplicateCount: duplicates.length,
    duplicates,
    affectedRecords,
  };
}

export function detectDuplicates(data = []) {
  const seenEmail = new Map();
  const seenPhone = new Map();
  const seenTxn = new Map();
  const seenNameCollege = new Map();
  const duplicatesMap = new Map();

  data.forEach(item => {
    const emailKey = item.email && item.email.length > 3 ? item.email : null;
    const phoneKey = item.phone && item.phone.length > 5 ? item.phone : null;
    const txnKey = item.transactionId && item.transactionId.length > 3 ? item.transactionId : null;
    const nameCollegeKey = item.name && item.college ? `${item.name.toLowerCase()}_${item.college.toLowerCase()}` : null;

    let matchReason = null;
    let originalRecord = null;

    if (emailKey && seenEmail.has(emailKey)) {
      matchReason = `Same Email (${item.email})`;
      originalRecord = seenEmail.get(emailKey);
    } else if (phoneKey && seenPhone.has(phoneKey)) {
      matchReason = `Same Phone (${item.phone})`;
      originalRecord = seenPhone.get(phoneKey);
    } else if (txnKey && seenTxn.has(txnKey)) {
      matchReason = `Same Transaction ID (${item.transactionId})`;
      originalRecord = seenTxn.get(txnKey);
    } else if (nameCollegeKey && seenNameCollege.has(nameCollegeKey)) {
      matchReason = `Same Name & College (${item.name})`;
      originalRecord = seenNameCollege.get(nameCollegeKey);
    }

    if (emailKey && !seenEmail.has(emailKey)) seenEmail.set(emailKey, item);
    if (phoneKey && !seenPhone.has(phoneKey)) seenPhone.set(phoneKey, item);
    if (txnKey && !seenTxn.has(txnKey)) seenTxn.set(txnKey, item);
    if (nameCollegeKey && !seenNameCollege.has(nameCollegeKey)) seenNameCollege.set(nameCollegeKey, item);

    if (matchReason && originalRecord) {
      duplicatesMap.set(item.id, {
        record: item,
        duplicateOf: originalRecord,
        reason: matchReason,
      });
    }
  });

  return Array.from(duplicatesMap.values());
}

export function generateInsights(data = []) {
  if (!data || data.length === 0) {
    return ['No registration data available to generate insights.'];
  }

  const metrics = calculateSummaryMetrics(data);
  const collegeStats = calculateCollegeParticipation(data, 5);
  const eventStats = calculateEventParticipation(data);

  const insights = [];

  if (collegeStats.topColleges.length > 0) {
    const topCol = collegeStats.topColleges[0];
    insights.push(
      `🏆 **${topCol.college}** leads participation with **${topCol.participants} registered participants** (${topCol.percentage}% of overall registrations).`
    );
  }

  insights.push(
    `✅ **${metrics.verifiedCount} Registrations** (${metrics.verifiedRate}%) have been verified, accounting for **${formatCurrency(metrics.verifiedAmount)}** in verified total collections.`
  );

  insights.push(
    `📥 **${metrics.newCount} New Registrations** are awaiting verification approval.`
  );

  if (eventStats.length > 0) {
    const topEvent = eventStats[0];
    insights.push(
      `🔥 **${topEvent.name}** is the most popular event with **${topEvent.count} participant registrations**.`
    );
  }

  return insights;
}

export function calculateTeamsSummary(data = []) {
  const teamsMap = {};
  let soloCount = 0;
  let teamParticipantsCount = 0;

  data.forEach(p => {
    const rawTeamName = p.teamName ? String(p.teamName).trim() : '';
    const tKey = p.teamKey || normalizeTeamKey(rawTeamName);
    if (!tKey) {
      soloCount++;
      return;
    }

    teamParticipantsCount++;
    const displayName = p.teamName || formatTeamDisplayName(rawTeamName);

    if (!teamsMap[tKey]) {
      teamsMap[tKey] = {
        name: displayName,
        key: tKey,
        college: p.college || 'Unspecified Institution',
        department: p.department || 'N/A',
        year: p.year || 'N/A',
        events: Array.isArray(p.events) ? [...p.events] : [],
        members: [],
        lead: null,
        leadName: p.leadName || p.name,
        verifiedCount: 0,
        pendingCount: 0,
        allVerified: true,
        anyVerified: false,
      };
    } else {
      // If the current team name is all lowercase but a new member has proper casing, upgrade display name
      const currentName = teamsMap[tKey].name;
      if (currentName === currentName.toLowerCase() && displayName !== displayName.toLowerCase()) {
        teamsMap[tKey].name = displayName;
      }
    }

    if (Array.isArray(p.events)) {
      p.events.forEach(ev => {
        if (!teamsMap[tKey].events.includes(ev)) {
          teamsMap[tKey].events.push(ev);
        }
      });
    }

    teamsMap[tKey].members.push(p);

    if (p.isVerified) {
      teamsMap[tKey].verifiedCount++;
      teamsMap[tKey].anyVerified = true;
    } else {
      teamsMap[tKey].pendingCount++;
      teamsMap[tKey].allVerified = false;
    }

    // Assign team lead: prefer member flagged with isLead, else leadName match, else first non-team-member
    if (p.isLead || (!teamsMap[tKey].lead && !p.isTeamMember)) {
      teamsMap[tKey].lead = p;
      teamsMap[tKey].leadName = p.name;
    }
  });

  const teamsList = Object.values(teamsMap).map(t => {
    if (!t.lead && t.members.length > 0) {
      t.lead = t.members[0];
      t.leadName = t.members[0].name;
    }
    const totalMembers = t.members.length;
    let status = 'Pending';
    if (t.allVerified && totalMembers > 0) status = 'Verified';
    else if (t.anyVerified) status = 'Partial';

    return {
      ...t,
      memberCount: totalMembers,
      status,
    };
  });

  teamsList.sort((a, b) => b.memberCount - a.memberCount || a.name.localeCompare(b.name));

  const totalTeams = teamsList.length;
  const avgTeamSize = totalTeams > 0 ? (teamParticipantsCount / totalTeams).toFixed(1) : '0';
  const fullyVerifiedTeams = teamsList.filter(t => t.status === 'Verified').length;
  const pendingTeams = teamsList.filter(t => t.status !== 'Verified').length;

  return {
    teamsList,
    totalTeams,
    teamParticipantsCount,
    soloCount,
    avgTeamSize,
    fullyVerifiedTeams,
    pendingTeams,
  };
}
