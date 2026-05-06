import { useEffect, useState } from 'react';
import {
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { deleteWord, loadAll } from '../utils/storage';

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatDateHeader(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const dow = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
  const prefix = dateStr === todayKey() ? '오늘 · ' : '';
  return `${prefix}${y}년 ${m}월 ${d}일 (${dow})`;
}

export default function WordListScreen({ refreshSignal }) {
  const [sections, setSections] = useState([]);

  const reload = async () => {
    const data = await loadAll();
    const sorted = Object.keys(data)
      .sort((a, b) => b.localeCompare(a))
      .map((date) => ({ title: date, data: data[date] }));
    setSections(sorted);
  };

  useEffect(() => {
    reload();
  }, [refreshSignal]);

  const handleDelete = async (date, word) => {
    await deleteWord(date, word);
    reload();
  };

  const renderSectionHeader = ({ section }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{formatDateHeader(section.title)}</Text>
      <Text style={styles.sectionCount}>{section.data.length}개</Text>
    </View>
  );

  const renderItem = ({ item, section }) => (
    <View style={styles.item}>
      <View style={styles.itemBody}>
        <Text style={styles.itemWord}>{item.word}</Text>
        {item.phonetic ? (
          <Text style={styles.itemPhonetic}>{item.phonetic}</Text>
        ) : null}
        <Text style={styles.itemMeanings}>{item.meanings}</Text>
      </View>
      <Pressable
        style={styles.deleteBtn}
        onPress={() => handleDelete(section.title, item.word)}
        hitSlop={8}
      >
        <Text style={styles.deleteBtnText}>삭제</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>단어장</Text>
      </View>

      {sections.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>
            저장된 단어가 없습니다.{'\n'}검색 후 단어를 저장해보세요.
          </Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.word + item.savedAt}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          stickySectionHeadersEnabled
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#F8F9FF',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A1F36',
    letterSpacing: -0.5,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FF',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E4F5',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4F6EF7',
  },
  sectionCount: {
    fontSize: 12,
    color: '#AAB0C6',
    fontWeight: '600',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#E0E4F5',
    shadowColor: '#1A1F36',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  itemBody: {
    flex: 1,
    marginRight: 12,
  },
  itemWord: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1F36',
    marginBottom: 2,
  },
  itemPhonetic: {
    fontSize: 13,
    color: '#5A6280',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  itemMeanings: {
    fontSize: 14,
    color: '#5A6280',
    lineHeight: 20,
  },
  deleteBtn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#FFF0F0',
  },
  deleteBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#D93025',
  },
  emptyWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 60,
  },
  emptyText: {
    fontSize: 15,
    color: '#AAB0C6',
    textAlign: 'center',
    lineHeight: 24,
  },
});
