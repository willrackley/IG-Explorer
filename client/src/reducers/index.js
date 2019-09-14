import { combineReducers } from 'redux';
import authReducer from './authReducer';
import scrapePostReducer from './scrapePostReducer'
import uiReducer from './ui';

export default combineReducers({
    auth: authReducer,
    scrapedPosts: scrapePostReducer,
    ui: uiReducer
});