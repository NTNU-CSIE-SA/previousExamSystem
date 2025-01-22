CREATE TABLE IF NOT EXISTS Profile (
    school_id TEXT NOT NULL PRIMARY KEY,
    name TEXT,
    password TEXT NOT NULL,
    ban_until TEXT, -- end time
    admin_level INT NOT NULL
);

CREATE TABLE IF NOT EXISTS Document (
    id INT NOT NULL PRIMARY KEY,
    upload_time TEXT NOT NULL,
    uploader_id TEXT,
    pdf_locate TEXT NOT NULL,
    subject TEXT NOT NULL,
    semester TEXT NOT NULL,
    exam_type TEXT NOT NULL,
    varified INT NOT NULL
);

CREATE TABLE IF NOT EXISTS Login (
    token TEXT NOT NULL PRIMARY KEY,
    school_id TEXT NOT NULL,
    expired_time TEXT NOT NULL
);