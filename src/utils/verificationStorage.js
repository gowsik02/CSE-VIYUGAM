/**
 * Local storage manager for participant verification states with fallback keys
 */

const STORAGE_KEY = 'cse_viyugam_verified_keys';

export function getVerifiedKeys() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? new Set(JSON.parse(data)) : new Set();
  } catch (e) {
    return new Set();
  }
}

export function saveVerifiedKeys(verifiedSet) {
  try {
    const array = Array.from(verifiedSet);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(array));
  } catch (e) {
    console.error('Failed to save verified keys:', e);
  }
}

/**
 * Gets candidate keys for a participant to ensure bulletproof persistence
 */
export function getParticipantKeys(participant) {
  const keys = [];
  if (participant.id) keys.push(participant.id);
  if (participant.transactionId && participant.transactionId.length > 2) {
    keys.push(`txn_${participant.transactionId}`);
  }
  if (participant.email && participant.email.length > 3) {
    keys.push(`email_${participant.email.toLowerCase()}`);
  }
  if (participant.phone && participant.phone.length > 4) {
    keys.push(`phone_${participant.phone}`);
  }
  if (participant.name && participant.college) {
    keys.push(`namecol_${participant.name.toLowerCase().trim()}_${participant.college.toLowerCase().trim()}`);
  }
  return keys;
}

export function toggleVerificationStatus(participant) {
  const current = getVerifiedKeys();
  const keys = getParticipantKeys(participant);

  // Check if already verified by any key
  const isCurrentlyVerified = keys.some(k => current.has(k));

  if (isCurrentlyVerified) {
    // Unverify - remove all keys associated with this participant
    keys.forEach(k => current.delete(k));
  } else {
    // Verify - add all keys associated with this participant
    keys.forEach(k => current.add(k));
  }

  saveVerifiedKeys(current);
  return current;
}
