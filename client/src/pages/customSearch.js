/* eslint-disable no-loop-func */
import React, { Component } from "react";
import Nav from '../components/Nav/nav';
import axios from 'axios';
import List from '../components/List';
import Modal from '../components/PostModal/modal';
import { connect } from "react-redux";
import { IoMdPerson } from 'react-icons/io';
import { IoIosSearch } from 'react-icons/io'
import { IoIosAdd } from 'react-icons/io'
import { Link, Redirect } from "react-router-dom";
import Card from '../components/Card/card'
import { getUserData, logout, setRange, resetRange, authSetToken } from '../actions'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
let allResultsArr = [];

class customSearch extends Component {
    state = {
        usernameInput: "",
        GSusernameInput: "",
        filteredResults: [],
        isLoading: false,
        isLoadingInflSearch: false,
        isLoadingGroupSearch: false,
        isGroupSearch: false,
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
        inflErrorMessage: "",
        searchErrorMessage: "",
        signedIn: false
    }

    componentWillMount(){
        let jwt = localStorage.getItem('jwt');
        
        if (jwt) {
            this.props.authSetToken(jwt)
            this.props.getUserData({ headers: {Authorization: `JWT ${jwt}` }})
            setTimeout(this.setState({signedIn: true}),1000)
        } else {
           return
        } 
    }

    componentDidMount(){
       
    }

    handleInputChange = (event) => {
        
        const { name, value } = event.target;

        if (name === "usernameInput" || name === "GSusernameInput") {
            this.setState({
                [name]: value
            });
        } else {
            this.props.setRange(name, value)
        }
    }

    submitSearch = ()=> {
        this.setState({ isLoading: true })
        axios.get(`/api/scrape/${this.state.usernameInput}`)
        .then(res => {
            if (res.data !== 'error') {
                this.setState({
                    filteredResults: res.data,
                    searchErrorMessage:"",
                    isLoading: false
                })
            } else {
                this.setState({
                    searchErrorMessage: "We could not find a user by that name, please try again.",
                    isLoading: false,
                    filteredResults: []
                })
            }
            console.log(res.data)
        })
    }

    savePost = async (video, username, id, url, imageUrl, views, likes, caption,index) => {
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

    addCSInfluencer = event => {
        //check if user is valid
        //event.preventDefault();
        this.setState({ isLoadingInflSearch: true })
        axios.get(`/api/scrape/${this.state.GSusernameInput}`)
        .then(res => {
            console.log(res.data)
            let searchedUser = { influencer: this.state.GSusernameInput }
            if (res.data !== 'error') {
                axios.put(`api/users/saveGroupedInfluencer/${this.props.auth.userData.id}`, searchedUser)
                .then(GIresponse => {
                    console.log(GIresponse.data)
                    if(GIresponse.data[0].msg ===  "You already saved this influencer.") {
                        this.setState({
                            isLoadingInflSearch: false,
                            inflErrorMessage: GIresponse.data[0].msg,
                            GSusernameInput: ""
                        })
                    } else {
                        this.props.getUserData({ headers: {Authorization: `JWT ${this.props.auth.token}` }})
                        this.setState({
                            isLoadingInflSearch: false,
                            inflErrorMessage: "",
                            GSusernameInput: ""
                        })
                    }
                })
            } else {
                this.setState({
                    inflErrorMessage: "We could not find a user by that name, please try again.",
                    isLoadingInflSearch: false,
                })
            }
        })
    }

    deleteSavedInfluencer = (influencer) => {
        influencer = { influencer: influencer }
        confirmAlert({
            title: `remove ${influencer.influencer} from your list?`,
            message: '',
            buttons: [
              {
                label: 'Yes',
                onClick: () => {
                    axios.put(`api/users/deleteGroupedInfluencer/${this.props.auth.userData.id}`, influencer)
                    .then(res => {
                        this.props.getUserData({ headers: {Authorization: `JWT ${this.props.auth.token}` }})
                    })
                }
              },
              {
                label: 'No',
                onClick: () => { return; }
              }
            ]
          });
    }

    gatherGroupSearchPosts = () => {
        allResultsArr = []
        this.setState({ 
            isLoadingGroupSearch: true,
            isLoading: true,
            usernameInput: "",
            GSusernameInput: ""
        })
        for(let i = 0; i < this.props.auth.userData.influencers.length; i++) {
            axios.get(`/api/scrape/${this.props.auth.userData.influencers[i].influencer}`)
            .then(res => {
                if(res.data !== 'error') {
                    for(let j = 0; j < res.data.length; j++) {
                        if ((res.data[j].is_video && res.data[j].video_view_count >= this.props.ui.minRange && res.data[j].video_view_count <= this.props.ui.maxRange) || (!res.data[j].is_video && res.data[j].edge_liked_by.count >= this.props.ui.minRange && res.data[j].edge_liked_by.count <= this.props.ui.maxRange)) {
                            allResultsArr.push(res.data[j])
                        }
                    }
                }
            })
        }
    }
     
    groupSearch = async() => {
        
        await this.gatherGroupSearchPosts()
        await new Promise((resolve, reject) => setTimeout(resolve, 2000));
        this.setState ({
            filteredResults: allResultsArr,
            isLoadingGroupSearch: false,
            isLoading: false,
            isGroupSearch: true
        })
        console.log(allResultsArr)
    }

    submitFilters = () => {
        this.groupSearch();
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
                // this.props.resetCount()
                // this.props.getScrapedPosts()
            }
          },
          {
            label: 'No',
            onClick: () => { return; }
          }
        ]
      });
    }

    logout = () => {
        this.props.logout()
        this.setState({ signedIn: false })
    }

    render() {

        if (!this.state.signedIn) {
            return <Redirect to="/"/>
        }

        return (
            <div>
                <Nav>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <a className="nav-link ml-auto dropdown-toggle" href="/" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <IoMdPerson></IoMdPerson>
                        </a>
                        <div className="dropdown-menu dropdown-menu-lg-right  mr-lg-4" aria-labelledby="navbarDropdownMenuLink">
                            <Link className="dropdown-item" to="/">Home</Link>
                            <Link className="dropdown-item" to="/savedPosts">Saved Posts</Link>
                            {this.props.auth.userData && this.props.auth.userData.admin ? <Link className="dropdown-item" to="/admin">Admin</Link> : <span></span>}
                            <button className="dropdown-item" onClick={() => this.logout()} >Log Out</button>
                        </div>
                    </div> 
                </Nav>
                <div className="container">
                    <div className='row my-5'>
                        <div className='col-md-8 border-right col-sm-12'>
                            <h3 className="text-muted mb-3">Search</h3>
                            <form onSubmit={(event) => {event.preventDefault(); this.submitSearch();}}>
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon1">@</span>
                                    </div>
                                    <input
                                    type="text"
                                    className="form-control"
                                    placeholder="IGusername"
                                    aria-label="Username"
                                    aria-describedby="basic-addon1"
                                    name="usernameInput"
                                    value={this.state.usernameInput}
                                    onChange={this.handleInputChange}
                                    />
                                    <button 
                                    disabled={!this.state.usernameInput}
                                    className="btn btn-primary"
                                    onClick={()=> this.submitSearch()}><IoIosSearch size={20}/></button>
                                </div>
                            </form>
                            <div className="text-danger">{this.state.searchErrorMessage}</div>
                            {this.state.isLoading ? <div className='text-center'><div className="spinner-border" role="status">
                                <span className="sr-only">Loading...</span>
                                </div></div> : 
                                <div className="mt-5">
                                    {this.state.isGroupSearch ? <div className='container'>
                                    <div className='row px-1'>
                                        <div className='col-6'>
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
                                                {/* <li className="dropdown-item">Category</li> */}
                                                <div className='d-inline-flex resetbutton'>
                                                    <button className='btn dropdown-item'  onClick={()=>{this.resetFilters()}}>Reset</button>
                                                    <button className='btn dropdown-item' onClick={()=>this.submitFilters()}>Done</button>
                                                </div>
                                                
                                            </ul>
                                            </div>
                                            </div>
                                        </div>
                                    </div> : <div></div>}
                                    
                                    <List>
                                        { <Card key={this.state.filteredResults.id} results={this.state.filteredResults} savePost={this.savePost} 
                                        savedStyle={this.state.savedStyle} 
                                        />}
                                    </List>
                                    <Modal
                                        key={this.state.filteredResults.id}
                                        mappedModal={this.state.filteredResults}>
                                    </Modal>
                                </div>}
                        </div>
                        <div className='col-md-4 col-sm-12'>
                            <div className="text-right">
                                <h3 className="text-muted mb-3"> Custom Group Search</h3>
                                <div className="mb-2 text-muted">Add an influencer to your list</div>
                                <form  onSubmit={(event) => {event.preventDefault(); }}>
                                <div className="input-group mb-3">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon1">@</span>
                                    </div>
                                    <input
                                    type="text"
                                    className="form-control"
                                    placeholder="IGusername"
                                    aria-label="Username"
                                    aria-describedby="basic-addon1"
                                    name="GSusernameInput"
                                    value={this.state.GSusernameInput}
                                    onChange={this.handleInputChange}
                                    />
                                    <button className="btn btn-primary" onClick={()=>this.addCSInfluencer()}>{this.state.isLoadingInflSearch ? <div className='text-center'><div className="spinner-border spinner-border-sm" role="status">
                                    <span className="sr-only">Loading...</span>
                                    </div></div> : <IoIosAdd size={20}/>}</button>
                                </div>
                            </form>
                                <div className="text-danger mb-2">
                                    {this.state.inflErrorMessage}
                                </div>
                                <div className="border mb-3" style={{height: 300}}>
                                    <List>
                                        {this.props.auth.userData.influencers.map((result => (
                                        <div key={result.influencer} className="text-left p-1 ml-1">                    {result.influencer}
                                            <button className="btn btn-primary" onClick={() => this.deleteSavedInfluencer(result.influencer)}>&times;</button>
                                        </div>)))}
                                    </List>
                                </div>
                                <button onClick={() => this.groupSearch()} className="btn btn-primary">{this.state.isLoadingGroupSearch ? <div className='text-center'><div className="spinner-border spinner-border-sm" role="status">
                                    <span className="sr-only">Loading...</span>
                                    </div></div> : "Search Group"}</button>
                            </div>
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
        ui: state.ui
    }
}; 

const mapDispatchToProps = dispatch => {
    return{
        getUserData: (token) => dispatch(getUserData(token)),
        authSetToken: (token) => dispatch(authSetToken(token)),
        setRange: (name, value) => dispatch(setRange(name, value)),
        resetRange: () => dispatch(resetRange()),
        logout: () => dispatch(logout())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(customSearch);