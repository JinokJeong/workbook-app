import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { lookupWord } from '../utils/dictionary';
import { saveWord } from '../utils/storage';

const DEFAULT_URL = 'https://www.bbc.com/news';

// 웹페이지에 주입되는 JS:
// 단어 선택(셀렉션) 감지 → 영어 단어일 때만 RN으로 전달
const INJECTED_JS = `
(function() {
  var timer = null;
  var lastWord = '';
  document.addEventListener('selectionchange', function() {
    clearTimeout(timer);
    timer = setTimeout(function() {
      var sel = window.getSelection();
      var text = sel ? sel.toString().trim() : '';
      if (text && /^[a-zA-Z][a-zA-Z'-]*$/.test(text) && text !== lastWord) {
        lastWord = text;
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'word', word: text }));
      }
      if (!text) { lastWord = ''; }
    }, 350);
  });
})();
true;
`;

export default function BrowserScreen() {
  const webviewRef = useRef(null);
  const [url, setUrl] = useState(DEFAULT_URL);
  const [inputUrl, setInputUrl] = useState(DEFAULT_URL);
  const [webLoading, setWebLoading] = useState(true);
  const [card, setCard] = useState(null);
  const [cardLoading, setCardLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const navigate = () => {
    let target = inputUrl.trim();
    if (!target.startsWith('http')) target = 'https://' + target;
    setUrl(target);
    setInputUrl(target);
  };

  const handleMessage = async (event) => {
    let data;
    try { data = JSON.parse(event.nativeEvent.data); } catch { return; }
    if (data.type !== 'word' || !data.word) return;

    dismissCard();
    setCardLoading(true);
    try {
      const result = await lookupWord(data.word);
      setCard(result);
    } catch {
      // 사전에 없는 단어는 조용히 무시
    } finally {
      setCardLoading(false);
    }
  };

  const dismissCard = () => {
    setCard(null);
    setCardLoading(false);
    setSaved(false);
  };

  const handleSave = async () => {
    if (!card || saved) return;
    await saveWord(card);
    setSaved(true);
  };

  return (
    <View style={styles.root}>
      {/* URL 바 */}
      <View style={styles.urlBar}>
        <TextInput
          style={styles.urlInput}
          value={inputUrl}
          onChangeText={setInputUrl}
          onSubmitEditing={navigate}
          returnKeyType="go"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          selectTextOnFocus
        />
        <Pressable
          style={({ pressed }) => [styles.goBtn, pressed && styles.goBtnPressed]}
          onPress={navigate}
        >
          <Text style={styles.goBtnText}>이동</Text>
        </Pressable>
      </View>

      {/* 웹뷰 */}
      <View style={styles.webContainer}>
        <WebView
          ref={webviewRef}
          source={{ uri: url }}
          injectedJavaScript={INJECTED_JS}
          onMessage={handleMessage}
          onLoadStart={() => setWebLoading(true)}
          onLoadEnd={() => setWebLoading(false)}
          javaScriptEnabled
        />
        {webLoading && (
          <View style={styles.webLoader}>
            <ActivityIndicator color="#4F6EF7" />
          </View>
        )}
      </View>

      {/* 단어 카드 바텀시트 */}
      <Modal
        visible={cardLoading || card !== null}
        transparent
        animationType="slide"
        onRequestClose={dismissCard}
      >
        <Pressable style={styles.overlay} onPress={dismissCard}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <View style={styles.sheetHandle} />

            {cardLoading && (
              <View style={styles.loadingArea}>
                <ActivityIndicator color="#4F6EF7" size="large" />
                <Text style={styles.loadingText}>검색 중...</Text>
              </View>
            )}

            {card && (
              <>
                <View style={styles.cardTop}>
                  <Text style={styles.cardWord}>{card.word}</Text>
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
                  <Text style={styles.phonetic}>{card.phonetic || '-'}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>뜻</Text>
                  <Text style={styles.meanings}>{card.meanings}</Text>
                </View>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  urlBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 56 : 44,
    paddingBottom: 10,
    gap: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E4F5',
  },
  urlInput: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F0F2FB',
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#1A1F36',
  },
  goBtn: {
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#4F6EF7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  goBtnPressed: {
    backgroundColor: '#3A56D4',
  },
  goBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  webContainer: {
    flex: 1,
    position: 'relative',
  },
  webLoader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FF',
  },
  // 모달
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    paddingTop: 12,
    minHeight: 180,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E4F5',
    alignSelf: 'center',
    marginBottom: 20,
  },
  loadingArea: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#AAB0C6',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardWord: {
    fontSize: 28,
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
    fontSize: 15,
    color: '#5A6280',
    fontStyle: 'italic',
    paddingTop: 2,
  },
  meanings: {
    flex: 1,
    fontSize: 16,
    color: '#1A1F36',
    fontWeight: '600',
    paddingTop: 2,
    lineHeight: 22,
  },
});
