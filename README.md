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
* 어드민 페이지
  * /admin - 어드민 로그인 페이지
  * /admin/modules - 모듈 목록 & 모듈 업로드 페이지
  * /admin/modules/detail?module_id={id} - 모듈 상세 페이지 (버전 목록)
  * /admin/messages - 메세지 목록 & 메세지 업로드 페이지

* api 목록
  * POST /create-account - 계정 생성 api
  * POST /login - 로그인 api
  * 
  * GET /modules - 모듈 목록을 json으로 받는 api
  * POST /modules - 새로운 모듈을 생성하는 api
  * 
  * GET /modules/{module_id}/versions - 모듈의 버전 목록을 json으로 받는 api
  * POST /modules/{module_id}/versions - 모듈에 새로운 버전을 생성하는 api
  * 
  * GET /modules/versions/{version_id} - 해당 id의 버전을 다운로드 받는 api
  * 
  * GET /messages - 업로드된 메세지 정보를 json으로 받는 api
  * POST /messages - 새로운 메세지를 생성하는 api
