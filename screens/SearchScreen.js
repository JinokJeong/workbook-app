import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { lookupWord } from '../utils/dictionary';
import { saveWord } from '../utils/storage';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSearch = async () => {
    const word = query.trim();
    if (!word) return;
    setLoading(true);
    setError('');
    setResult(null);
    setSaved(false);
    try {
      const entry = await lookupWord(word);
      setResult(entry);
    } catch (e) {
      setError(e.message ?? '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!result || saved) return;
    await saveWord(result);
    setSaved(true);
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <View style={styles.logoBox}>
          <Text style={styles.logoText}>W</Text>
        </View>
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
            <View style={styles.cardTop}>
              <Text style={styles.wordText}>{result.word}</Text>
              <Pressable
                style={[styles.saveBtn, saved && styles.saveBtnActive]}
                onPress={handleSave}
              >
                <Text style={[styles.saveBtnText, saved && styles.saveBtnTextActive]}>
                  {saved ? '저장됨' : '저장'}
                </Text>
              </Pressable>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.label}>발음</Text>
              <Text style={styles.phonetic}>{result.phonetic || '-'}</Text>
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
  logoBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#4F6EF7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  logoText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
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
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  wordText: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1A1F36',
    letterSpacing: -0.5,
  },
  saveBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#4F6EF7',
  },
  saveBtnActive: {
    backgroundColor: '#4F6EF7',
    borderColor: '#4F6EF7',
  },
  saveBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4F6EF7',
  },
  saveBtnTextActive: {
    color: '#fff',
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
  emptyText: {
    marginTop: 40,
    fontSize: 15,
    color: '#AAB0C6',
    textAlign: 'center',
    lineHeight: 22,
  },
});
