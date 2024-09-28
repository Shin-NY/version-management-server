# Version management server

## 서버 실행 방법
1. node 설치
2. 프로젝트 폴더에서 `npm install` 명령어 실행 (node_modules 폴더 생성돼야 함)
3. 프로젝트 폴더에 .env 파일 생성 후 아래 내용 파일에 작성
```env
JWT_KEY="임의 문자열"
```
4. `npm run start:dev` 명령어로 서버 실행 (http://localhost:3000/)

## 서버 api 구조
* /admin - 어드민 로그인 페이지
  * /admin/modules - 어드민 모듈 업로드 페이지
  * /admin/messages - 어드민 메세지 업로드 페이지

* /modules - 업로드된 모듈 정보를 json으로 받는 api
* /messages - 업로드된 메세지 정보를 json으로 받는 api
