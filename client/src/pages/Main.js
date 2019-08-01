import React, { Component } from "react";
import Button from 'react-bootstrap/Button';
//import "../App.css";
//import API from "../utils/API"
import axios from "axios";
//const cheerio = require("cheerio");

//const ig = require('instagram-scraping');
let vidResultsArr = [];
let imgResultsArr = [];

class Main extends Component {
    state = {
        videoResults: [],
        hashtags: ['music','rap','hiphop','beatmaker', 'raps', 'instarap', 'hiphopmusic', 'newrappers', 'song','musician','musicvideo', 'bestsongs', 'newsong', 'singing', 'instagrammusic', 'songs', 'guitar', 'slowsong', 'mixing', 'protools', 'singer', 'topsongs', 'popmusic', 'vocalist', 'producerlife', 'flstudio','production', 'beatmaking']
    }
    componentDidMount() {
       
       //console.log(this.state.result)
    }

    

    loadResults = () => {
        this.getPosts()
    }

    getPosts = () => {
        // for (let j = 0; j < this.state.hashtags.length; j++) {
        //     ig.scrapeTag(this.state.hashtags[j]).then(function(result){
        //         for (let i = 0; i < result.medias.length; i++){
        //             if(result.medias[i].isVideo && result.medias[i].views > 9999 ) {
        //                 // this.setState(prevState => ({
        //                 //     videoResults: [...prevState.videoResults, result.medias[i]]
        //                 //   }))
        //                 vidResultsArr.push(result.medias[i]);
        //                 //console.log(result.medias[i]);
        //             } else if (!result.medias[i].isVideo && result.medias[i].like_count.count > 9999 ) {
        //                 imgResultsArr.push(result.medias[i]);
        //             }
        //         }
        //     })
        // } 
       axios.get("http://localhost:4000/api/scrape/sports")
       .then(res => {
           console.log(res.data)
       })
    }

    showVidResults = () => {
        console.log(vidResultsArr)
    }

    showImgResults = () => {
        console.log(imgResultsArr)
    }

    render() {
        return (
            <div>
                <p>Hello</p>
                <Button variant="secondary" onClick={this.loadResults}>load</Button>
                <Button variant="secondary" onClick={this.showVidResults}>videos</Button>
                <Button variant="secondary" onClick={this.showImgResults}>photos</Button>
           </div>
        )
    }

}

export default Main;
