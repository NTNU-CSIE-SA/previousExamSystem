## Backend
### password
hash by frontend, store in database(hash)

### login
give a jwt token(add additional hash info inside)

### cookie
TODO: save every valid jwt token in backend

### logout
delete jwt token and expire it

### upload file
allow file type:

1. check cookie
2. check file type
3. check size
4. add unique id(avoid race condition)
5. store in file system
6. add to SQL database

### view file
#### send file list to frontend(don't need permission)
1. return all file list with varified status from SQL database
2. return json that have "semester", "class", "file name"

#### view file detail
1. check cookie
2. check user id in cookie and check if it is valid from SQL database
3. get file path from SQL database
4. check file exist 
5. check file is varified
6. send file to frontend

### admin
#### return is admin
1. check cookie is admin from SQL database
2. return true to frontend

#### return user list
1. check cookie is admin
2. return all user list from SQL database
3. return json that have "user id", "user name", "ban"

#### ban user
1. check cookie is admin
2. check user id is valid from SQL database
3. change ban status in SQL database to the date unbanned
4. return ban success

#### unban user
1. check cookie is admin
2. check user id is valid from SQL database
3. change ban status in SQL database to null
4. return unban success

#### list unvarify file
1. check cookie is admin
2. list all unvarify file from SQL database
3. return json that have "file id", "file name", "user id"

#### varify file
1. check cookie is admin
2. check file id is valid from SQL database
3. change varify status in SQL database
4. return varify success
how should we add point to contributor?

#### delete file
1. check cookie is admin
2. check file id is valid from SQL database
3. delete file from file system
4. delete column from SQL database
5. return delete success


#### list all file
TODO: check is this necessary
1. check cookie is admin
2. list all file from SQL database
3. return json that have all file info
4. return file list

#### modify file info
1. check cookie is admin
2. check file id is valid from SQL database
3. change file info in SQL database(semester, class, file name) for file id
4. return modify success


