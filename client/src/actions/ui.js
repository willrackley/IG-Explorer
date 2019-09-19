import { UI_START_LOADING, UI_STOP_LOADING, UI_MINRANGE_VIEWS, UI_MAXRANGE_VIEWS, RESET_RANGE, UI_MINRANGE_LIKES, UI_MAXRANGE_LIKES } from './types';

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
    if (name === 'minRangeLikes') {
        return dispatch => {
            dispatch({type: UI_MINRANGE_LIKES,
            range: value})
        }
    } else if (name === 'maxRangeLikes') {
        return dispatch => {
            dispatch({type: UI_MAXRANGE_LIKES,
                range: value})
        }
    } else if (name === 'minRangeViews') {
        return dispatch => {
            dispatch({type: UI_MINRANGE_VIEWS,
                range: value})
        }
    } else if (name === 'maxRangeViews') {
        return dispatch => {
            dispatch({type: UI_MAXRANGE_VIEWS,
                range: value})
        }
    }

}

export const resetRange = () => {
    return {
        type: RESET_RANGE
    }
}

