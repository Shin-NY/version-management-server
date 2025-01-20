# 자동 업데이트 및 오류 복구 시스템 서버
관리자가 클라이언트에게 메시지를 보내며, 프로그램이 자동 업데이트를 수행하고, 오류 발생 시 복구 하는 시스템

아래 링크에 있는 에이전트 코드와 통신
<br>[자동 업데이트 및 오류 복구 시스템 에이전트 코드](https://github.com/Hyodonjoo/agent-file-architecture.git)

## 개발 기간
- 2024.10 ~ 2024.12

## 역할
| 이름 | 담당 역할 및 기능 |
| ------ |  ------ |
| 주효돈 | PM, 관리자 웹페이지, 메세지 관리 모듈 구현 |
| 노유신 | 서버 구축, 관리자 계정, 업데이트 업로드 API 구현 |
| 박용수 | 에이전트 버젼 관리, 통신 프로토콜 구현 |

## 기술 스택
<img src="https://img.shields.io/badge/css-663399E?style=for-the-badge&logo=css"/> <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"/>
<img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
<img src="https://img.shields.io/badge/JAVA-FE5F50"/>
<img src="https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs"/>
<img src="https://img.shields.io/badge/nodejs-5FA04E?style=for-the-badge&logo=nodedotjs&logoColor=white"/>
<img src="https://img.shields.io/badge/sqlite-003B57?style=for-the-badge&logo=sqlite"/>
<img src="https://img.shields.io/badge/amazonec2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=white"/>
<img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm"/>
<img src="https://img.shields.io/badge/swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=white"/>
<img src="https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white"/>

## 관리자 페이지
### 관리자 로그인
<br>![로그인 페이지](https://github.com/user-attachments/assets/e1357ca1-c955-47a9-bcec-ae83cd330d39)
### 메시지 관리 페이지
메세지를 추가/삭제/조회가 가능
<br>![메세지 추가](https://github.com/user-attachments/assets/86c1e12d-f828-4957-baed-18fb7604ae1f)

에이전트마다 부여된 모듈 번호 따라 해당 에이전트가 수신했던 메세지 이후 메세지를 출력하도록 기록
![Honeycam 2025-01-20 22-03-31](https://github.com/user-attachments/assets/92329649-7d5d-4f08-b1d4-25b1cbc7ecad)


### 서버에 올라간 버젼 관리
올라간 파일중 일부만 다운 가능
<br>![버젼관리](https://github.com/user-attachments/assets/d5e357cc-379e-448c-8ffb-ab59262e9b06)
### 서버에 새로운 버전 업로드
한번에 여러 파일 업로드 가능
<br>![버젼 업로드](https://github.com/user-attachments/assets/bd7e0e5d-bbd0-4497-b956-87e2edf22cc4)


## 서버 실행
<details> 
  <summary><b>exe 서버 실행 방법</b></summary>
  
1. node 설치
2. 프로젝트 폴더에서 `npm install` 명령어 실행 (node_modules 폴더 생성돼야 함)
3. 프로젝트 폴더에 .env 파일 생성 후 아래 내용 파일에 작성
```env
JWT_KEY="임의 문자열"
```
4. `npm run start:dev` 명령어로 서버 실행 (http://localhost:3000/admin)
</details>

<details> 
  <summary><b>어드민 페이지</b></summary>
  
- /admin - 어드민 계정으로 로그인하는 페이지
- /admin/create-account - 어드민 계정을 생성하는 페이지 (1개까지만 생성됨)
- /admin/agent-version - 에이전트의 현재 버전을 확인하는 페이지
- /admin/agent-update - 새로운 버전을 업로드하는 페이지
- /admin/messages - 메세지 관리하는 페이지 (임시)
</details>
<details> 
  <summary><b>api 목록</b></summary>
  
/swagger 에서 확인할 수 있습니다.
</details>
