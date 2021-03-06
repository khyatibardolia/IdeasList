const initialState = {
    user: {}
};

export const authReducer = (state = initialState, action: any) => {
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
