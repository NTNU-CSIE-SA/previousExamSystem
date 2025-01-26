## ENV
- `BACKEND_PORT`: port number (default: 5000)
- `UPLOADS_DIR`: directory where uploaded files are stored (default: `./uploads`)
- `VERIFIED_DIR`: directory where verified files are stored (default: `./verified`)
- `TOKEN_EXPIRY_DAYS`: token expiry time in days (default: 30)
- `MAX_FILE_SIZE`: maximum file size allowed in MB (default: 10)
- `JWT_SECRET`: secret key for JWT
- `BCRYPT_SALT_ROUNDS`: number of salt rounds for bcrypt (default: 10)
- `USER_LIST_LEVEL` : minimum user level required to view user list (default 2)
- `VERIFY_LEVEL`: minimum user level required to view unverified files and filter with unverified tag (default 2)
- `BAN_LEVEL`: minimum user level required to ban users (default 3)
- `MODIFY_FILES_LEVEL`: minimum user level required to modify files (default 4)

---

## filter 
### get all tags
Can set VERIFY_LEVEL in .env to change the minimum user level required to view unverified files. (default 2)
#### path
`/api/filter/tags`
#### input method
GET
#### output
```json
{
    "semester": [],
    "subject": [],
    "exam_type": []
}
```

----

### list all file from selected tags
#### path
`/api/filter/file-lists`
#### input method
POST

with Authorization header
- with admin level < `env.VERIFY_LEVEL`
```json
{
    "semester": [], // empty array mean all 
    "subject": [],  // empty array mean all
    "exam_type": []     // empty array mean all
}
```
- with admin level >= `env.VERIFY_LEVEL` also can
```json
{
    "semester": [], // empty array mean all 
    "subject": [],  // empty array mean all
    "exam_type": [],     // empty array mean all
    "verified": 0 // 0 or 1 or -1 (all)
}
```
#### output
if admin level < `env.VERIFY_LEVEL`
```json
[
    {
        "id": 1,
        "upload_time": "2025-01-25T08:16:51.482Z", // ISO 8601 format
        "subject": "subject",
        "semester": "semester",
        "exam_type": "type"
    },
    {
        "id": 2,
        "upload_time": "2025-01-25T08:16:51.482Z", // ISO 8601 format
        "subject": "subject",
        "semester": "semester",
        "exam_type": "type"
    }
]
```
if admin level >= `env.VERIFY_LEVLE`
```json
[
    {
        "id": 1,
        "upload_time": "2025-01-25T08:16:51.482Z", // ISO 8601 format
        "subject": "subject",
        "semester": "semester",
        "exam_type": "type",
        "verified": 0 // 0 or 1
    },
    {
        "id": 2,
        "upload_time": "2025-01-25T08:16:51.482Z", // ISO 8601 format
        "subject": "subject",
        "semester": "semester",
        "exam_type": "type",
        "verified": 0 // 0 or 1
    }
]
```

---

## admin
### list all user
#### path
`/api/admin/user-lists`
#### input
GET
#### output
```json
[
    {
        "school_id": "40047000S",
        "name": "name",
        "ban_until": "2025-01-25T08:16:51.482Z" // ISO 8601 format
    },
    {
        "school_id": "40047001S",
        "name": "name",
        "ban_until": "2025-01-25T08:16:51.482Z" // ISO 8601 format
    }
]
```

----

### ban user
Can set BAN_LEVEL in .env to change the minimum user level required to ban users. (default 3)

#### path
`/api/admin/ban`
#### input
POST

with Authorization header
```json
{
    "school_id": "40047000S",
    "ban_until": "2025-01-25T08:16:51.482Z" // ISO 8601 format
}
```
#### output
```json
{
    "message": "User 40047000S is banned until 2025-01-01 00:00:00" // or other error http status code with error message
}
```

### unban user
Can set BAN_LEVEL in .env to change the minimum user level required to unban users. (default 3)
#### path
`/api/admin/unban`
#### input
POST

with Authorization header
```json
{
    "school_id": "40047000S"
}
```
#### output
```json
{
    "message": "User 40047000S is unbanned" // or other error http status code with error message
}
```

----

### verify file
Can set VERIFY_LEVEL in .env to change the minimum user level required to verify files. (default 2)
#### path
`/api/modify-file/verify`
#### input
POST
```json
{
    "file_id": 1
}
```
#### output
```json
{
    "message": "File 1 is verified" // or other error http status code with error message
}
```

----

### delete file
Can set MODIFY_FILES_LEVEL in .env to change the minimum user level required to delete files. (default 4)
#### path
`/api/modify-file/delete`
#### input
POST
```json
{
    "file_id": 1
}
```
#### output
```json
{
    "message": "File 1 is deleted" // or other error http status code with error message
}
```

----

### modify file info
Can set MODIFY_FILES_LEVEL in .env to change the minimum user level required to modify files. (default 4)
#### path
`/api/modify-file/modify-file-info`
#### input
POST
```json
{
    "file_id": 1, 
    "subject": "new subject", // can have it or not, string 0 < length < 100
    "semester": "new semester", // can have it or not, string 0 < length < 100
    "exam_type": "new type", // can have it or not, string 0 < length < 100
    "verify": 0 // can have it or not, 0 or 1
}
```
#### output
```json
{
    "message": "File 1 is modified" // or other error http status code with error message
}
```

---

## change password
send Hashed password to server
### Request
POST `/api/auth/change_password`
```json
{
  "old_password": "mypassword",
  "new_password": "newpassword"
}
```


## login
give a session token (add additional hash info inside)

### Request
POST `/api/auth/login`
```json
{
  "school_id": "123456",
  "password": "mypassword" // hash password
}
```

### Response
- **Success**
```json
{
  "message": "Login successful",
}
```
and set cookie with `token`

- **Error** (Invalid credentials)
```json
{
  "message": "Invalid school ID or password"
}
```

---

## logout
delete cookie and expire it

### Request
POST `/api/auth/logout`

### Response
- **Success**
```json
{
  "message": "Logout successful"
}
```

- **Error** (Invalid token)
```json
{
  "message": "Invalid token or session not found"
}
```

---

## upload file
allow file type: PDF only
Can set UPLOADS_DIR in .env to change the directory where uploaded files are stored. (default: `.uploads`)
Can set MAX_FILE_SIZE in .env to change the maximum file size allowed.(MB) (default: 10MB)

### Request
POST `/api/upload_file/upload`

cookie with token

**Form Data:**
- `file`: (PDF file)
- `subject`: (string)
- `semester`: (string)
- `exam_type`: (string)

### Response
- **Success**
```json
{
  "message": "File uploaded successfully",
  "fileInfo": {
    "id": 12345678,
    "name": "uploaded_file.pdf",
    "size": 102400,
    "uploadTime": "2025-01-01T12:00:00Z"
  }
}
```

- **Error** (Unauthorized: Missing or invalid token)
```json
{
  "message": "Unauthorized: Invalid token"
}
```

- **Error** (No file uploaded)
```json
{
  "message": "No file uploaded"
}
```

- **Error** (Invalid file type)
```json
{
  "message": "Only PDF files are allowed"
}
```

---

## View file details
Retrieve detailed information about a specific file and serve the file for download.

Can set VERIFIED_DIR in .env to change the directory where verified files are stored. (default: `./verified`)
Can set VIEW_FILE_LEVEL in .env to change the minimum user level required to view files. (default 2)


### Request
GET `/api/view/detail/:file_id`

**Headers:**
```json
{
  "Cookie": "token=<user_session_token>"
}
```

### Response
- **Success** (File sent directly)
Content-Disposition: `attachment; filename="<file_name>.pdf"`

- **Error** (Missing token)
```json
{
  "message": "Unauthorized: Missing cookie"
}
```

- **Error** (Invalid token or session)
```json
{
  "message": "Unauthorized: Invalid or expired token"
}
```

- **Error** (User is banned)
```json
{
  "message": "User is currently banned"
}
```

- **Error** (File not found in database)
```json
{
  "message": "File not found"
}
```

- **Error** (File not verified)
```json
{
  "message": "File is not verified"
}
```

- **Error** (File missing in filesystem)
```json
{
  "message": "File not found in verified directory"
}
```


---

## Start the server
1. Run the following command:
   ```bash
   pnpm exec ts-node src/backend/server.ts
   ```

