# Version management server

## 서버 실행 방법
1. node 설치
2. 프로젝트 폴더에서 `npm install` 명령어 실행 (node_modules 폴더 생성돼야 함)
3. 프로젝트 폴더에 .env 파일 생성 후 아래 내용 파일에 작성
```env
JWT_KEY="임의 문자열"
```
4. `npm run start:dev` 명령어로 서버 실행 (http://localhost:3000/)
5. 서버 실행 후에 아래 명령어로 계정을 만들어야 로그인 가능 (아이디: admin, 비밀번호: admin)
> 리눅스 기준
```
curl -d '{"username":"admin", "password":"admin"}' \
-H "Content-Type: application/json" \
-X POST http://localhost:3000/create-account
```

## 서버 api 구조
* /admin - 어드민 로그인 페이지
  * /admin/modules - 어드민 모듈 업로드 페이지
  * /admin/messages - 어드민 메세지 업로드 페이지

* /create-account - 계정 생성 api
* /login - 로그인 api

* /modules - 업로드된 모듈 정보를 json으로 받는 api
* /modules/:id - 해당 id의 모듈을 다운로드 받는 api
* /messages - 업로드된 메세지 정보를 json으로 받는 api
