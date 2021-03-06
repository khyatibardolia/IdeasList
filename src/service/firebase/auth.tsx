import {auth} from '../../config';

export const loginInWithEmailAndPassword = (email: string, password: string) => {
   return auth.signInWithEmailAndPassword(email, password);
};

export const signUpWithEmailAndPassword = (email: string, password: string) => {
    return auth.createUserWithEmailAndPassword(email, password);
};

export const logOut = () => auth.signOut();
