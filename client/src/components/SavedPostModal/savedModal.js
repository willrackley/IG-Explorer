import React from "react";
import './style.css'


class savedModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            isOpen: false
        };
    }

    componentDidMount(){
        //console.clear()
    
    }

    stopVideo = (id,index) => {
       let iframe = document.getElementsByClassName("embed-responsive-item");
       iframe[index].src = `https://www.instagram.com/p/${id.shortcode}/embed/`
    }

    render(){
        window.$(document).ready(function(){
            //stops the video from playing in the background upon closing the modal
            window.$(".myModal").on('hidden.bs.modal', function(){
                let iframeSrc = this.children[0].children[0].children[1].children[0].children[0].src;
                this.children[0].children[0].children[1].children[0].children[0].src = iframeSrc;
            });
        });
 
        return (

            <div>
                {this.props.mappedModal.map((newModal,index) => (
                
                <div key={newModal.postId} className="modal myModal fade" id={`myModal${newModal.postId}`} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" >
                <div className="modal-dialog modal-dialog-scrollable" role="document">
                    <div className="modal-content">
                        <div className="modal-header" >
                            <button  onClick={()=> this.stopVideo(newModal,index)}type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className=" iframeParent embed-responsive embed-responsive-1by1 z-depth-1-half">
                                <iframe id={`video${newModal.id}`} title={newModal.username} className="embed-responsive-item" src={`https://www.instagram.com/p/${newModal.shortcode}/embed/`} ></iframe> 
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
        
 export default savedModal;           