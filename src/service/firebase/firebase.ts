import {db} from "../../config";

export const createUserDocument = async (user?: any, additionalData?: any) => {
    const userRef = db.collection("users").doc(`${user.uid}`);
    const snapshot = await userRef.get();

    console.log('user', user);
    console.log('snapshot', snapshot)
    if (!snapshot.exists) {
        const {email, emailVerified} = user;
        const {displayName} = additionalData;
        try {
            await userRef.set({
                displayName,
                email,
                emailVerified,
                createdAt: new Date(),
            });
        } catch (error) {
            console.log('Error in creating user', error);
        }
    } else {
        const userData = await userRef.get();
        return userData.data()
    }
};

export const getAllNotesDocument = async () => {
    const snapshot = await db.collection('notes').get();
    const allNotes = snapshot.docs.map(doc => {
        const data = doc.data();
        const id = doc.id;
        return { id, ...data };
    });
    console.log('allNotes', allNotes)
    return allNotes;
};

export const getNoteByIdDocument = async (id: any) => {
    const note = await db.collection('notes').doc(`${id}`);
    const snapshot = await note.get();
    const data = snapshot.data();
    const key = snapshot.id;
    return { id: key, ...data };
};

export const addNoteDocument = async (note: any) => {
    console.log('note valllll', note);
    const userRef = db.collection("notes");
    console.log('userRef', userRef)
    try {
        await userRef.add({note});
       console.log('userRef', userRef.id);
    } catch (error) {
        console.log('Error in creating user', error);
    }
};
