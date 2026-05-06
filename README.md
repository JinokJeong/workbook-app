# WordBook

영어 단어를 검색하고 날짜별로 저장·관리하는 React Native 앱입니다.

## 기능

- **단어 검색** — 영어 단어 입력 시 발음 기호와 한글 뜻을 자동으로 조회
- **단어 저장** — 검색 결과를 오늘 날짜에 저장 (중복 방지)
- **날짜별 단어장** — 저장한 단어를 날짜 기준으로 그룹화하여 조회
- **단어 삭제** — 저장된 단어 개별 삭제

## 사용 API

| API | 역할 | 인증 |
|-----|------|------|
| [Free Dictionary API](https://dictionaryapi.dev) | 발음 기호 + 영어 정의 조회 | 불필요 |
| [MyMemory Translation API](https://mymemory.translated.net) | 영어 정의 → 한국어 번역 | 불필요 |

## 기술 스택

- **React Native** 0.81.5
- **Expo** ~54.0.33
- **AsyncStorage** 2.2.0 — 단어 로컬 저장

## 파일 구조

```
WorkBook/
├── App.js                      # 하단 탭 네비게이션 (검색 / 단어장)
├── screens/
│   ├── SearchScreen.js         # 단어 검색 화면
│   └── WordListScreen.js       # 날짜별 단어 목록 화면
├── utils/
│   └── storage.js              # AsyncStorage CRUD
├── assets/
│   ├── icon.png
│   ├── adaptive-icon.png
│   ├── splash-icon.png
│   └── favicon.png
├── app.json                    # Expo 앱 설정
└── package.json
```

## 데이터 구조

단어는 AsyncStorage에 날짜 키(YYYY-MM-DD)로 그룹화되어 저장됩니다.

```json
{
  "2026-05-06": [
    {
      "word": "apple",
      "phonetic": "/ˈæpəl/",
      "meanings": "사과, 능금",
      "savedAt": "2026-05-06T10:30:00.000Z"
    }
  ]
}
```

## 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npx expo start

# iOS 시뮬레이터 (Xcode 필요)
npx expo start --ios

# Android 에뮬레이터 (Android Studio 필요)
npx expo start --android
```

> 실기기 테스트: [Expo Go](https://expo.dev/go) 앱 설치 후 QR 코드 스캔
