# Version management server

## 서버 실행 방법
1. node 설치
2. 프로젝트 폴더에서 `npm install` 명령어 실행 (node_modules 폴더 생성돼야 함)
3. 프로젝트 폴더에 .env 파일 생성 후 아래 내용 파일에 작성
```env
JWT_KEY="임의 문자열"
```
4. `npm run start:dev` 명령어로 서버 실행 (http://localhost:3000/admin)

## 서버 api 구조
* 어드민 페이지
  * /admin - 어드민 로그인 페이지
  * /admin/create-account - 어드민 계정 생성 페이지 (1개까지만 생성됨)
  * /admin/agent-version - 에이전트의 현재 버전 확인 & 새로운 버전 업로드 페이지

* api 목록
  * POST /create-account - 계정 생성 api
  * POST /login - 로그인 api
  * 
  * POST /agent-versions - 새로운 에이전트 버전을 생성하는 api
  * GET /agent-versions/lts - 최신 에이전트 버전의 정보를 가져오는 api (업데이트 여부 체크할 때 사용)
  * GET /agent-versions/lts/download - 최신 에이전트 버전을 다운로드 받는 api (zip 파일로 전송됨)
