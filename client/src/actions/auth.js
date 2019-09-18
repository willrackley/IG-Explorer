import axios from 'axios';
import { AUTH_SET_TOKEN, AUTH_SET_USER_DATA, AUTH_REMOVE_TOKEN, AUTH_RESET_STATE } from './types' 
import { getScrapedPosts } from './scrapedPosts'


// const functions for auth
export const tryAuth = (authData) => {
    return dispatch => {
        axios.post('api/users/signin', authData)
        .then(res => {
            if(res.data.token) {
                localStorage.setItem('jwt', res.data.token)
                dispatch(authSetToken(res.data.token))
                dispatch(getUserData({ headers: {Authorization: `JWT ${res.data.token}` } }))
                return res.data.token
                }
        })
        .catch(err => console.log(err))
    }
}

export const authSetToken = (token) => {
    return  {
        type: AUTH_SET_TOKEN,
        token: token 
    }
}

export const authSetUserData = (userData) => {
    return  {
        type: AUTH_SET_USER_DATA,
        userData: userData
    }
}

export const getUserData = (token) => {
    return dispatch => {
        axios.get("/api/users/find", token)
        .then(res => {
            dispatch(authSetUserData(res.data))
        })
    }
}

export const authClearStorage = () => {
    return dispatch => {
        localStorage.removeItem('jwt');;
    }
}

export const authRemoveToken = () => {
    return {
        type: AUTH_REMOVE_TOKEN
    };
};

export const authResetState = () => {
    return {
        type: AUTH_RESET_STATE
    };
};

export const logout = () => {
    return (dispatch, getState)=> {
        dispatch(authClearStorage())
        dispatch(authResetState())
        dispatch(getScrapedPosts())
    };
};



