# Personal Admin Hub - Implementation Guide

## Quick Start

```bash
npm run dev
```
→ http://localhost:3000

## Project Structure

```
admin/
├── data/                    # JSON 데이터 저장소
│   ├── links.json
│   ├── categories.json
│   └── tags.json
├── prompts/                 # 프로젝트 문서
│   ├── PRD.md
│   └── IMPLEMENTATION.md
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── links/       # 링크 CRUD API
│   │   │   ├── categories/  # 카테고리 CRUD API
│   │   │   ├── tags/        # 태그 CRUD API
│   │   │   └── favicon/     # 파비콘 수집 API
│   │   ├── work/            # 업무용 링크 페이지
│   │   ├── personal/        # 개인용 링크 페이지
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── Navigation.tsx       # 상단 네비게이션
│   │   ├── LinkCard.tsx         # 링크 카드 (메모 툴팁 포함)
│   │   ├── LinkModal.tsx        # 링크 추가/수정 모달
│   │   ├── CategorySection.tsx  # 카테고리 섹션
│   │   ├── SearchBar.tsx        # 검색창
│   │   ├── TagFilter.tsx        # 태그 필터
│   │   ├── SortableSection.tsx  # 드래그앤드롭 섹션
│   │   └── SortableLinkCard.tsx # 드래그 가능 링크 카드
│   ├── lib/
│   │   └── data.ts          # 데이터 관리 유틸리티
│   └── types/
│       └── index.ts         # TypeScript 타입 정의
└── package.json
```

## Features

### 1. Link Management
- **Add/Edit/Delete**: 링크 CRUD
- **Pin**: 상단 고정 (Work 페이지)
- **Favorite**: 즐겨찾기 (Personal 페이지)
- **Usage Count**: 클릭 시 자동 증가

### 2. Drag & Drop
- Pinned/Favorites 섹션에서 드래그로 순서 변경
- @dnd-kit 라이브러리 사용

### 3. Favicon Auto-Fetch
- URL 입력 시 자동으로 파비콘 수집
- Google Favicon Service 사용

### 4. Memo Preview
- 카드 hover 시 메모 툴팁 표시

### 5. Search & Filter
- 실시간 검색 (제목, URL, 설명)
- 태그 필터링 (다중 선택)

### 6. Category Organization
- Work: Development, Productivity, Communication, Design
- Personal: Entertainment, Shopping

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/links` | GET | 링크 목록 조회 (?type=work/personal) |
| `/api/links` | POST | 링크 생성 / 순서 변경 |
| `/api/links/[id]` | GET | 개별 링크 조회 |
| `/api/links/[id]` | PATCH | 링크 수정 / 사용량 증가 |
| `/api/links/[id]` | DELETE | 링크 삭제 |
| `/api/categories` | GET | 카테고리 목록 |
| `/api/categories` | POST | 카테고리 생성 |
| `/api/tags` | GET | 태그 목록 |
| `/api/tags` | POST | 태그 생성 |
| `/api/favicon` | GET | 파비콘 URL 조회 |

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Drag & Drop**: @dnd-kit/core, @dnd-kit/sortable
- **Data**: JSON files (no database required)

## Data Schema

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
