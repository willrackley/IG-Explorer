import { UI_START_LOADING, UI_STOP_LOADING, UI_MAXRANGE, UI_MINRANGE, RESET_RANGE } from '../actions/types';

const initialState = {
    isLoading: false,
    minRange: 100000,
    maxRange: 1000000,
};

const uiReducer = (state = initialState, action) => {
    switch (action.type) {
        case UI_START_LOADING:
            return {
                ...state, 
                isLoading: true
            };
        case UI_STOP_LOADING:
            return {
                ...state,
                isLoading: false
            };
        case UI_MINRANGE:
            return {
                ...state,
                minRange: action.range
            };
        case UI_MAXRANGE:
            return {
                ...state,
                maxRange: action.range
            };
        case RESET_RANGE:
            return {
                ...state,
                minRange: 100000,
                maxRange: 1000000
            };
        default:
            return state;
    }
};

export default uiReducer;