CREATE TABLE IF NOT EXISTS Profile (
    school_id TEXT NOT NULL PRIMARY KEY,
    name TEXT,
    password TEXT NOT NULL,
    ban TEXT,-- end time
);

CREATE TABLE IF NOT EXISTS Document (
    id INT NOT NULL PRIMARY,
    upload TEXT NOT NULL,
    upload_id TEXT,
    pdf_locate TEXT NOT NULL,
    subject TEXT NOT NULL,
    semester TEXT NOT NULL,
    exam_type TEXT NOT NULL,
    varified INT NOT NULL,
);