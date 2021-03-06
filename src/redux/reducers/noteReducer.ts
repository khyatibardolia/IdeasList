const initialState = {
    data: {},
    singleNote: {}
};

export const noteReducer = (state = initialState, action: any) => {
    console.log('paylod notes-->>', action && action.payload)
    switch (action.type) {
        case "GET_NOTES":
            return {...state, data: action?.payload};
        case "GET_NOTE":
            return {...state, singleNote: action?.payload};
        default:
            return state;
    }
};
