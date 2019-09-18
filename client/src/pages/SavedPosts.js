import React, { Component } from "react";
import Nav from '../components/Nav/nav'
import List from '../components/List';
import SavedPostCard from '../components/SavedPostCard/savedPostCard'
import { connect } from "react-redux";
import { IoMdPerson } from 'react-icons/io';
import { Link, Redirect } from "react-router-dom"
import Axios from "axios";
import Modal from "../components/SavedPostModal/savedModal"
import { getUserData, authSetToken, logout } from '../actions'


class savedPosts extends Component {
    state = {
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

    deleteSavedPost = (postId) => {
        postId = { postId: postId }
        Axios.put(`api/users/deleteSavedPost/${this.props.auth.userData.id}`, postId)
        .then(res => {
            this.props.getUserData({ headers: {Authorization: `JWT ${this.props.auth.token}` }})
        })
    }

    logOut = () => {
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
                            <Link className="dropdown-item" to="/customSearch">Custom Search</Link>
                            {this.props.auth.userData && this.props.auth.userData.admin ? <Link className="dropdown-item" to="/admin">Admin</Link> : <span></span>}
                            <button className="dropdown-item" onClick={() => this.logOut()} >Log Out</button>
                        </div>
                    </div> 
                </Nav>
                <div className="container">
                    {this.props.auth.userData.favorites.length ? 
                    <div className="mb-5">
                    <h3 className="text-muted mt-5 mb-2">Saved Posts</h3>
                    <List>
                        { <SavedPostCard key={this.props.auth.userData.favorites.postId} savedResults={this.props.auth.userData.favorites} deleteSavedPost={this.deleteSavedPost}/>}
                    </List> 
                    <Modal
                    key={this.props.auth.userData.favorites.postId}
                    mappedModal={this.props.auth.userData.favorites}>
                    </Modal>
                    </div>: <h3 className=" mt-5 text-center text-muted">You dont have any saved posts.</h3>}
                </div>
                
            </div>
        )
       
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
    }
}; 

const mapDispatchToProps = dispatch => {
    return{
        getUserData: (token) => dispatch(getUserData(token)),
        authSetToken: (token) => dispatch(authSetToken(token)),
        logout: () => dispatch(logout())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(savedPosts);