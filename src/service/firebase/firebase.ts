import {db} from "../../config";

export const createUserDocument = async (user?: any, additionalData?: any) => {
    const userRef = db.collection("users").doc(`${user.uid}`);
    const snapshot = await userRef.get();

    if (!snapshot.exists) {
        const {email} = user;
        const {displayName} = additionalData;
        try {
            await userRef.set({
                id: user.uid,
                displayName,
                email,
                createdAt: new Date(),
            });
            const userData = await userRef.get();
            return userData.data()
        } catch (error) {
            console.log('Error in creating note: ', error);
        }
    } else {
        const userData = await userRef.get();
        return userData.data()
    }
};

export const getAllNotesDocument = async (id: any) => {
    const snapshot = await db.collection('notes').get();
    const allNotes = snapshot.docs.map(doc => {
        const data = doc.data();
        const id = doc.id;
        return {id, ...data};
    });
    const filter = allNotes && allNotes.length && allNotes?.filter((item: any) => item.userId === id);
    return filter;
};

export const getNoteByIdDocument = async (id: any) => {
    const note = await db.collection('notes').doc(`${id}`);
    const snapshot = await note.get();
    const data = snapshot.data();
    const key = snapshot.id;
    if(key && data) {
        return {id: key, ...data};
    }
};

export const addNoteDocument = async (note: any, uid: any) => {
    const userRef = db.collection("notes");
    try {
       return await userRef.add({userId: uid, note});
    } catch (error) {
        console.log('Error in creating note: ', error);
    }
};

export const updateNoteDocument = async (note: any, noteId: any) => {
    const userRef = db.collection("notes").doc(noteId);
    try {
        await userRef.update({note});
    } catch (error) {
        console.log('Error in updating note: ', error);
    }
};

export const deleteNoteDocument = async (id: any) => {
    const userRef = db.collection("notes").doc(id);
    try {
        await userRef.delete();
    } catch (error) {
        console.log('Error in deleting note: ', error);
    }
};
