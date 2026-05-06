# WordBook

영어 웹페이지를 보다가 모르는 단어를 터치하면 발음과 한글 뜻을 바로 확인하고 저장할 수 있는 React Native 앱입니다.

## 주요 기능

| 탭 | 기능 |
|----|------|
| 검색 | 영어 단어 직접 입력 → 발음 기호 + 한글 뜻 조회 |
| 브라우저 | 인앱 웹브라우저에서 단어 선택 시 카드 자동 표시 |
| 단어장 | 저장한 단어를 날짜별로 조회 및 삭제 |

- 검색 결과 및 브라우저 카드에서 **"저장" 버튼**으로 단어장에 추가
- 중복 저장 방지, 개별 삭제 지원

## 브라우저 단어 인식

웹페이지에서 단어를 롱프레스(선택)하면 바텀시트 카드가 자동으로 올라옵니다.

```
단어 선택 (롱프레스)
  → JS injection이 selectionchange 감지
  → 영어 단어 여부 확인 후 사전 API 호출
  → 발음 + 한글 뜻 카드 표시
  → 저장 버튼으로 단어장에 추가
```

인식 조건: 영문자(`a-z`), 하이픈(`-`), 어퍼스트로피(`'`)로만 이루어진 단어  
(숫자·특수문자·한글은 무시)

## 사용 API

| API | 역할 | 인증 |
|-----|------|------|
| [Free Dictionary API](https://dictionaryapi.dev) | 발음 기호 + 영어 정의 | 불필요 |
| [MyMemory Translation API](https://mymemory.translated.net) | 영어 정의 → 한국어 번역 | 불필요 |

## 기술 스택

- **React Native** 0.81.5
- **Expo** ~54.0.33
- **react-native-webview** — 인앱 브라우저
- **AsyncStorage** 2.2.0 — 단어 로컬 저장

## 파일 구조

```
WorkBook/
├── App.js                      # 하단 탭 네비게이션 (검색 / 브라우저 / 단어장)
├── screens/
│   ├── SearchScreen.js         # 단어 직접 검색 화면
│   ├── BrowserScreen.js        # 인앱 웹브라우저 + 단어 카드
│   └── WordListScreen.js       # 날짜별 단어 목록 화면
├── utils/
│   ├── dictionary.js           # Free Dictionary API + MyMemory 번역
│   └── storage.js              # AsyncStorage CRUD
├── assets/
├── app.json
└── package.json
```

## 데이터 구조

```json
{
  "2026-05-06": [
    {
      "word": "resilience",
      "phonetic": "/rɪˈzɪliəns/",
      "meanings": "회복력, 탄성",
      "savedAt": "2026-05-06T10:30:00.000Z"
    }
  ]
}
```

## 실행 방법

```bash
npm install
npx expo start
```

| 방법 | 명령 | 요구사항 |
|------|------|---------|
| Expo Go (실기기) | QR 코드 스캔 | [Expo Go](https://expo.dev/go) 앱 |
| iOS 시뮬레이터 | `npx expo start --ios` | Xcode |
| Android 에뮬레이터 | `npx expo start --android` | Android Studio |
