import { useState } from 'react';
import {
  Platform,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import SearchScreen from './screens/SearchScreen';
import WordListScreen from './screens/WordListScreen';

export default function App() {
  const [tab, setTab] = useState('search');
  const [refreshSignal, setRefreshSignal] = useState(0);

  const switchTab = (next) => {
    if (next === 'list') setRefreshSignal((s) => s + 1);
    setTab(next);
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FF" />

      <View style={styles.screen}>
        {tab === 'search' ? (
          <SearchScreen />
        ) : (
          <WordListScreen refreshSignal={refreshSignal} />
        )}
      </View>

      <View style={styles.tabBar}>
        <TabItem label="검색" active={tab === 'search'} onPress={() => switchTab('search')} />
        <TabItem label="단어장" active={tab === 'list'} onPress={() => switchTab('list')} />
      </View>
    </View>
  );
}

function TabItem({ label, active, onPress }) {
  return (
    <Pressable style={styles.tabItem} onPress={onPress}>
      <View style={[styles.tabIndicator, active && styles.tabIndicatorActive]} />
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  screen: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E0E4F5',
    backgroundColor: '#fff',
    paddingBottom: Platform.OS === 'ios' ? 28 : 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 4,
    gap: 4,
  },
  tabIndicator: {
    width: 20,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'transparent',
    marginBottom: 2,
  },
  tabIndicatorActive: {
    backgroundColor: '#4F6EF7',
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#AAB0C6',
  },
  tabLabelActive: {
    color: '#4F6EF7',
  },
});
