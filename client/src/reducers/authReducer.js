import { AUTH_SET_TOKEN, AUTH_SET_USER_DATA, AUTH_RESET_STATE} from "../actions/types"

const initialState = {
    token: null,
    userData: null,
    isSignedIn: false
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case AUTH_SET_TOKEN:
            return {
                ...state,
                token: action.token,
                isSignedIn: true
            };
        case AUTH_SET_USER_DATA:
            return {
                ...state,
                userData: action.userData,
            };
        case AUTH_RESET_STATE:
            return {
                ...state,
                token: null,
                userData: null,
                isSignedIn: false
            };
        default: 
            return state;
    }
}

export default reducer; 

