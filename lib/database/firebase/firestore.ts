import {db} from "@/lib/database/firebase/firebase-admin";
export const dbRef = ()=>{
    const access_key = process.env.DATABASE_ACCESS_KEY;
    const docRef = db.doc(`databases/${access_key}`);
    return docRef;
}