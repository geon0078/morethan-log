# AN-log 설정 체크리스트

## 완료된 설정

- [x] 블로그 제목: `AN-log`
- [x] 프로필 이름: `Argon`
- [x] 직군: `연구-개발자`
- [x] 소개: `작은 배움과 연구 과정을 남기는 기록장`
- [x] 이메일: `geon111150@gmail.com`
- [x] GitHub: `geon0078`
- [x] 작성자 이름 노출 방지 (person 타입 → site.config 이름으로 고정)

---

## 남은 설정 (`site.config.js`)

### 필수

| 항목 | 현재 값 | 할 일 |
|------|---------|-------|
| `profile.linkedin` | `"morethanmin"` | 본인 LinkedIn ID로 변경, 없으면 `""` |
| `profile.instagram` | `""` | 사용한다면 사용자명 입력 |
| `projects[0].name` | `"morethan-log"` | 본인 프로젝트 이름으로 변경 또는 배열 비우기 |
| `projects[0].href` | `"https://github.com/morethanmin/morethan-log"` | 본인 프로젝트 링크로 변경 |
| `link` | `"https://morethan-log.vercel.app"` | 실제 배포 URL로 변경 |
| `lang` | `"en-US"` | 한국어 블로그면 `"ko-KR"` 로 변경 |

### 선택

| 항목 | 현재 값 | 할 일 |
|------|---------|-------|
| `blog.theme` | `"auto"` | `"light"` / `"dark"` / `"auto"` 중 선택 |
| `seo.keywords` | `["Blog", "Website", "Notion"]` | 블로그 주제에 맞는 키워드로 변경 |

---

## 댓글 설정 (`utterances`)

현재 `enable: true` 상태이나 저장소가 원본 그대로입니다.

- **사용할 경우**: `utterances.config.repo` 를 `"geon0078/저장소명"` 으로 변경
- **사용 안 할 경우**: `enable: false` 로 변경

---

## 환경변수 (`.env.local` 또는 Vercel 환경변수)

| 변수명 | 설명 | 필수 여부 |
|--------|------|-----------|
| `NOTION_PAGE_ID` | Notion 데이터베이스 페이지 ID | 필수 |
| `NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID` | Google Analytics ID | Google Analytics 사용 시 |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Search Console 인증 코드 | Search Console 사용 시 |

### Notion 페이지 ID 확인 방법
1. Notion에서 블로그로 사용할 데이터베이스 페이지 열기
2. 브라우저 주소창에서 URL 확인: `https://notion.so/[페이지ID]?v=...`
3. `?v=` 앞의 32자리 문자열이 페이지 ID

---

## 배포 (Vercel)

1. GitHub에 이 저장소 push
2. [vercel.com](https://vercel.com) 에서 저장소 연결
3. 환경변수 `NOTION_PAGE_ID` 추가
4. 배포 후 `link` 값을 실제 Vercel URL로 업데이트
