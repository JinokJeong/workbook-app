import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'wordbook_data';

function todayKey() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export async function loadAll() {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : {};
}

export async function saveWord(entry) {
  const date = todayKey();
  const data = await loadAll();
  if (!data[date]) data[date] = [];
  const dup = data[date].some((e) => e.word.toLowerCase() === entry.word.toLowerCase());
  if (!dup) {
    data[date].unshift({ ...entry, savedAt: new Date().toISOString() });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
  return !dup;
}

export async function deleteWord(date, word) {
  const data = await loadAll();
  if (!data[date]) return;
  data[date] = data[date].filter((e) => e.word !== word);
  if (data[date].length === 0) delete data[date];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
