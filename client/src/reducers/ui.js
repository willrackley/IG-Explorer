import { UI_START_LOADING, UI_STOP_LOADING, UI_MAXRANGE_LIKES, UI_MINRANGE_LIKES, UI_MAXRANGE_VIEWS, UI_MINRANGE_VIEWS, RESET_RANGE } from '../actions/types';

const initialState = {
    isLoading: false,
    minRangeLikes: 20000,
    maxRangeLikes: 1000000,
    minRangeViews: 100000,
    maxRangeViews: 1000000
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
        case UI_MINRANGE_LIKES:
            return {
                ...state,
                minRangeLikes: action.range
            };
        case UI_MAXRANGE_LIKES:
            return {
                ...state,
                maxRangeLikes: action.range
            };
        case UI_MINRANGE_VIEWS:
            return {
                ...state,
                minRangeViews: action.range
            };
        case UI_MAXRANGE_VIEWS:
            return {
                ...state,
                maxRangeViews: action.range
            };
        case RESET_RANGE:
            return {
                ...state,
                minRangeLikes: 20000,
                maxRangeLikes: 1000000,
                minRangeViews: 100000,
                maxRangeViews: 1000000
            };
        default:
            return state;
    }
};

export default uiReducer;