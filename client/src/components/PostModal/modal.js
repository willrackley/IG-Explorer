import React from "react";
import './style.css'
//import axios from "axios";
//let postRes;

class modal extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            isOpen: false
        };
    }

    componentDidMount(){
        //console.clear()
    
    }

    

    getFrame = (newModal) => {
     
    }

    render(){
        
        return (
            <div>
                {this.props.mappedModal.map(newModal => (
                <div key={newModal.id || newModal.postId} className="modal fade" id={`myModal${newModal.id}`} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" >
                <div className="modal-dialog modal-dialog-scrollable" role="document">
                    <div className="modal-content">
                        <div className="modal-header" >
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className=" iframeParent embed-responsive embed-responsive-1by1 z-depth-1-half">
                                {newModal.username ? <iframe title={newModal.username} className="embed-responsive-item" src={`https://www.instagram.com/p/${newModal.shortcode}/embed/`} ></iframe> : <iframe title={newModal.owner.username} className="embed-responsive-item" src={`https://www.instagram.com/p/${newModal.shortcode}/embed/`} ></iframe>}
                                
                               
                            </div>   
                        </div>
                        <div className="modal-footer">
                            <a href={`https://www.instagram.com/p/${newModal.shortcode}`} className="btn" target="_blank" rel="noopener noreferrer"> view post </a>
                        </div>
                    </div>
                </div>
                </div>
                ))
            }
            </div>
        )
    }
}
        
 export default modal;           