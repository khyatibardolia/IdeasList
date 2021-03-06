const initialState = {
    user: {}
};

export const authReducer = (state = initialState, action: any) => {
    console.log('paylod', action.payload)
    switch (action.type) {
        case "AUTHENTICATE_USER":
            return {
                ...state,
                user: action.payload
            };
        default:
            return state;
    }
};
