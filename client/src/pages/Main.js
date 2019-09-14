/* eslint-disable no-loop-func */
import React, { Component } from "react";
import List from '../components/List';
import Card from '../components/Card/card'
import Modal from '../components/PostModal/modal';
import axios from "axios";
import InfiniteScroll from 'react-infinite-scroller';
import { IoIosCamera } from "react-icons/io";
import { IoIosVideocam } from "react-icons/io";
import { IoIosSearch } from 'react-icons/io';
import { IoMdPerson } from 'react-icons/io';
import { confirmAlert } from 'react-confirm-alert'; 
import Nav from '../components/Nav/nav'
import { getUserData, getScrapedPosts, loadMoreCounts, loadMoreAll, resetCount, loadMoreImg, loadMoreVid, setRange, resetRange, logout } from '../actions'
import { connect } from "react-redux";
import { Link } from "react-router-dom"
import 'react-confirm-alert/src/react-confirm-alert.css';
import './style.css'
let vidResultsArr = [];
let imgResultsArr = [];
let allResultsArr = [];
let influencerArr = [];
let counts = 10;



class Main extends Component {
    
    state = {
        allResults: [],
        videoResults: [],
        imageResults: [],
        filteredResults: [],
        postType: "All",
        isLoading: true,
        hasMore: false,
        addInfluencerForm: " ",
        minRange: 100000,
        maxRange: 1000000,
        savedPost: {
            video: null,
            username: null,
            postId: null,
            shortcode: null,
            imageUrl: null, 
            views: null,
            likes: null,
            caption: null
        },
        savedStyle: null,
        cardId: null,
        hashtags: ['music','rap','hiphop','beatmaker', 'raps', 'instarap', 'hiphopmusic', 'newrappers', 'song','musician','musicvideo', 'bestsongs', 'newsong', 'singing', 'instagrammusic', 'songs', 'guitar', 'slowsong', 'mixing', 'protools', 'singer', 'topsongs', 'popmusic', 'vocalist', 'producerlife', 'flstudio','production', 'beatmaking']
    }
    componentDidMount() {
        
        // let artist = { igName: "lilbaby_1", name: "lil baby", type: "rapper"}

        // axios.post('/api/influencers/post', artist)
        // .then(res => {
        //     console.log(res)
        // })
        // axios.get('/api/influencers')
        // .then(res => {
        //     for (let i = 0; i < res.data.length; i++) {
        //         influencerArr.push(res.data[i].igName)
        //     }
            
        //     return this.getPosts();
        // })   
        this.props.getScrapedPosts();
    }

    fetchPostData = () => {
        for (let i = 0; i < influencerArr.length; i++) {
            axios.get(`/api/scrape/${influencerArr[i]}`)
            .then(res => {
                for(let j = 0; j < res.data.length; j++) {
                    if ((res.data[j].is_video && res.data[j].video_view_count >= this.state.minRange && res.data[j].video_view_count <= this.state.maxRange) || (!res.data[j].is_video && res.data[j].edge_liked_by.count >= this.state.minRange && res.data[j].edge_liked_by.count <= this.state.maxRange)) {
                        allResultsArr.push(res.data[j])
                    }
                    if(res.data[j].is_video && res.data[j].video_view_count >= this.state.minRange && res.data[j].video_view_count <= this.state.maxRange) {
                        vidResultsArr.push(res.data[j])
                    }
                    if(!res.data[j].is_video && res.data[j].edge_liked_by.count >= this.state.minRange &&  res.data[j].edge_liked_by.count <= this.state.maxRange) {
                        imgResultsArr.push(res.data[j])
                    }
                }
            })
        }  
        if (this.props.auth.isSignedIn) {
            //console.log(this.props.auth.userData.favorites)
            for (let k = 0; k < allResultsArr.length; k++) {
                for (let l = 0; l < this.props.auth.userData.favorites.length; l++) {
                    if (this.props.auth.userData.favorites[l].shortcode === allResultsArr[k].shortcode ){
                        allResultsArr[k].style = true
                        //console.log(allResultsArr[k])
                    }
                }
               
            }
        }
    }

    async getPosts() {
        this.setState({ isLoading: true })
        
        await this.fetchPostData()
        await new Promise((resolve, reject) => setTimeout(resolve, 2000));
      
        this.setState({
            filteredResults: allResultsArr.slice(0, counts),
            videoResults: vidResultsArr,
            imageResults: imgResultsArr,
            allResults: allResultsArr,
            hasMore: true,
            isLoading: false,
        }); 
        
    }

    allResults = () => {
        this.props.resetCount()
        this.setState({
            postType: "All",
        });
        this.props.loadMoreAll()
        console.log(this.props.scrapedPosts.filteredResults)
     }

    showVidResults = () => {
        this.props.resetCount();
        this.setState({
            postType: "Video",
        });
        this.props.loadMoreVid();
    }

    showImgResults = () => {
        this.props.resetCount();
        this.setState({
            postType: "Photo",
        })
        this.props.loadMoreImg();
    }

    loadMore = () => {
        //counts = counts + 10
        this.props.loadMoreCounts()
        setTimeout(()=>console.clear(), 5000)
        if (this.state.postType === "All") {
            // this.setState({ filteredResults: this.state.allResults.slice(0, counts )})
            this.props.loadMoreAll()
            // let allPostAmount = this.state.allResults.length
            // if (counts > allPostAmount) {
            //     this.setState({ hasMore: false })
            // }
        }
        if (this.state.postType === "Video") {
            this.props.loadMoreVid()
            // this.setState({ filteredResults: this.state.videoResults.slice(0, counts )})
            // let vidPostAmount = this.state.videoResults.length
            // if (counts > vidPostAmount) {
            //     this.setState({ hasMore: false })
            // }
        }
        if (this.state.postType === "Photo") {
            this.props.loadMoreImg();
            // this.setState({ filteredResults: this.state.imageResults.slice(0, counts )})
            // let postAmount = this.state.imageResults.length
            // if (counts > postAmount) {
            //     this.setState({ hasMore: false })
            // }
        }
    }

    showInfluencerForm = () => {
        this.setState({ addInfluencerForm : (<span>
            
            <form className='mt-5'>
                <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Influencer's Name</label>
                    <input type="text" className="form-control" id="name" aria-describedby="nameHelp" placeholder="Drake"/>
                </div>
                <div>
                    <label htmlFor="exampleInput">Influencer's Instagram Name</label>
                    <input type="text" className="form-control" id="igName" aria-describedby="nameHelp" placeholder="@Influencer"/>
                </div>
                <div className='mt-3'>
                    <label htmlFor="exampleInput2">Influencer Category</label>
                    <select className="form-control">
                        <option>Rapper</option>
                        <option>Singer</option>
                        <option>Producer</option>
                    </select>
                </div>
                
            </form>
            <button type="submit" className="btn btn-primary mt-3">Submit</button>
            </span>
            )
        })
    }

    handleInputChange = event => {
        event.preventDefault()
        const { name, value } = event.target;
        // this.setState({
        //     [name]: value
        // });
        console.log(this.props.ui.minRange)
        this.props.setRange(name, value)
    };

    submitFilters = () => {
        this.props.resetCount();
        // allResultsArr = [];
        // vidResultsArr = [];
        // imgResultsArr = [];
        // this.getPosts()
        this.props.getScrapedPosts();
        //console.log(this.state.minRange)
    }

    resetFilters = () => {
        confirmAlert({
        title: 'You are about to reset the filters to their default setting',
        message: 'Are you sure to do this?',
        buttons: [
          {
            label: 'Yes',
            onClick: () => {
                this.props.resetRange()
                this.props.resetCount()
                this.props.getScrapedPosts()
            }
          },
          {
            label: 'No',
            onClick: () => { return; }
          }
        ]
      });
    }

   savePost = async (video, username, id, url, imageUrl, views, likes, caption,index) => {

       if (!this.props.isSignedIn) {
        confirmAlert({
            title: 'You must be signed in to save a post',
            message: '',
            buttons: [
              {
                label: 'close',
                onClick: () => { return; }
              }
            ]
          });
       } else {
            await this.setState(prevState => {
                return {
                    savedPost: {
                        ...prevState.savedPost,
                        video: video,
                        username: username,
                        postId: id,
                        shortcode: url,
                        imageUrl: imageUrl,
                        views: views,
                        likes: likes,
                        caption: caption
                    },
                    
                }
            })
           
                let postDetail = {
                    video: this.state.savedPost.video,
                    username: this.state.savedPost.username,
                    postId: this.state.savedPost.postId,
                    shortcode: this.state.savedPost.shortcode,
                    imageUrl: this.state.savedPost.imageUrl,
                    views: this.state.savedPost.views,
                    likes: this.state.savedPost.likes,
                    caption: this.state.savedPost.caption
                }

            await new Promise((resolve, reject) => setTimeout(resolve, 1000));
            
            axios.put(`api/users/savePost/${this.props.auth.userData.id}`, postDetail)
            .then(res => {
                this.props.getUserData({ headers: {Authorization: `JWT ${this.props.auth.token}` }})
                if (res.data[0]) {
                    console.log(res.data[0])
                } else {
                    return;
                }            
            })
            
       }
    }

    render() {
        
        return (
            <div>
                <Nav>
                    {this.props.isSignedIn ? <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <a className="nav-link ml-auto dropdown-toggle" href="/" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <IoMdPerson></IoMdPerson>
                    </a>
                    <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                    <Link className="dropdown-item" to="/savedPosts">Saved Posts</Link>
                    <Link className="dropdown-item" to="/customSearch">Custom Search</Link>
                    {this.props.auth.userData && this.props.auth.userData.admin ? <Link className="dropdown-item" to="/admin">Admin</Link> : <span></span>}
                    <button className="dropdown-item" onClick={() => this.props.logout()} >Log Out</button></div></div> : <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <button data-toggle="modal" data-target="#authModal" className="ml-auto btn loginBtn" >log in/ sign up </button> 
                </div> }
                </Nav>
                <div className='container-fluid'>
                    <div className='row no-gutters'>
                        <div className=''>

                        </div>
                        <div className='col-md-12'>
                            <div className="mt-4 mb-3 text-center">
                                <button className="m-1 catBtns"  onClick={this.allResults}><div className='d-inline-flex pt-1 '><IoIosSearch size={30}/><h5 className="p-1">All Posts</h5></div></button>
                                <button className="m-1 catBtns" onClick={this.showVidResults}><div className='d-inline-flex pt-1'><IoIosVideocam size={30}/> <h5 className="p-1">Videos</h5></div></button>
                                <button className="m-1 catBtns" onClick={this.showImgResults}><div className='d-inline-flex pt-1'><IoIosCamera size={30}/> <h5 className="p-1">Photos</h5></div></button>
                            </div>

                            <div>
                                {this.props.ui.isLoading ? <div className='text-center'><div className="spinner-border" role="status">
                                <span className="sr-only">Loading...</span>
                                </div></div>: 
                                    <div className='container'>
                                    <div className='row px-1'>
                                        <div className='col-6'>
                                            <h3 className="text-muted mb-3">{this.state.postType} Posts</h3>
                                        </div>
                                        <div className='col-6 text-right'>
                                        <div className="dropdown">
                                            <button className="btn btn-secondary dropdown-toggle" id="filterDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                filter
                                            </button>

                                            <ul className="dropdown-menu" aria-labelledby="filterDropdown">
                                                <li className="dropdown-item">
                                                    <div >
                                                        <h5>Views / Likes</h5>
                                                        <div>
                                                            <form>
                                                                <div className="form-group">
                                                                    <label htmlFor="minRange">min {this.props.ui.minRange}</label>
                                                                    <input
                                                                        type="range"
                                                                        className="form-control-range"
                                                                        name="minRange"
                                                                        min={25000}
                                                                        step={25000}
                                                                        max={this.props.ui.maxRange}
                                                                        value={this.props.ui.minRange}
                                                                        onChange={this.handleInputChange}
                                                                    />
                                                                    <label htmlFor="maxRange">max {this.props.ui.maxRange}</label>
                                                                    <input
                                                                        type="range"
                                                                        className="form-control-range"
                                                                        name="maxRange"
                                                                        min={this.props.ui.minRange}
                                                                        step={25000}
                                                                        max={20000000}
                                                                        value={this.props.ui.maxRange}
                                                                        onChange={this.handleInputChange}
                                                                    />
                                                                </div>
                                                            </form>
                                                        </div>
                                                    </div>
                                                </li>
                                                <li className="dropdown-item">Category</li>
                                                <div className='d-inline-flex resetbutton'>
                                                    <button className='btn dropdown-item'  onClick={()=>{this.resetFilters()}}>Reset</button>
                                                    <button className='btn dropdown-item' onClick={()=>this.submitFilters()}>Done</button>
                                                </div>
                                                
                                            </ul>
                                        

                                            {/* <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                                <a className="dropdown-item" href="#">Action</a>
                                                <a className="dropdown-item" href="#">Another action</a>
                                                <a className="dropdown-item" href="#">Something else here</a>
                                            </div> */}
                                            </div>
                                            
                                        </div>
                                    </div>
                                    
                                    <div style={{'height':900, overflow: 'auto' }}>
                                    <InfiniteScroll
                                    pageStart={1}
                                    loadMore={this.loadMore}
                                    hasMore={this.props.scrapedPosts.hasMore}
                                    loader={<div style={{}} className="loader" key={0}>Loading ...</div>}
                                    useWindow={false}
                                    >
                                    
                                    <List>
                                        { <Card key={this.props.scrapedPosts.filteredResults.id} results={this.props.scrapedPosts.filteredResults} savePost={this.savePost} 
                                        
                                         savedStyle={this.state.savedStyle} 
                                        />}
                                    </List>
                                    </InfiniteScroll>
                                    <Modal
                                    key={this.props.scrapedPosts.filteredResults.id}
                                    mappedModal={this.props.scrapedPosts.filteredResults}></Modal>
                                    </div>
                                </div>}                  
                            </div>
                        </div>
                        <div className=''>
                    
                        </div>
                    </div>
                    
            </div>
           </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        isSignedIn: state.auth.isSignedIn, 
        userData: state.auth.authData,
        ui: state.ui,
        scrapedPosts: state.scrapedPosts
    }
}; 

const mapDispatchToProps = dispatch => {
    return{
        getUserData: (token) => dispatch(getUserData(token)),
        getScrapedPosts: () => dispatch(getScrapedPosts()),
        loadMoreCounts: () => dispatch(loadMoreCounts()),
        loadMoreAll: () => dispatch(loadMoreAll()),
        loadMoreVid: () => dispatch(loadMoreVid()),
        loadMoreImg: () => dispatch(loadMoreImg()),
        resetCount: () => dispatch(resetCount()),
        setRange: (name, value) => dispatch(setRange(name, value)),
        resetRange: () => dispatch(resetRange()),
        logout: () => dispatch(logout())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
