## Backend
### password
send Plaintext

### login
give a session token(add additional hash info inside)
#### Request
```json
{
  "school_id": "<user's school id>",
  "password": "<user's password>"
}
```
#### Response
- Success:
```json
{
  "token": "<session token>",
  "expire_time": "<ISO timestamp>",
  "message": "Login successful"
}
```
- Error:
```json
{
  "message": "<error message>"
}
```
### cookie
save in SQL
- primary key: token
- have user id, expired time
- auto expired after N days
  - `N` is defined in `.env`
- every request updates it
- check expired time then update it
- check is on unban time
### logout
delete session token and expire it
#### Request
Header:
```
Authorization: Bearer <session token>
```
#### Response
- Success:
```json
{
  "message": "Logout successful"
}
```
- Error:
```json
{
  "message": "<error message>"
}
```
### upload file
allow file type:

1. check cookie
2. check file type
3. check size 100MB
4. add unique id (avoid race condition) hex  (time, subject, semester, exam_type)
5. store in file system
6. add to SQL database

#### Request
Header:
```
Authorization: Bearer <session token>
```
Form Data:
```
file: <PDF file>,
subject: <subject>,
semester: <semester>,
exam_type: <exam type>
```
#### Response
- Success:
```json
{
  "message": "File uploaded successfully",
  "fileInfo": {
    "id": "<unique file id>",
    "name": "<original file name>",
    "size": "<file size in bytes>",
    "uploadTime": "<ISO timestamp>"
  }
}
```
- Error:
```json
{
  "message": "<error message>"
}
```
### view file
#### send all tags to frontend
like:
```sql
SELECT DISTINCT "semester" FROM Document
```
#### Response
```json
{
  "tags": [
    { "semester": "<semester value>", "subject": "<subject value>", "exam_type": "<exam type value>" }
  ]
}
```
#### send file list to frontend (don't need permission)
1. return JSON that has `"semester"`, `"class"`, `"file name"` and `varify`
   - `(subject1 OR subject2 OR...) AND (semester1 OR semester2 OR ...) AND (type1 OR type2 OR ...) AND isVarified == True`
2. if list is empty == '*'
#### Response
```json
{
  "files": [
    { "id": "<file id>", "semester": "<semester>", "subject": "<subject>", "exam_type": "<exam type>", "verified": true }
  ]
}
```
#### view file detail()
1. get file id
2. check cookie
3. check user id in cookie and check if it is valid from SQL database, if not valid error status code
    - status 200: success
4. get file path from SQL database
5. check file exist
6. send file to frontend
#### Request
Header:
```
Authorization: Bearer <session token>
```
Query Parameters:
```
id=<file id>
```
#### Response
- Success:
```json
{
  "message": "File found",
  "file": "<file binary data>"
}
```
- Error:
```json
{
  "message": "<error message>"
}
```
### admin
#### return is admin
1. check cookie permission from SQL database
2. return true to frontend
#### Response
```json
{
  "is_admin": true
}
```
#### return user list
1. check cookie's user is admin
2. return all user list from SQL database
3. return JSON that has `"user id"`, `"user name"`, `"ban"`
#### Response
```json
{
  "users": [
    { "user_id": "<user id>", "user_name": "<user name>", "ban": "<ban status>" }
  ]
}
```
#### ban user
1. check cookie's user is admin
2. check user id is valid from SQL database
3. change ban status in SQL database to the date unbanned
4. return ban success
#### Request
Header:
```
Authorization: Bearer <session token>
```

Body:
```json
{
  "user_id": "<user id>",
  "ban_until": "<ISO timestamp>"
}
```

#### Response
- Success:
```json
{
  "message": "User banned successfully"
}
```

- Error:
```json
{
  "message": "<error message>"
}
```
#### unban user
1. check cookie's user is admin
2. check user id is valid from SQL database
3. change ban status in SQL database to null
4. return unban success
#### Request
Header:
```
Authorization: Bearer <session token>
```
Body:
```json
{
  "user_id": "<user id>"
}
```

#### Response
- Success:
```json
{
  "message": "User unbanned successfully"
}
```

- Error:
```json
{
  "message": "<error message>"
}
```
#### filter
1. check cookie's user is admin
2. filter by tag frontend send (same type use OR, and use AND to filter all)
    - `(subject1 OR subject2 OR...) AND (semester1 OR semester2 OR ...) AND (type1 OR type2 OR ...) AND isVarified`
3. list all unvarify file from SQL database
4. return JSON that has `"file id"`, `"file name"`, `"user id"`

#### Response
```json
{
  "files": [
    { "file_id": "<file id>", "file_name": "<file name>", "uploader_id": "<uploader id>" }
  ]
}
```
#### verify file
1. check cookie's user is admin
2. check file id is valid from SQL database
3. change verify status in SQL database
4. return verify success
#### Request
Header:
```
Authorization: Bearer <session token>
```

Body:
```json
{
  "file_id": "<file id>"
}
```

#### Response
- Success:
```json
{
  "message": "File verified successfully"
}
```

- Error:
```json
{
  "message": "<error message>"
}
```
#### delete file
1. check cookie's user is admin
2. check file id is valid from SQL database
3. check file is unvarified
4. delete file from file system
5. delete column from SQL database
6. return delete success
#### Request
Header:
```
Authorization: Bearer <session token>
```

Body:
```json
{
  "file_id": "<file id>"
}
```

#### Response
- Success:
```json
{
  "message": "File deleted successfully"
}
```

- Error:
```json
{
  "message": "<error message>"
}
```
#### modify file info
1. check cookie is admin
2. check file id is valid from SQL database
3. change file info in SQL database (semester, class, file name) for file id
4. return modify success
#### Request
Header:
```
Authorization: Bearer <session token>
```
Body:
```json
{
  "file_id": "<file id>",
  "semester": "<new semester>",
  "subject": "<new subject>",
  "exam_type": "<new exam type>",
  "file_name": "<new file name>"
}
```

#### Response
- Success:
```json
{
  "message": "File info modified successfully"
}
```

- Error:
```json
{
  "message": "<error message>"
}
```

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