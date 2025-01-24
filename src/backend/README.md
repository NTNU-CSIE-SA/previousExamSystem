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