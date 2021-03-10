const initialState = {
    loader: false
};

export const globalReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case "SET_LOADER":
            return {...state, loader: action?.payload};       
        default:
            return state;
    }
};
