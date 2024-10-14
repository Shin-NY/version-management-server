# Version management server

## 서버 실행 방법

1. node 설치
2. 프로젝트 폴더에서 `npm install` 명령어 실행 (node_modules 폴더 생성돼야 함)
3. 프로젝트 폴더에 .env 파일 생성 후 아래 내용 파일에 작성

```env
JWT_KEY="임의 문자열"
```

4. `npm run start:dev` 명령어로 서버 실행 (http://localhost:3000/admin)

## 어드민 페이지

- /admin - 어드민 계정으로 로그인하는 페이지
- /admin/create-account - 어드민 계정을 생성하는 페이지 (1개까지만 생성됨)
- /admin/agent-version - 에이전트의 현재 버전을 확인하는 페이지
- /admin/agent-update - 새로운 버전을 업로드하는 페이지
- /admin/messages - 메세지 관리하는 페이지 (임시)

## api 목록

/swagger 에서 확인할 수 있습니다.
