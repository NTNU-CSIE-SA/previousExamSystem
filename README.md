# previousExamSystem
## How to run the project
1. Clone the repository

2. Install the dependencies
```bash
pnpm install
```

3. Run the project(dev mode)
```bash
pnpm dev
```

4. Build the project
```bash
pnpm build
```

5. Run the project
```bash
pnpm start
```

## Setting up backend (environment variables)
### BACKEND_PORT
- The port the backend server will run on.
- Default: 5000

### UPLOAD_DIR
- The directory where the uploaded files will be stored.
- Default: ./uploads

### VERIFIED_DIR
- The directory where the verified files will be stored.
- Default: ./verified

### ORIGIN_FILE_PATH
- The directory where the watermark file's original files.
- Default: ./origin

### TOKEN_EXPIRY_DAYS
- The number of days the token will expire.
- Default: 30

### MAX_FILE_SIZE
- The maximum file size(MB) that can be uploaded.
- Default: 100

### JWT_SECRET
- The secret key for JWT.
**Required**

### BCRYPT_SALT_ROUNDS
- The number of salt rounds for bcrypt.
- Default: 10

### BAN_LEVEL
- The admin level required to ban a user and see all users.
- Default: 2

### MODIFY_FILE_LEVEL
- The admin level required to verify and modify a file, required to see all files and delete or watermakr unverified files.
- Default: 3

### WATERMARK_PATH
- The path to the watermark file. (Only png and jpeg files are supported)
- **required**
- Example: ./watermark.png

### WATERMARK_OPACITY
- The opacity of the watermark.
- Default: 0.

### WATERMARK_WIDTH
- The width ratio of the watermark in the PDF. (0 ~ 1)
- Default: 0.5