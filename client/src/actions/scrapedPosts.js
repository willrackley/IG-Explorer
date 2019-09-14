/* eslint-disable no-loop-func */
import axios from 'axios';
import { SCRAPE_POSTS, RESET_COUNT, LOAD_MORE_COUNTS, LOAD_MORE_ALL, LOAD_MORE_IMG, LOAD_MORE_VID } from './types'
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
        let minRange = getState().ui.minRange;
        let maxRange = getState().ui.maxRange;
        for  (let i = 0; i < influencerArr.length; i++) {
            axios.get(`/api/scrape/${influencerArr[i]}`)
            .then(res => {
                if(res.data !== 'error') {
                    for(let j = 0; j < res.data.length; j++) {
                        if ((res.data[j].is_video && res.data[j].video_view_count >= minRange && res.data[j].video_view_count <= maxRange) || (!res.data[j].is_video && res.data[j].edge_liked_by.count >= minRange && res.data[j].edge_liked_by.count <= maxRange)) {
                            allResultsArr.push(res.data[j])
                        }
                        if(res.data[j].is_video && res.data[j].video_view_count >= minRange && res.data[j].video_view_count <= maxRange) {
                            vidResultsArr.push(res.data[j])
                        }
                        if(!res.data[j].is_video && res.data[j].edge_liked_by.count >= minRange &&  res.data[j].edge_liked_by.count <= maxRange) {
                            imgResultsArr.push(res.data[j])
                        }
                    }
                } else {
                    console.log(influencerArr[i])
                }
                
            })
        } 
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
    console.log(allResultsArr)
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