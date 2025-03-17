import {
    ColumnType,
    Generated,
    Insertable,
    JSONColumnType,
    Selectable,
    Updateable,
  } from 'kysely'
  
export interface Profile {
    school_id: string;
    name: string | null;
    password: string;
    ban_until: string | null;
    admin_level: number;
}
export interface Document {
    id: number;
    upload_time: string;
    uploader_id: string | null;
    pdf_locate: string;
    subject: string;
    semester: string;
    exam_type: string;
    verified: number;
}
export interface Login {
    token: string;
    school_id: string;
    expired_time: string;
}


export interface Database {
    Profile: Profile;
    Document: Document;
    Login: Login;
}
export type Pet = Selectable<Database>