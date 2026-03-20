# 모해? 먹지! (mohemeokji-front)

간단한 한마디: 개인 냉장고 재고를 관리하고, 보유 재료로 레시피를 추천받아 보관·요리 기록까지 할 수 있는 React 기반 프론트엔드.

---

## 주요 기능
- 냉장고 재고 조회 및 수량 변경/삭제
- 재료 추가(카테고리/서브카테고리 선택, 기본 수량 설정)
- AI 기반(백엔드 연동) 레시피 추천 및 레시피 상세 보기
- 레시피를 보관함에 저장 / 요리 완료 시 재고 차감
- 모바일/데스크톱 대응을 고려한 간단한 UI

---

## 기술 스택
- React 19 (Vite + @vitejs/plugin-react)
- Vite (번들러)
- Axios (HTTP 클라이언트)
- ESLint (코드 스타일)
- Vanilla CSS (컴포넌트 인라인 스타일 + CSS 파일)

프로젝트의 package.json 스크립트
- `npm run dev` — 개발 서버 실행 (Vite)
- `npm run build` — 빌드
- `npm run preview` — 빌드된 결과 미리보기
- `npm run lint` — ESLint 검사

---

## 프로젝트 구조 (주요 파일/폴더)
- index.html — 앱 진입 HTML
- vite.config.js — Vite 설정
- src/
  - main.jsx — React 렌더 진입점
  - App.jsx — 라우터(홈, 내 냉장고, 재료 추가, 레시피 추천 등)
  - App.css, index.css — 전역 스타일
  - pages/
    - Home.jsx — 시작 화면(냉장고 열기 / 레시피 추천 링크)
    - Inventory.jsx — 냉장고(재고) 화면: 조회, 수량 조절, 삭제
    - AddIngredient.jsx — 재료 추가 화면: 분류별 재료 선택, 수량 설정, 일괄 저장
    - Recipe.jsx — 추천 레시피 목록 및 상세 모달: 재료 체크, 조리 가이드, 레시피 저장, 요리 완료(재고 차감)
    - SavedRecipes.jsx — (보관함 관련 파일이 존재함)
  - assets/ — (이미지/아이콘 등, 현재 비어있음)
- public/ — 정적 자원 폴더
- .gitignore, eslint.config.js 등

---

## 백엔드 API (프론트엔드에서 호출하는 엔드포인트)
현재 코드에는 다음과 같이 하드코딩된 엔드포인트를 사용합니다(로컬 호스트 기준).
- GET /api/ingredients/{userId}  
  예: `GET http://localhost:8080/api/ingredients/2` — 냉장고 재고 조회
- PATCH /api/ingredients/{id}/quantity?quantity={newQty}  
  예: `PATCH http://localhost:8080/api/ingredients/12/quantity?quantity=200` — 수량 수정
- DELETE /api/ingredients/{id}  
  예: `DELETE http://localhost:8080/api/ingredients/12` — 재료 삭제
- POST /api/ingredients/{userId}  
  예: `POST http://localhost:8080/api/ingredients/2` — 재료 추가 (AddIngredient에서 다수 POST 병렬 호출)
- GET /api/recipes/recommend/{userId}  
  예: `GET http://localhost:8080/api/recipes/recommend/2` — AI 추천 레시피 목록
- POST /api/recipes/save/{userId}  
  예: `POST http://localhost:8080/api/recipes/save/2` — 레시피 보관
- POST /api/recipes/cook/{userId}?servings={n}  
  예: `POST http://localhost:8080/api/recipes/cook/2?servings=2` — 요리 완료(재고 차감)

중요: 소스 코드 여러 곳에서 userId가 `2`로 하드코딩되어 있습니다 (Inventory.jsx, AddIngredient.jsx, Recipe.jsx 등). 또한 API 기본 URL(`http://localhost:8080`)이 코드에 직접 쓰여 있으므로 배포/환경 설정 시 수정이 필요합니다.

---

## 실행 방법 (로컬 개발)
1. 저장소 클론
   - git clone <repo-url>
2. 의존성 설치
   - npm install
3. 개발 서버 시작
   - npm run dev
   - 브라우저에서 기본적으로 Vite가 제공하는 주소(예: http://localhost:5173)로 접속

빌드
- npm run build
- npm run preview (빌드 결과 확인)

---

## 환경 및 배포 주의사항
- 백엔드(API)는 로컬의 `http://localhost:8080`으로 가정되어 있습니다. 실제 배포 시에는 API 베이스 URL을 환경 변수로 분리하세요 (예: `VITE_API_BASE`).
- CORS: 프론트엔드가 다른 도메인의 백엔드에 접속하려면 백엔드에서 CORS를 허용해야 합니다.
- userId: 현재 하드코딩돼 있으므로, 인증/사용자 관리 기능을 연결할 경우 코드 변경 필요.
- 입력/응답 유효성 검증이 최소 수준이므로, 실제 서비스화 전에는 에러 처리 보완 필요.

---

## 개선/확장 아이디어 (TODO)
- 환경변수 적용: axios 인스턴스 생성 및 BASE_URL 적용
- 인증(로그인) 추가 — userId 하드코딩 제거
- 공통 컴포넌트화 및 스타일링 리팩토링 (Tailwind/Styled-components 등 도입)
- Recipe 추천 로직/AI 연동 상세 구현 및 캐싱
- 테스트 추가 (Jest / React Testing Library)
- 국제화(i18n) 적용 (현재 UI 텍스트는 한국어)

---

## 참고
- 이 프론트엔드는 로컬 백엔드(API)를 전제로 동작합니다. 백엔드가 준비되어 있지 않다면 일부 기능(재고 로드, 추천 레시피)은 동작하지 않습니다.
- ESLint 설정 파일이 포함되어 있으니 코딩 스타일을 맞추려면 `npm run lint`를 사용하세요.

---

만약 README에 추가하고 싶은 항목(예: 데모 스크린샷, 기여 가이드, 라이선스 표기 등)이 있으면 알려주시면 그에 맞춰 README를 확장해 드리겠습니다.
