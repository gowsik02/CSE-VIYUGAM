/**
 * Persistent Local Storage Manager for Participant & Organizer Verification States
 * Ensures once verified, states persist permanently across reloads & web re-entry.
 * Guarantees zero collisions between teammates sharing transaction IDs or contacts.
 */

const VERIFIED_KEYS_STORAGE = 'cse_viyugam_verified_keys';
const UNVERIFIED_KEYS_STORAGE = 'cse_viyugam_unverified_keys';
const ADMIN_VERIFIED_STORAGE = 'cse_viyugam_admin_verified';

/**
 * Normalizes string for name equivalence checks
 */
function cleanNameForStorage(str) {
  if (!str) return '';
  return String(str)
    .toLowerCase()
    .replace(/[._\-]/g, ' ')
    .replace(/th/g, 't')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Gets the verified and unverified key sets from local storage.
 * Automatically sanitizes legacy shared keys (txn_, email_, phone_, parent_)
 * that could have leaked between teammates in earlier versions.
 */
export function getVerificationState() {
  try {
    const verifiedData = localStorage.getItem(VERIFIED_KEYS_STORAGE);
    const unverifiedData = localStorage.getItem(UNVERIFIED_KEYS_STORAGE);

    let verifiedKeys = verifiedData ? new Set(JSON.parse(verifiedData)) : new Set();
    let unverifiedKeys = unverifiedData ? new Set(JSON.parse(unverifiedData)) : new Set();

    // Sanitize: Purge legacy shared keys that could cause cross-participant collisions
    const isSharedKey = (k) =>
      typeof k === 'string' &&
      (k.startsWith('txn_') || k.startsWith('email_') || k.startsWith('phone_') || k.startsWith('parent_'));

    let changed = false;
    for (const k of verifiedKeys) {
      if (isSharedKey(k)) {
        verifiedKeys.delete(k);
        changed = true;
      }
    }
    for (const k of unverifiedKeys) {
      if (isSharedKey(k)) {
        unverifiedKeys.delete(k);
        changed = true;
      }
    }

    if (changed) {
      saveVerificationState(verifiedKeys, unverifiedKeys);
    }

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
 * Gets candidate keys strictly UNIQUE to the participant.
 * NEVER includes shared attributes (transactionId, email, phone, parentId)
 * to avoid team-member collisions where modifying one resets or un-verifies another.
 */
export function getParticipantKeys(participant) {
  const keys = [];
  if (!participant) return keys;

  // 1. Primary unique ID (e.g. REG-0001, REG-0005, REG-0001-M1)
  if (participant.id) {
    keys.push(String(participant.id).trim());
  }

  // 2. Normalized Name Key (immune to case, extra spaces, dot initials)
  if (participant.name) {
    const normName = cleanNameForStorage(participant.name);
    if (normName.length > 1) {
      keys.push(`name_${normName}`);

      // 3. Name + College Key for high-confidence institutional matching
      if (participant.college) {
        const cleanCollege = String(participant.college).toLowerCase().trim();
        keys.push(`namecol_${normName}_${cleanCollege}`);
      }
    }
  }

  // 4. Row-specific unique key
  const rowIdx = participant.rowIndex || participant.row_index || participant._rowIndex;
  if (rowIdx) {
    if (participant.isSyntheticMember) {
      const normName = cleanNameForStorage(participant.name);
      keys.push(`row_${rowIdx}_m_${normName}`);
    } else {
      keys.push(`row_${rowIdx}`);
    }
  }

  return keys;
}

/**
 * Explicitly sets verification status for a single participant and persists to localStorage.
 * Supports verifying (shouldVerify = true) and un-verifying (shouldVerify = false).
 * Operates with 100% individual granularity without affecting teammates.
 */
export function setParticipantVerification(participant, shouldVerify = true) {
  const { verifiedKeys, unverifiedKeys } = getVerificationState();
  const keys = getParticipantKeys(participant);

  if (shouldVerify) {
    keys.forEach(k => {
      verifiedKeys.add(k);
      unverifiedKeys.delete(k);
    });
  } else {
    keys.forEach(k => {
      verifiedKeys.delete(k);
      unverifiedKeys.add(k);
    });
  }

  saveVerificationState(verifiedKeys, unverifiedKeys);
  return { verifiedKeys, unverifiedKeys };
}

/**
 * Batch verification for multiple participants (e.g. Squad / Team / College verification).
 * Executes atomically in a single write operation.
 */
export function setBatchParticipantsVerification(participants = [], shouldVerify = true) {
  const { verifiedKeys, unverifiedKeys } = getVerificationState();

  participants.forEach(participant => {
    const keys = getParticipantKeys(participant);
    if (shouldVerify) {
      keys.forEach(k => {
        verifiedKeys.add(k);
        unverifiedKeys.delete(k);
      });
    } else {
      keys.forEach(k => {
        verifiedKeys.delete(k);
        unverifiedKeys.add(k);
      });
    }
  });

  saveVerificationState(verifiedKeys, unverifiedKeys);
  return { verifiedKeys, unverifiedKeys };
}

/**
 * Toggles verification status for a participant between verified and unverified
 * and persists changes in localStorage.
 */
export function toggleVerificationStatus(participant) {
  const { verifiedKeys } = getVerificationState();
  const keys = getParticipantKeys(participant);

  // Check if currently verified by participant flag or candidate keys
  const isCurrentlyVerified = participant && participant.isVerified !== undefined
    ? Boolean(participant.isVerified)
    : keys.some(k => verifiedKeys.has(k));

  return setParticipantVerification(participant, !isCurrentlyVerified);
}

/**
 * Explicit verify helper
 */
export function verifySingleParticipant(participant) {
  return setParticipantVerification(participant, true);
}

/**
 * Explicit un-verify helper
 */
export function unverifySingleParticipant(participant) {
  return setParticipantVerification(participant, false);
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


