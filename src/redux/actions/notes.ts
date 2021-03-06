export const getNotesAction = (payload: any) => (dispatch: any) => {
    dispatch({
        type: "GET_NOTES", payload: payload
    });
};
export const getNoteByIdAction = (payload: any) => (dispatch: any) => {
    dispatch({
        type: "GET_NOTE", payload: payload
    });
};
export const addNoteAction = (payload: any) => (dispatch: any) => {
    dispatch({
        type: "ADD_NOTE",
        payload: payload
    });
};
export const updateNoteAction = (payload: any) => (dispatch: any) => {
    dispatch({
        type: "UPDATE_NOTE",
        payload: payload
    });
};

export const deleteNoteAction = (payload: any) => (dispatch: any) => {
    dispatch({
        type: "DELETE_NOTE",
        payload: payload
    });
};

