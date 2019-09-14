import React from "react";
import { IoIosCamera } from "react-icons/io";
import { IoIosVideocam } from "react-icons/io";
import "./style.css";

export default function savePostCards(props) {
    return (
        <div className="card-deck p-1">
            {props.savedResults.map(result => (
            <div className="savedPostCards card mt-2" style={{ minWidth: '18rem' }} key={result.postId} >

                <div className="text-right font-weight-bold" ><button onClick={()=>props.deleteSavedPost(result.postId)} className="btn pr-3" >&times;</button></div>
                
                {result.video ? <div className="p-3 card-title title"><div className='row'><div className='col-10'><span className='pt-1 font-weight-bold'>{`@${result.username}`}</span></div><div className='col-2 text-right'><span className=''><IoIosVideocam size={30}/></span></div></div></div> : <div className="p-3 card-title title"><div className='row'><div className='col-10'><span className='pt-1 font-weight-bold'>{`@${result.username}`}</span></div><div className='col-2 text-right'><span className=''><IoIosCamera size={30}/></span></div></div></div>}
                
                <a className="btn" data-toggle="modal" href={`https://www.instagram.com/p/${result.shortcode}`}   data-target={`#myModal${result.id}`} onClick={()=> { setTimeout(()=>console.clear(), 5000)}}>
                    <img  className="card-img-top" src={result.imageUrl} alt={`post by ${result.username}`}/>
                </a>
                <div className="card-body">
                    {
                        result.video ?
                        <div><span className="font-weight-bold">{result.views}</span> views</div> :
                        <div>Liked by <span className="font-weight-bold">{result.likes}</span> others</div>
                    }
                    <span><span className="font-weight-bold">{result.username}</span>
                    {` ${result.caption}`}</span> 
                </div>
            </div>
            ))} 
        </div>
    )
}