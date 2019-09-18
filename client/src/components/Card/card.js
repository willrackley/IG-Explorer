import React from "react";
import { IoIosCamera } from "react-icons/io";
import { IoMdHeart } from "react-icons/io";
import { IoIosVideocam } from "react-icons/io";
import { connect } from "react-redux";
import { getUserData } from '../../actions'
import "./style.css";

class cards extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedId: null,
            contId: [],
            saveBtnText: <div><span><IoMdHeart size={30}></IoMdHeart></span></div>
        }
    }
    
    componentDidMount() {
        setTimeout(()=>console.clear(), 5000) 
    }
    
    handleSaveBtn = (result,index) => {
        if(this.props.auth.isSignedIn && !this.props.auth.userData.style){
            if(result.edge_media_to_caption.edges.length === 0){
                this.props.savePost(result.is_video, result.owner.username, result.id, result.shortcode, result.display_url, result.video_view_count, result.edge_liked_by.count, "*Post has no caption*")
                this.setState({
                    selectedId: result.id,
                    saveBtnText: <div>Saved<span><IoMdHeart size={30}></IoMdHeart></span></div>
                })
        
                this.setState(prevState => {
                    return{
                        contId: [ ...prevState.contId, result.id],
                    } 
                })
                this.props.getUserData({ headers: {Authorization: `JWT ${this.props.auth.token}` }})
            } else if (result.edge_media_to_caption.edges[0].node.text) {
            this.props.savePost(result.is_video, result.owner.username, result.id, result.shortcode, result.display_url, result.video_view_count, result.edge_liked_by.count, result.edge_media_to_caption.edges[0].node.text,index)

            this.setState({
                selectedId: result.id,
                saveBtnText: <div>Saved<span><IoMdHeart size={30}></IoMdHeart></span></div>
            })
    
            this.setState(prevState => {
                return{
                    contId: [ ...prevState.contId, result.id],
                }
            })
            this.props.getUserData({ headers: {Authorization: `JWT ${this.props.auth.token}` }})
            } 
        }else {
            this.props.savePost()
        }
    }
    
    render() {
    return (
        <div className="card-deck p-1">
            {this.props.results.map((result,index) => (
            <div className="mainCards card mt-2 mb-5" style={{ minWidth: '16rem'}} key={result.id}  >
                {result.is_video ? <div className="p-3 card-title title"><div className='row'><div className='col-md-10 col-sm-12'><span className='pt-1 font-weight-bold'>{`@${result.owner.username}`}</span></div><div className='col-md-2 col-sm-12 '><span className=''><IoIosVideocam style={{color: "#428bca"}} size={30}/></span></div></div></div> : <div className="p-3 card-title title"><div className='row'><div className='col-md-10 col-sm-12'><span className='pt-1 font-weight-bold'>{`@${result.owner.username}`}</span></div><div className='col-md-2 col-sm-12 text-sm-lefts'><span className=''><IoIosCamera style={{color: "#428bca"}} size={30}/></span></div></div></div>}

                
                <div className='text-center'>
                    {result.edge_media_to_caption.edges[0] ? <button  className='btn heart' style={this.state.selectedId === result.id || result.style || this.state.contId.includes(result.id) ? {color: 'red'} : null} onClick={()=> this.handleSaveBtn(result,index)}>{this.state.selectedId === result.id || result.style || this.state.contId.includes(result.id) ? <span>Saved<IoMdHeart size={30}></IoMdHeart></span> : <span><IoMdHeart size={30}></IoMdHeart></span>}</button> : <button className='btn heart' style={this.state.selectedId === result.id || result.style || this.state.contId.includes(result.id) ? {color: 'red'} : null} onClick={()=> this.handleSaveBtn(result,index)}>{this.state.selectedId === result.id || result.style || this.state.contId.includes(result.id) ? <span>Saved<IoMdHeart size={30}></IoMdHeart></span> : <span><IoMdHeart size={30}></IoMdHeart></span>}</button>}
                </div>
                
                <a className="btn" data-toggle="modal" href={`https://www.instagram.com/p/${result.shortcode}`} onClick={()=> {setTimeout(()=>console.clear(), 5000) }}  data-target={`#myModal${result.id}`} >
                
                    <img  className="card-img-top" src={result.display_url} alt={`post by ${result.owner.username}`}/>
                </a>
                <div className="card-body">
                
                    {
                        result.is_video ?
                        <div><span className="font-weight-bold">{result.video_view_count}</span> views</div> :
                        <div>Liked by <span className="font-weight-bold">{result.edge_liked_by.count}</span> others</div>
                    }
                    {result.edge_media_to_caption.edges[0] ? <span><span className="font-weight-bold">{result.owner.username}</span>
                    {` ${result.edge_media_to_caption.edges[0].node.text}`}</span> : <span><span className="font-weight-bold">{result.owner.username}</span><span className="text-muted">{` *Post has no caption*`}</span></span>}
                    {/* <Button  data-toggle="modal" data-target={`#myModal${result.id}`}>
                    button
                </Button> */}
                </div>
            </div>

            ))} 
        </div>
    )
    }       
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        isSignedIn: state.auth.isSignedIn, 
        userData: state.auth.authData
    }
}; 

const mapDispatchToProps = dispatch => {
    return{
        getUserData: (token) => dispatch(getUserData(token)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(cards);

