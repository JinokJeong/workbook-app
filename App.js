import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

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
  const firstDefinition =
    entry.meanings?.[0]?.definitions?.[0]?.definition ?? '';
  return { phonetic, firstDefinition };
}

async function fetchTranslation(text) {
  const url = `${TRANSLATE_API}?q=${encodeURIComponent(text)}&langpair=en|ko`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('번역 실패');
  const data = await res.json();
  return data.responseData?.translatedText ?? '';
}

export default function App() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    const word = query.trim();
    if (!word) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const { phonetic, firstDefinition } = await fetchDictionary(word);
      const meanings = firstDefinition
        ? await fetchTranslation(firstDefinition)
        : '뜻을 불러올 수 없습니다.';
      setResult({ word, phonetic, meanings });
    } catch (e) {
      setError(e.message ?? '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FF" />

      <View style={styles.header}>
        <Text style={styles.logo}>W</Text>
        <Text style={styles.title}>WordBook</Text>
      </View>

      <View style={styles.searchArea}>
        <TextInput
          style={styles.input}
          placeholder="영어 단어를 입력하세요"
          placeholderTextColor="#AAB0C6"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={handleSearch}
        >
          <Text style={styles.buttonText}>검색</Text>
        </Pressable>
      </View>

      <View style={styles.resultArea}>
        {loading && <ActivityIndicator size="large" color="#4F6EF7" />}

        {!loading && result && (
          <View style={styles.card}>
            <Text style={styles.wordText}>{result.word}</Text>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.label}>발음</Text>
              <Text style={styles.phonetic}>{result.phonetic}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>뜻</Text>
              <Text style={styles.meanings}>{result.meanings}</Text>
            </View>
          </View>
        )}

        {!loading && error !== '' && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {!loading && !result && error === '' && (
          <Text style={styles.emptyText}>단어를 검색하면 결과가 여기에 표시됩니다.</Text>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8F9FF',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 36,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#4F6EF7',
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 40,
    marginRight: 10,
    overflow: 'hidden',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A1F36',
    letterSpacing: -0.5,
  },
  searchArea: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 28,
  },
  input: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1A1F36',
    borderWidth: 1.5,
    borderColor: '#E0E4F5',
    shadowColor: '#4F6EF7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  button: {
    height: 52,
    paddingHorizontal: 20,
    borderRadius: 14,
    backgroundColor: '#4F6EF7',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4F6EF7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonPressed: {
    backgroundColor: '#3A56D4',
    transform: [{ scale: 0.97 }],
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  resultArea: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 12,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#1A1F36',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E0E4F5',
  },
  wordText: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1A1F36',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E4F5',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  label: {
    width: 36,
    fontSize: 12,
    fontWeight: '700',
    color: '#4F6EF7',
    backgroundColor: '#EEF1FE',
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 6,
    textAlign: 'center',
    overflow: 'hidden',
  },
  phonetic: {
    flex: 1,
    fontSize: 16,
    color: '#5A6280',
    fontStyle: 'italic',
    paddingTop: 2,
  },
  meanings: {
    flex: 1,
    fontSize: 17,
    color: '#1A1F36',
    fontWeight: '600',
    paddingTop: 2,
  },
  emptyText: {
    marginTop: 40,
    fontSize: 15,
    color: '#AAB0C6',
    textAlign: 'center',
    lineHeight: 22,
  },
  errorBox: {
    marginTop: 24,
    width: '100%',
    backgroundColor: '#FFF0F0',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#FFD0D0',
  },
  errorText: {
    fontSize: 15,
    color: '#D93025',
    textAlign: 'center',
    fontWeight: '600',
  },
});
