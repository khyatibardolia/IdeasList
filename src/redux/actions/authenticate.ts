export const userAuthenticationAction = (payload: any) => (dispatch: any) => {
    dispatch({
        type: "AUTHENTICATE_USER",
        payload: payload
    });
};
