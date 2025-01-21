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

### logout
delete session token and expire it

### upload file
allow file type:

1. check cookie
2. check file type
3. check size
4. add unique id(avoid race condition)
5. store in file system
6. add to SQL database

### view file
#### send all tag to frontend
like SELECT DISTINCT "semester" FROM Document
#### send file list to frontend(don't need permission)
1. return json that have "semester", "class", "file name" and varify
(subject1 OR subject2 OR...) AND (year1 OR year2 OR ...) AND (type1 OR type2 OR ...) AND isVarified == True
2. if list is empty == '*'
   
#### view file detail()
1. get file id
2. check cookie
3. check user id in cookie and check if it is valid from SQL database, if not valid error status code
    - status 200: success
    - 
4. get file path from SQL database
5. check file exist 
6. check file is varified
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
#### send file list tag to frontend(need permission)
1. check cookie's user is admin
2. return all file list from SQL database
3. return json that have "semester", "class", "file name"

#### filter
1. check cookie's user is admin
2. filter by tag frontend send (same type use OR, and use AND to filter all)
    (subject1 OR subject2 OR...) AND (year1 OR year2 OR ...) AND (type1 OR type2 OR ...) AND isVarified
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
3. delete file from file system
4. delete column from SQL database
5. return delete success

#### modify file info
1. check cookie is admin
2. check file id is valid from SQL database
3. change file info in SQL database(semester, class, file name) for file id
4. return modify success

{semester: asdasd, class: , file name: ,varify}