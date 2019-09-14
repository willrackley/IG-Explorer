import { SCRAPE_POSTS, LOAD_MORE_COUNTS, RESET_COUNT, LOAD_MORE_ALL, LOAD_MORE_VID, LOAD_MORE_IMG } from '../actions/types';

const initialState = {
    filteredResults: [],
    videoResults: [],
    imageResults: [],
    allResults: [],
    hasMore: false,
    counts: 10
}

const scrapePostReducer = (state = initialState, action) => {
    switch (action.type) {
        case SCRAPE_POSTS:
            return {
                ...state,
                filteredResults: action.filteredResults,
                videoResults: action.videoResults,
                imageResults: action.imageResults,
                allResults: action.allResults,
                hasMore: true
            }; 
        case LOAD_MORE_COUNTS: 
            return {
                ...state,
                counts: action.counts
            }
        case LOAD_MORE_ALL: 
            if (state.counts > state.allResults.length) {
                return {
                    ...state,
                    filteredResults: action.filteredResults,
                    hasMore: false
                }
            }
            return {
                ...state,
                filteredResults: action.filteredResults,
                hasMore: true
            }
        case LOAD_MORE_VID: 
            if (state.counts > state.videoResults.length) {
                return {
                    ...state,
                    filteredResults: action.filteredResults,
                    hasMore: false
                }
            }
            return {
                ...state,
                filteredResults: action.filteredResults,
                hasMore: true
            }
        case LOAD_MORE_IMG: 
            if (state.counts > state.imageResults.length) {
                return {
                    ...state,
                    filteredResults: action.filteredResults,
                    hasMore: false
                }
            }
            return {
                ...state,
                filteredResults: action.filteredResults,
                hasMore: true
            }
        case RESET_COUNT: 
            return {
                ...state,
                counts: action.counts
            }
        default: 
            return state;
    }
}

export default scrapePostReducer; 

