// TODO

export interface Profile {
    school_id: string;
    name: string;
    password: string;
    ban: string;
}
export interface Document {
    id: number;
    upload: string;
    upload_id: string;
    pdf_locate: string;
    subject: string;
    semester: string;
    exam_type: string;
    verified: number;
}


export interface Database {
    Profile: Profile;
    Document: Document;
}