/**
 * Persistent Local Storage Manager for Participant & Organizer Verification States
 * Ensures once verified, states persist permanently across reloads & web re-entry.
 */

const VERIFIED_KEYS_STORAGE = 'cse_viyugam_verified_keys';
const UNVERIFIED_KEYS_STORAGE = 'cse_viyugam_unverified_keys';
const ADMIN_VERIFIED_STORAGE = 'cse_viyugam_admin_verified';

/**
 * Gets the verified and unverified key sets from local storage
 */
export function getVerificationState() {
  try {
    const verifiedData = localStorage.getItem(VERIFIED_KEYS_STORAGE);
    const unverifiedData = localStorage.getItem(UNVERIFIED_KEYS_STORAGE);

    const verifiedKeys = verifiedData ? new Set(JSON.parse(verifiedData)) : new Set();
    const unverifiedKeys = unverifiedData ? new Set(JSON.parse(unverifiedData)) : new Set();

    return { verifiedKeys, unverifiedKeys };
  } catch (e) {
    console.error('Failed to parse verification storage state:', e);
    return { verifiedKeys: new Set(), unverifiedKeys: new Set() };
  }
}

/**
 * Backwards compatibility helper for getVerifiedKeys
 */
export function getVerifiedKeys() {
  return getVerificationState().verifiedKeys;
}

/**
 * Saves both verified and unverified sets to local storage
 */
export function saveVerificationState(verifiedKeys, unverifiedKeys) {
  try {
    localStorage.setItem(VERIFIED_KEYS_STORAGE, JSON.stringify(Array.from(verifiedKeys)));
    localStorage.setItem(UNVERIFIED_KEYS_STORAGE, JSON.stringify(Array.from(unverifiedKeys)));
  } catch (e) {
    console.error('Failed to save verification state:', e);
  }
}

export function saveVerifiedKeys(verifiedSet) {
  const { unverifiedKeys } = getVerificationState();
  saveVerificationState(verifiedSet, unverifiedKeys);
}

/**
 * Gets candidate keys for a participant to ensure bulletproof persistence across page reloads
 */
export function getParticipantKeys(participant) {
  const keys = [];
  if (!participant) return keys;

  if (participant.id) keys.push(String(participant.id).trim());

  const rowIdx = participant.rowIndex || participant.row_index || participant._rowIndex;
  if (rowIdx) keys.push(`row_${rowIdx}`);

  if (participant.transactionId) {
    const txn = String(participant.transactionId).trim();
    if (txn.length > 2) keys.push(`txn_${txn}`);
  }

  if (participant.email) {
    const email = String(participant.email).trim().toLowerCase();
    if (email.length > 3) keys.push(`email_${email}`);
  }

  if (participant.phone) {
    const phone = String(participant.phone).trim();
    if (phone.length > 4) keys.push(`phone_${phone}`);
  }

  if (participant.name && participant.college) {
    const cleanName = String(participant.name).toLowerCase().trim();
    const cleanCollege = String(participant.college).toLowerCase().trim();
    keys.push(`namecol_${cleanName}_${cleanCollege}`);
  }

  return keys;
}

/**
 * Toggles verification status for a participant and persists changes in localStorage
 */
export function toggleVerificationStatus(participant) {
  const { verifiedKeys, unverifiedKeys } = getVerificationState();
  const keys = getParticipantKeys(participant);

  // Check if currently verified by any candidate key
  const isCurrentlyVerified = participant.isVerified !== undefined
    ? participant.isVerified
    : keys.some(k => verifiedKeys.has(k));

  if (isCurrentlyVerified) {
    // Unverify - remove from verified keys, add to unverified keys
    keys.forEach(k => {
      verifiedKeys.delete(k);
      unverifiedKeys.add(k);
    });
  } else {
    // Verify - add to verified keys, remove from unverified keys
    keys.forEach(k => {
      verifiedKeys.add(k);
      unverifiedKeys.delete(k);
    });
  }

  saveVerificationState(verifiedKeys, unverifiedKeys);
  return { verifiedKeys, unverifiedKeys };
}

/**
 * Admin Passcode / Site Access Verification Helpers
 * Stores permanent site verification flag so user is never re-prompted upon reload.
 */
export function isPasscodeVerified() {
  try {
    return localStorage.getItem(ADMIN_VERIFIED_STORAGE) === 'true';
  } catch (e) {
    return false;
  }
}

export function setPasscodeVerified(isVerified = true) {
  try {
    localStorage.setItem(ADMIN_VERIFIED_STORAGE, isVerified ? 'true' : 'false');
  } catch (e) {
    console.error('Failed to set passcode verified status:', e);
  }
}

