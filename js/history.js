/* ========================================
   history.js — IndexedDB + localStorage fallback
   ======================================== */

const DB_NAME = 'tarot-db', DB_VERSION = 1;

function openDB() {
  return new Promise((resolve, reject) => {
    const r = indexedDB.open(DB_NAME, DB_VERSION);
    r.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('readings')) {
        const s = db.createObjectStore('readings', { keyPath: 'id' });
        s.createIndex('timestamp', 'timestamp', { unique: false });
      }
      if (!db.objectStoreNames.contains('settings')) db.createObjectStore('settings', { keyPath: 'key' });
    };
    r.onsuccess = (e) => resolve(e.target.result);
    r.onerror = (e) => reject(e.target.error);
  });
}

function generateId() { return Date.now().toString(36) + Math.random().toString(36).substring(2, 8); }

async function saveReadingRecord(record) {
  const data = { id: generateId(), ...record };
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('readings', 'readwrite');
      tx.objectStore('readings').add(data);
      tx.oncomplete = () => resolve(data.id);
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    const records = JSON.parse(localStorage.getItem('tarot-history') || '[]');
    records.push(data); localStorage.setItem('tarot-history', JSON.stringify(records));
    return data.id;
  }
}

async function getHistoryRecords() {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('readings', 'readonly');
      const r = tx.objectStore('readings').index('timestamp').getAll();
      r.onsuccess = () => resolve(r.result || []);
      r.onerror = () => reject(r.error);
    });
  } catch { return JSON.parse(localStorage.getItem('tarot-history') || '[]'); }
}

async function getHistoryRecord(id) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const r = db.transaction('readings','readonly').objectStore('readings').get(id);
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    });
  } catch { return (JSON.parse(localStorage.getItem('tarot-history')||'[]')).find(r=>r.id===id)||null; }
}

async function getSetting(key) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const r = db.transaction('settings','readonly').objectStore('settings').get(key);
      r.onsuccess = () => resolve(r.result?.value);
      r.onerror = () => reject(r.error);
    });
  } catch { return localStorage.getItem(`tarot-setting-${key}`); }
}

async function setSetting(key, value) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('settings','readwrite');
      tx.objectStore('settings').put({ key, value });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch { localStorage.setItem(`tarot-setting-${key}`, value); }
}
