CREATE TABLE IF NOT EXISTS Profile (
    school_id TEXT NOT NULL PRIMARY KEY,
    name TEXT,
    password TEXT NOT NULL,
    ban_until TEXT,-- end time
);

CREATE TABLE IF NOT EXISTS Document (
    id INT NOT NULL PRIMARY,
    upload_time TEXT NOT NULL,
    uploader_id TEXT,
    pdf_locate TEXT NOT NULL,
    subject TEXT NOT NULL,
    semester TEXT NOT NULL,
    exam_type TEXT NOT NULL,
    varified INT NOT NULL,
);