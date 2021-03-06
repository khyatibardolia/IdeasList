import {auth} from '../../config';

export const loginInWithEmailAndPassword = (email: string, password: string) => {
   return auth.signInWithEmailAndPassword(email, password);
};

export const signUpWithEmailAndPassword = (email: string, password: string) => {
    return auth.createUserWithEmailAndPassword(email, password);
};

export const getAuthToken = async () => {
    const token = await auth?.currentUser?.getIdToken();
    console.log('token', token)
    return token;
};

export const logOut = () => auth.signOut();
