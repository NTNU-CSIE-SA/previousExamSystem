## Backend
### password
send Plaintext

### login
give a session token(add additional hash info inside)

### cookie
save in SQL
primary key: token
have user id, expired time 
auto expired after N day
N in .env
every request update it
check expired time then update it
check is on unban time

### logout
delete session token and expire it

### upload file
allow file type:

1. check cookie
2. check file type
3. check size 100MB
4. add unique id(avoid race condition) hex  (time subject semster  exam_type)
5. store in file system
6. add to SQL database

### view file
#### send all tag to frontend
like SELECT DISTINCT "semester" FROM Document
{semester: , subject: , exam type:}
#### send file list to frontend(don't need permission)
1. return json that have "semester", "class", "file name" and varify
(subject1 OR subject2 OR...) AND (semester1 OR semester2 OR ...) AND (type1 OR type2 OR ...) AND isVarified == True
2. if list is empty == '*'
#### view file detail()
1. get file id
2. check cookie
3. check user id in cookie and check if it is valid from SQL database, if not valid error status code
    - status 200: success
    - 
4. get file path from SQL database
5. check file exist 
<!-- 6. check file is varified -->
7. send file to frontend

### admin
#### return is admin
1. check cookie permission from SQL database
2. return true to frontend

#### return user list
1. check cookie's user is admin
2. return all user list from SQL database
3. return json that have "user id", "user name", "ban"

#### ban user
1. check cookie's user is admin
2. check user id is valid from SQL database
3. change ban status in SQL database to the date unbanned
4. return ban success

#### unban user
1. check cookie's user is admin
2. check user id is valid from SQL database
3. change ban status in SQL database to null
4. return unban success

#### (send all tag to frontend)
like SELECT DISTINCT "semester" FROM Document
#### filter
1. check cookie's user is admin
2. filter by tag frontend send (same type use OR, and use AND to filter all)
    (subject1 OR subject2 OR...) AND (semester1 OR semester2 OR ...) AND (type1 OR type2 OR ...) AND isVarified
3. list all unvarify file from SQL database
4. return json that have "file id", "file name", "user id"

#### verify file
1. check cookie's user is admin
2. check file id is valid from SQL database
3. change verify status in SQL database
4. return verify success

add point to contributor?
google excel

#### delete file
1. check cookie's user is admin
2. check file id is valid from SQL database
3. check file is unvarified
4. delete file from file system
5. delete column from SQL database
6. return delete success

#### modify file info
1. check cookie is admin
2. check file id is valid from SQL database
3. change file info in SQL database(semester, class, file name) for file id
4. return modify success

{file id: , semester: asdasd, subject: , exam type ,varify}
#### some thing need to install
1. pnpm add express
2. pnpm add -D @types/express
3. pnpm add bcrypt
4. pnpm add -D @types/bcrypt
5. pnpm add better-sqlite3
6. pnpm add -D @types/better-sqlite3
7. pnpm add jsonwebtoken
8. pnpm add -D @types/jsonwebtoken
9. pnpm add dotenv-flow
10. pnpm add kysely
11. pnpm add sqlite3
12. pnpm add multer
13. pnpm add -D @types/multer
#### start the server
1. pnpm exec ts-node src/backend/server.ts
