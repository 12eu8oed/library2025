# 📚 도서관 찾기 서비스

전국 공공 도서관 위치 및 정보 검색 서비스입니다. 공공데이터포털의 공공도서관 API를 활용하여 제작되었습니다.

## 🌟 주요 기능

- **도서관 검색**: 도서관 이름, 지역(시/도, 시/군/구)으로 검색
- **운영시간 필터**: 평일/주말 운영시간, 휴관일 기준 필터링
- **지도 기반 UI**: Leaflet을 활용한 인터랙티브 지도 인터페이스
- **상세 정보 제공**: 각 도서관의 상세 정보 (장서 수, 좌석 수, 대출 정책 등) 제공
- **다크모드**: 라이트/다크 테마 지원

## 🛠 기술 스택

- **Frontend**: Next.js 13 (App Router), React, TypeScript
- **스타일링**: Tailwind CSS
- **지도**: Leaflet
- **PWA 지원**: next-pwa
- **API**: 공공데이터포털 공공도서관 API

## 🚀 시작하기

1. 프로젝트 클론
\`\`\`bash
git clone [repository-url]
cd short-library
\`\`\`

2. 의존성 설치
\`\`\`bash
npm install
\`\`\`

3. 개발 서버 실행
\`\`\`bash
npm run dev
\`\`\`

## 📱 PWA 지원

- 오프라인 지원
- 홈 화면 추가 가능
- 앱과 유사한 사용자 경험

## 🔍 주요 API 엔드포인트

- \`GET /api/library\`: 도서관 검색 API
  - Query Parameters:
    - \`libraryName\`: 도서관 이름
    - \`sido\`: 시/도
    - \`sigungu\`: 시/군/구
    - \`operTime\`: 평일 운영시간
    - \`satOperTime\`: 토요일 운영시간

## 🎨 UI/UX 특징

- 반응형 디자인
- 직관적인 필터 인터페이스
- 지도 기반 시각화
- 접근성 고려한 디자인