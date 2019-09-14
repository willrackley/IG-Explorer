import React from 'react'
import './style.css'
import AuthModal from '../AuthModal';
import { Link } from "react-router-dom"
import { IoIosMusicalNotes } from "react-icons/io";

function navbar(props) {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white">
            <div className='container'>
                <Link className="navbar-brand mt-1" to="/"><h3><IoIosMusicalNotes/> | <span>Clout Explorer</span></h3></Link>
                {/* <a className="navbar-brand" href="/"><h3 className=''>Clout Explorer</h3></a> */}
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                {props.children}
            </div>
            <AuthModal/>
        </nav>
        
    )
}

export default navbar;