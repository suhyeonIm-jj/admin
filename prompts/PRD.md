# Personal Admin Hub - PRD

## 개요
개인 링크 관리 대시보드. 업무용(Work)과 개인용(Personal) 링크를 분리하여 관리하고, 자주 사용하는 링크를 빠르게 접근할 수 있도록 함.

## 환경
- 로컬 실행 전용 (localhost)
- `npm run dev` 한 줄로 실행 가능
- 별도 DB 설치 불필요, `/data/*.json` 파일로 데이터 관리

## 기술 스택
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Drag & Drop**: @dnd-kit
- **Data Storage**: JSON 파일 (서버사이드)

## 핵심 기능

### 1. 링크 관리
- 링크 추가/수정/삭제
- 제목, URL, 설명, 메모, 태그, 카테고리 지정
- 파비콘 자동 수집

### 2. 핀 & 즐겨찾기
- 핀 고정: 상단에 항상 표시
- 즐겨찾기: 자주 사용하는 링크 모음

### 3. 카테고리 & 태그
- Work/Personal 별 카테고리 분류
- 태그 필터링

### 4. 검색 & 필터
- 실시간 검색 (제목, URL, 설명)
- 태그 기반 필터링

### 5. 정렬 기능
- 드래그 앤 드롭으로 순서 변경
- 사용 빈도순 정렬

### 6. 메모 미리보기
- 카드 hover 시 메모 툴팁 표시

## 데이터 스키마

### Link
```typescript
interface Link {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  description?: string;
  memo?: string;
  tags: string[];
  category: string;
  isPinned: boolean;
  isFavorite: boolean;
  usageCount: number;
  order: number;
  createdAt: string;
  updatedAt: string;
}
```

### Category
```typescript
interface Category {
  id: string;
  name: string;
  type: "work" | "personal";
  order: number;
  color?: string;
}
```

### Tag
```typescript
interface Tag {
  id: string;
  name: string;
  color?: string;
}
```

## 페이지 구조

### / (Home)
- 간단한 환영 메시지
- Work/Personal 바로가기

### /work
- 핀 고정 링크 섹션
- 자주 사용 링크 섹션 (usageCount 기준)
- 카테고리별 링크 목록

### /personal
- 즐겨찾기 섹션
- 카테고리별 북마크 목록

## 구현 순서

1. **프로젝트 초기 세팅**: Next.js, Tailwind, 필요 패키지 설치
2. **데이터 레이어**: 스키마 정의, JSON 초기값, API Route
3. **공통 컴포넌트**: 링크 카드, 카테고리 섹션, 검색창, 태그 필터
4. **/work 페이지**: 핀, 자주사용, 카테고리별 목록
5. **/personal 페이지**: 즐겨찾기, 북마크 목록
6. **고급 기능**: 드래그앤드롭, 파비콘 수집, 메모 미리보기
