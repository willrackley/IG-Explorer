import React, { Component } from "react";
import Nav from '../components/Nav/nav'
import { connect } from "react-redux";
import { IoMdPerson } from 'react-icons/io';
import { IoIosAdd } from 'react-icons/io'
import { Link, Redirect } from "react-router-dom"
import axios from "axios";
import { getUserData, logout } from '../actions'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';


class adminPage extends Component {
    mounted = false;
    state = {
        influencers: [],
        name: "",
        igName: "",
        genre: "",
        isLoading: false,
        isLoadingButton: false,
        errorMsg: "",
    }

    

    componentDidMount(){
        this.mounted = true;
        this.getInfluencerList();
    }

    componentWillUnmount() {
       this.mounted = false
    }

    getInfluencerList = () => {
        this.setState({
            isLoading: true
        })
        axios.get('/api/influencers')
        .then(res => {
            if (this.mounted) {
                this.setState({
                    influencers: res.data,
                    isLoading: false
                })
                console.log(res.data)
            }
        })
    }

    addInfluencer = (igName, name, genre) => {
        this.setState({
            isLoadingButton: true,
            errorMsg:""
        })
        let artist = { igName: igName, name: name, type: genre}

        axios.get(`/api/scrape/${igName}`)
        .then(res => { 
            console.log(res.data)
            if (res.data !== 'error') {
                axios.post('/api/influencers/post', artist)
                .then(res => {
                    this.getInfluencerList()
                    this.setState({
                        isLoadingButton: false,
                        name: "",
                        igName: "",
                        genre: ""
                    })
                    console.log(res.data)
                })
            } else {
                this.setState({
                    errorMsg: "Did not find a IG user with that name",
                    name: "",
                    igName: "",
                    genre: "",
                    isLoadingButton: false
                })
            }
        })
        
    }

    handleInputChange = (event) => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    }

    deleteSavedInfluencer = (id, name) => {
        confirmAlert({
            title: `remove ${name} from the list?`,
            message: '',
            buttons: [
              {
                label: 'Yes',
                onClick: () => {
                    axios.put(`api/influencers/deleteinfluencer/${id}`)
                    .then(res => {
                        this.getInfluencerList();
                        console.log(res.data)
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

    render() {
        if (!this.props.auth.isSignedIn) {
            return <Redirect to='/'/>
        }
        return (
            <div>
                <Nav>
                    <div className="nav-item collapse navbar-collapse" id="navbarSupportedContent">
                        <a className="nav-link ml-auto dropdown-toggle" href="/" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <IoMdPerson></IoMdPerson>
                        </a>
                        <div className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                            <Link className="dropdown-item" to="/">Home</Link>
                            <Link className="dropdown-item" to="/savedPosts">Saved Posts</Link>
                            <Link className="dropdown-item" to="/customSearch">Custom Search</Link>
                            <button className="dropdown-item" onClick={() => this.props.logout()} >Log Out</button>
                        </div>
                    </div> 
                </Nav>
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 col-sm-12">
                            {this.state.isLoading ? <div className='text-center'><div className="spinner-border spinner-border-sm" role="status">
                                <span className="sr-only">Loading...</span>
                            </div></div> : 
                            <table className="table">
                                <thead>
                                    <tr>
                                    <th scope="col"></th>
                                    <th scope="col">#</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">IG Name</th>
                                    <th scope="col">Genre</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.influencers.map(((result,index) => (
                                        <tr key={result._id}>
                                            <th scope="row"><button className="btn btn-secondary" onClick={()=> this.deleteSavedInfluencer(result._id, result.name)}>&times;</button></th>
                                            <td>{index +1}</td>
                                            <td>{result.name}</td>
                                            <td>{result.igName}</td>
                                            <td>{result.type}</td>
                                        </tr>
                                    )))}
                                </tbody>
                            </table>}
                        </div>
                        <div className="col-md-4 col-sm-12">
                            <h3>Add an influencer</h3>
                                <form  onSubmit={(event) => {event.preventDefault(); }}>
                                    <div className="input-group mb-3">
                                        <input
                                        type="text"
                                        className="form-control"
                                        placeholder="name"
                                        aria-label="name"
                                        name="name"
                                        value={this.state.name}
                                        onChange={this.handleInputChange}
                                        />
                                    </div>

                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" id="basic-addon1">@</span>
                                        </div>
                                        <input
                                        type="text"
                                        className="form-control"
                                        placeholder="IG name"
                                        aria-label="IGname"
                                        aria-describedby="basic-addon1"
                                        name="igName"
                                        value={this.state.igName}
                                        onChange={this.handleInputChange}
                                        />
                                    </div>

                                    <div className="input-group">
                                        <div>
                                        <select name="genre" value={this.state.genre} onChange={this.handleInputChange}>
                                                <option label="Select a genre">Select a genre</option>
                                                <option value="Rap">Rap</option>
                                                <option value="R&B">R&B</option>
                                                <option value="Pop">Pop</option>
                                                <option value="Country">Country</option>
                                                <option value="EDM">EDM</option>
                                        </select>
                                        </div>
                                    </div>
                                    
                                    <div className="my-2 text-danger">
                                        {this.state.errorMsg}
                                    </div>
                                    <button disabled={!this.state.genre || !this.state.igName || !this.state.name}className="btn btn-secondary" onClick={()=>this.addInfluencer(this.state.igName, this.state.name, this.state.genre)}>{this.state.isLoadingButton ? <div className='text-center'><div className="spinner-border spinner-border-sm" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div></div> : <IoIosAdd size={20}/>}</button>
                                </form>
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
    }
}; 

const mapDispatchToProps = dispatch => {
    return{
        getUserData: (token) => dispatch(getUserData(token)),
        logout: () => dispatch(logout())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(adminPage);