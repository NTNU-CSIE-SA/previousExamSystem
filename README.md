# previousExamSystem
## How to run the project
1. Clone the repository

2. Create `.env` files
Make sure you have create `.env` inside `backend` directory and the root directory of this project. You can copy the `.env.devlopement` file and rename it to `.env` and change the environment variables as needed. (Both need to be the same file)

3. Start up server
```
docker-compose up
```

4. Set up the accounts
You can edit the `volumes/accountGen/account.csv` to help you to generate accounts.
And you can run the following command to generate non-existing accounts in `account.csv`:
``` 
docker exec -it <your_backend container_name> bash
pnpm ts-node /app/accountGen/gen_account.ts
# make sure the salt rounds in gen_account.ts is the same as the one in .env file
```
Or you can edit the SQLite database directly. (Make sure password is hashed with bcrypt when you edit the database directly)
```
sqlite3 /app/data/db.sqlite
```

## basic info
- All the pdf file will store in `volumes`. (`volumes/uploads` for unverified files, `volumes/verified` for verified files, and `volumes/origin` for original files before watermarking)
- The backend server will run on port `5000` (default).
- The frontend server will run on port `3000` (defalut).
- You can edit the watermark file in `volumes/resources` directory. (Make sure the file is a png or jpeg file and same name in .env file or you need to rename it and restart the server)

## Setting up backend (environment variables)
### BACKEND_PORT(inside docker container)
- The port the backend server will run on.
- In docker container, the port need to set to `5000`. (If you want to change the port, you will also need to change `docker-compose.yml` and rebuild the image.)
- Default: `5000`

### UPLOAD_DIR
- The directory where the uploaded files will be stored.
- In docker container, the directory need to set to `./uploads` (If you want to change the directory, you will also need to change `docker-compose.yml` and rebuild the image)
- Default: `./uploads`

### VERIFIED_DIR
- The directory where the verified files will be stored.
- In docker container, the directory need to set to `./verified` (If you want to change the directory, you will also need to change `docker-compose.yml` and rebuild the image)
- Default: `./verified`

### ORIGIN_FILE_PATH
- The directory where the watermark file's original files.
- In docker container, the directory need to set to `./origin` (If you want to change the directory, you will also need to change `docker-compose.yml` and rebuild the image)
- Default: `./origin`

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
- **required** (suggested: `./resources/<file_name>` or you need to change `docker-compose.yml`)
- In docker container, if you want to change the watermark file, you will also need to change Dockerfile and rebuild the image.
- Example: ./watermark.png

### WATERMARK_OPACITY
- The opacity of the watermark.
- Default: 0.

### WATERMARK_WIDTH
- The width ratio of the watermark in the PDF. (0 ~ 1)
- Default: 0.5

## Website

### Login
需要先登入，並且同意「使用者條款」和「隱私權政策」才能進入網站。\
登入會需要輸入帳號和密碼，如果輸入錯誤會顯示錯誤訊息。\
登入成功後會將 token 存在 cookie 中。

### Logout
登出會清除 cookie 中的 token。

### Home
#### 搜尋考古題
可以選擇「學期」、「科目」和「考試類型」，來搜尋考古題。\
頁面上會有所有已驗證考古題的標籤\
每項當沒有選擇任何標籤時，會視為選擇全部。\
搜尋方式是每個項目內先進行聯集，再將三個項目交集。

#### 查看考古題
搜尋後點擊跳出的結果，會跳出新分頁顯示考古題。

### Upload
#### 標籤
關於標籤的年份只能選近十年的學期，或是「其他」。\
科目和考試類型則是可以選擇所有存在系統中的標籤以及「其他」，選擇「其他」時會顯示一個輸入框，可以輸入自己的標籤選項。

#### 選擇檔案
在頁面下方會有顯示檔案上傳限制的訊息，包含檔案大小和檔案類型。\
可以按下「上傳檔案」按鈕，選擇要上傳的檔案。

#### 上傳檔案
上傳檔案後會顯示檔案的資訊，包含檔案名稱、檔案大小、標籤、檔案類型。

### Setting
#### 修改密碼
可以修改密碼，需要輸入舊密碼和新密碼，如果輸入錯誤會顯示錯誤訊息。

### DB Management
#### 篩選
可以選擇「學期」、「科目」和「考試類型」以及「驗證狀態」，來篩選考古題。\
篩選方式大致和搜尋考古題相同，但是會顯示所有考古題，包含未驗證的考古題。

#### 選擇考古題
可以根據篩選結果，去在下拉式選單中選擇要編輯狀態的考古題。

#### 編輯考古題
- 可以去手動更改檔案屬性，包含「學期」、「科目」和「考試類型」
- 可以去更改檔案的驗證狀態，包含「已驗證」和「未驗證」
- 可以在未驗證檔案上浮水印
  - 內建的圖片浮水印
  - 打上自己的文字浮水
  - 不去處理浮水印
- 刪除未驗證的檔案
按下「送出」按鈕後會進行更改檔案的屬性，並且會顯示成功訊息。

#### 預覽
會在畫面右側顯示選擇的檔案的預覽。

#### 其他注意事項
- 已驗證檔案不可刪除
- 已驗證檔案不可上浮水印
- 如果選擇要上浮水印，之後送出，會先進行上浮水印的動作，才會去更改檔案的屬性（含驗證狀態）
- 在未驗證檔案可以直接在同一次「送出」進行驗證與浮水印的動作

#### 檔案儲存位置
- 未驗證檔案會儲存在 `volumes/uploads` 中
- 已驗證檔案會儲存在 `volumes/verified` 中
- 每進行一次上浮水印的動作，會在 ``volumes/origin` 中儲存原始檔案

### User Management
#### Ban User
可以選擇要封鎖的使用者，並選擇要封鎖的時長。\
按下「送出」按鈕後會進行封鎖使用者的動作，並且會顯示成功訊息。\
可以在時常選擇欄，選擇封鎖的時長，最短可選擇 1 天，最長可以選擇 10 年。

#### Unban User
可以選擇要解封的使用者，而使用者解封的日期會顯示下拉式選單使用者 ID 後方。

#### 封鎖後
- 使用者無法查看任何考古題
- 使用者無法上傳任何考古題
- 仍可查看目前有哪些考古題，並且可以搜尋，但無法查看考古題的內容