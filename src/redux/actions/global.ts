export const setLoader = (payload: any) => (dispatch: any) => {
    console.log('payload');
    console.log(payload);
    dispatch({
        type: "SET_LOADER",
        payload: payload
    });
};