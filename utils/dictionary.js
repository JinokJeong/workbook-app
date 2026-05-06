const DICT_API = 'https://api.dictionaryapi.dev/api/v2/entries/en';
const TRANSLATE_API = 'https://api.mymemory.translated.net/get';

async function fetchDictionary(word) {
  const res = await fetch(`${DICT_API}/${encodeURIComponent(word)}`);
  if (!res.ok) throw new Error('단어를 찾을 수 없습니다.');
  const data = await res.json();
  const entry = data[0];
  const phonetic =
    entry.phonetic ??
    entry.phonetics?.find((p) => p.text)?.text ??
    '';
  const firstDefinition = entry.meanings?.[0]?.definitions?.[0]?.definition ?? '';
  return { phonetic, firstDefinition };
}

async function fetchTranslation(text) {
  const url = `${TRANSLATE_API}?q=${encodeURIComponent(text)}&langpair=en|ko`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('번역 실패');
  const data = await res.json();
  return data.responseData?.translatedText ?? '';
}

export async function lookupWord(word) {
  const { phonetic, firstDefinition } = await fetchDictionary(word);
  const meanings = firstDefinition
    ? await fetchTranslation(firstDefinition)
    : '뜻을 불러올 수 없습니다.';
  return { word, phonetic, meanings };
}
