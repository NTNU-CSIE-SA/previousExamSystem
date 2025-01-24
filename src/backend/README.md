# Backend

## password
send Plaintext

## login
give a session token (add additional hash info inside)

### Request
```json
{
  "school_id": "123456",
  "password": "mypassword"
}
```

### Response
- **Success**
```json
{
  "token": "abcdef123456",
  "expire_time": "2025-12-31T23:59:59Z",
  "message": "Login successful"
}
```

- **Error** (Invalid credentials)
```json
{
  "message": "Invalid school ID or password"
}
```

---

## logout
delete session token and expire it

### Request
**Headers:**
```json
{
  "Authorization": "Bearer <token>"
}
```

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

### Request
**Headers:**
```json
{
  "Authorization": "Bearer <token>"
}
```

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

## view file

### Get all tags
Get all distinct tags (e.g., semester, subject, exam_type) from the database.

### Request
GET `/api/view/tags`

### Response
- **Success**
```json
{
  "status": "success",
  "tags": [
    {"semester": "2023", "subject": "Math", "exam_type": "Final"},
    {"semester": "2023", "subject": "Physics", "exam_type": "Midterm"}
  ]
}
```

- **Error**
```json
{
  "message": "Internal server error"
}
```

---

### Get file list
Fetch a list of verified files matching the provided filters (if any).

### Request
GET `/api/view/list`

**Query Parameters:**
- `subject` (optional): Filter by subject
- `semester` (optional): Filter by semester
- `exam_type` (optional): Filter by exam type

### Response
- **Success**
```json
[
  {
    "file_id": 123456,
    "subject": "Math",
    "semester": "2023",
    "exam_type": "Final",
    "file_name": "final_exam_2023_math.pdf",
    "verified": 1
  },
  {
    "file_id": 123457,
    "subject": "Physics",
    "semester": "2023",
    "exam_type": "Midterm",
    "file_name": "midterm_exam_2023_physics.pdf",
    "verified": 1
  }
]
```

- **Error**
```json
{
  "message": "Internal server error"
}
```

- **No files found**
```json
{
  "message": "No files found"
}
```

---

### View file details
Retrieve detailed information about a specific file and serve the file for download.

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

## Some things to install
1. `pnpm add express`
2. `pnpm add -D @types/express`
3. `pnpm add bcrypt`
4. `pnpm add -D @types/bcrypt`
5. `pnpm add better-sqlite3`
6. `pnpm add -D @types/better-sqlite3`
7. `pnpm add jsonwebtoken`
8. `pnpm add -D @types/jsonwebtoken`
9. `pnpm add dotenv-flow`
10. `pnpm add kysely`
11. `pnpm add sqlite3`
12. `pnpm add multer`
13. `pnpm add -D @types/multer`

---

## Start the server
1. Run the following command:
   ```bash
   pnpm exec ts-node src/backend/server.ts
   ```

