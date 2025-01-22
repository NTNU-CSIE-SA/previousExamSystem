// TODO

export interface Profile {
    school_id: string;
    name: string;
    password: string;
    ban_until: string;
    admin_level: number;
}
export interface Document {
    id: number;
    upload_time: string;
    uploader_id: string;
    pdf_locate: string;
    subject: string;
    semester: string;
    exam_type: string;
    verified: number;
}
export interface Login {
    token: string;
    school_id: string;
    expire_time: string;
}


export interface Database {
    Profile: Profile;
    Document: Document;
    Login: Login;
}