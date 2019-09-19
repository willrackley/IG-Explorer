/* eslint-disable no-loop-func */
import axios from 'axios';
import { SCRAPE_POSTS, RESET_COUNT, LOAD_MORE_COUNTS, LOAD_MORE_ALL, LOAD_MORE_IMG, LOAD_MORE_VID, UNFOUND_USER, RESET_UNFOUND_USER } from './types'
import { uiStartLoading, uiStopLoading } from './index'
let influencerArr = [];
let allResultsArr = [];
let vidResultsArr = [];
let imgResultsArr = [];

export const getScrapedPosts = () => {
    influencerArr = [];
    return dispatch => {
        axios.get('/api/influencers')
        .then(res => {
            for (let i = 0; i < res.data.length; i++) {
                influencerArr.push(res.data[i].igName)
            }
            dispatch(prelimFetch());
        })   
    }
}

export const getInfluencerPosts =()=> {
    return (dispatch, getState) => {
        dispatch(resetUnfoundUser());
        let minRangeLikes = getState().ui.minRangeLikes;
        let maxRangeLikes = getState().ui.maxRangeLikes;
        let minRangeViews = getState().ui.minRangeViews;
        let maxRangeViews = getState().ui.maxRangeViews;
        

        for  (let i = 0; i < influencerArr.length; i++) {
            axios.get(`/api/scrape/${influencerArr[i]}`)
            .then(res => {
                if(res.data === 'error') {
                    let lostUser = {index: [i+1], user: influencerArr[i]};
                    //console.log(influencerArr[i])
                    dispatch(unfoundUser(lostUser))
                    
                } else {
                    for(let j = 0; j < res.data.length; j++) {
                        if ((res.data[j].is_video && res.data[j].video_view_count >= minRangeViews && res.data[j].video_view_count <= maxRangeViews && res.data[j].edge_liked_by.count >= minRangeLikes && res.data[j].edge_liked_by.count <= maxRangeLikes) || (!res.data[j].is_video && res.data[j].edge_liked_by.count >= minRangeLikes && res.data[j].edge_liked_by.count <= maxRangeLikes)) {
                            allResultsArr.push(res.data[j])
                        }
                        if(res.data[j].is_video && res.data[j].video_view_count >= minRangeViews && res.data[j].video_view_count <= maxRangeViews && res.data[j].edge_liked_by.count >= minRangeLikes && res.data[j].edge_liked_by.count <= maxRangeLikes) {
                            vidResultsArr.push(res.data[j])
                        }
                        if(!res.data[j].is_video && res.data[j].edge_liked_by.count >= minRangeLikes &&  res.data[j].edge_liked_by.count <= maxRangeLikes) {
                            imgResultsArr.push(res.data[j])
                        }
                    }
                }
                
            })
        } 
    }
    
}

export const unfoundUser = (unfoundUser) => {
    return {
        type: UNFOUND_USER,
        unfoundUser: unfoundUser
    }
}

export const resetUnfoundUser = () => {
    return {
        type: RESET_UNFOUND_USER,
    }
}

export const prelimFetch = () => {
    
    return async(dispatch, getState) => {
       
        allResultsArr = [];
        vidResultsArr = [];
        imgResultsArr = [];
        dispatch(uiStartLoading())
        await dispatch(getInfluencerPosts())
        await new Promise((resolve, reject) => setTimeout(resolve, 2000));
        dispatch(asyncedFetch())
    }
}

export const asyncedFetch = () => {
    
    return (dispatch, getState) => {
        if (getState().auth.isSignedIn) {
            //console.log(this.props.auth.userData.favorites)
            for (let k = 0; k < allResultsArr.length; k++) {
                for (let l = 0; l < getState().auth.userData.favorites.length; l++) {
                    if (getState().auth.userData.favorites[l].shortcode === allResultsArr[k].shortcode ){
                        allResultsArr[k].style = true
                    }
                }
               
            }
        }

        dispatch(setPostData(allResultsArr, vidResultsArr, imgResultsArr))
        dispatch(uiStopLoading())
    }
}

export const setPostData = (allResultsArr, vidResultsArr, imgResultsArr) => {

    return (dispatch, getState) => {
        let countSlice = getState().scrapedPosts.counts;
        dispatch({
            type: SCRAPE_POSTS,
            filteredResults: allResultsArr.slice(0, countSlice),
            videoResults: vidResultsArr,
            imageResults: imgResultsArr,
            allResults: allResultsArr,
        })
    }
}


export const resetCount = () => {
    return {
        type: RESET_COUNT,
        counts: 10
    }
}

export const loadMoreAll = () => {
    return (dispatch, getState) => {
        let allResults = getState().scrapedPosts.allResults;
        let countSlice = getState().scrapedPosts.counts;
        dispatch({
            type: LOAD_MORE_ALL,
            filteredResults: allResults.slice(0, countSlice)
        }) 
    }
}

export const loadMoreVid = () => {
    return (dispatch, getState) => {
        let vidResults = getState().scrapedPosts.videoResults;
        let countSlice = getState().scrapedPosts.counts;
        dispatch({
            type: LOAD_MORE_VID,
            filteredResults: vidResults.slice(0, countSlice)
        }) 
    }
}

export const loadMoreImg = () => {
    return (dispatch, getState) => {
        let imageResults = getState().scrapedPosts.imageResults;
        let countSlice = getState().scrapedPosts.counts;
        dispatch({
            type: LOAD_MORE_IMG,
            filteredResults: imageResults.slice(0, countSlice)
        }) 
    }
}

export const loadMoreCounts = () => {
    return (dispatch, getState) => {
        let countSlice = getState().scrapedPosts.counts;
        dispatch({
            type: LOAD_MORE_COUNTS,
            counts: countSlice + 10
        })
    }
}