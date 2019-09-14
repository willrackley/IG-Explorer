import { UI_START_LOADING, UI_STOP_LOADING, UI_MINRANGE, UI_MAXRANGE, RESET_RANGE } from './types';

export const uiStartLoading = () => {
    return {
        type: UI_START_LOADING
    };
}

export const uiStopLoading = () => {
    return {
        type: UI_STOP_LOADING
    };
}

export const setRange = (name,value) => {
    if (name === 'minRange') {
        return dispatch => {
            dispatch({type: UI_MINRANGE,
            range: value})
        }
    } else if (name === 'maxRange') {
        return dispatch => {
            dispatch({type: UI_MAXRANGE,
                range: value})
        }
    }
}

export const resetRange = () => {
    return {
        type: RESET_RANGE
    }
}

