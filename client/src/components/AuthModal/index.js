import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { tryAuth, authResetState, getScrapedPosts, resetCount } from "../../actions/"
import './style.css'



class authModal extends Component {
    state = {
        authMode: "Sign In",
        email: "",
        password: "",
        confirmPassword: "",
        conPassErrMsg: "",
        passErrMsg: <small>Passwords must be at least 6 characters.</small>,
        emailErrMsg:"",
        signInErrMsg: "",
        isLoading: false,
        signUpSuccess: false
    }

    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    };

    handleSignupSubmit = () => {
        this.setState({
            conPassErrMsg: "",
            passErrMsg: <small>Passwords must be at least 6 characters.</small>,
            emailErrMsg:"",
            isLoading: true
        })
        let newUser = {
            email: this.state.email.toLowerCase(),
            password: this.state.password.toLowerCase(),
            password2: this.state.confirmPassword.toLowerCase()
        }

        let newUserSignIn = {
            email: this.state.email.toLowerCase(),
            password: this.state.password.toLowerCase(),
        }

        if (newUser.email.match(/.+@.+\..+/) === null){
            this.setState({ emailErrMsg: <div className='text-danger'>Please enter a valid email address.</div>})
        }
        axios.post("api/users/signup", newUser)
        .then(async res => {
            console.log(res.data[0])
            if(res.data[0].for === "confirm password") {
                this.setState({ conPassErrMsg: <div className='text-danger'>{res.data[0].msg}</div>})
            }
            if(res.data[0].for === "password") {
                this.setState({ passErrMsg: <div className='text-danger'>{res.data[0].msg}</div>})
            }
            if(res.data[0].for === "email") {
                this.setState({ emailErrMsg: <div className='text-danger'>{res.data[0].msg}</div>})
            }
            if(res.data[0].type === "success") {
                await this.props.onTryAuth(newUserSignIn)
                await new Promise((resolve, reject) => setTimeout(resolve, 1000));
                this.props.resetCount();
                window.$('#authModal').modal('hide');
                this.setState({ isLoading: false});
                this.props.getScrapedPosts();
            }
        })
    }

    async handleSignInSubmit () {
        
        this.setState({ 
            signInErrMsg: "",
            isLoading: true
        });
       
        const user = {
            email: this.state.email.trim().toLowerCase(),
            password: this.state.password.trim().toLowerCase()
        }

        await this.props.onTryAuth(user)
        await new Promise((resolve, reject) => setTimeout(resolve, 1000));
        
        if(this.props.isSignedIn){
            this.props.resetCount();
            window.$('#authModal').modal('hide');
            this.setState({ isLoading: false});
            this.props.getScrapedPosts();
        } else {
            this.setState({ signInErrMsg: <div className='text-danger mb-2'>Whoops! looks like something went wrong, please try agin.</div> });
            this.props.onResetAuthState();
            this.setState({ isLoading: false})
        }
       
        
    }

    switchAuthUp = () => {
        this.setState({ authMode: "Sign Up" })
        
    }

    switchAuthIn = () => {
        this.setState({ authMode: "Sign In" })
    }

    render(){
        
        //initially set for sign in
        let mainHeadingText = <h2 className='mb-5 mt-4 text-center'>Sign-In</h2>;
        let footerText = (
            <div className="modal-footer d-flex justify-content-center">
                <p className='pt-3'>Don't have an account yet?</p>
                <button className='btn switchBtn' onClick={()=>this.switchAuthUp()}>Sign Up</button>          
            </div>
        )
        let signUpPage = (
            <div className='container '>
                {mainHeadingText}
                <form>
                    <div className='form-group'>
                        <label className='font-weight-bold' htmlFor="email">Email</label>
                        <input
                            type="email" 
                            className="form-control" 
                            value={this.state.email}
                            onChange={this.handleInputChange}
                            name="email"
                            placeholder="Email" 
                        />
                    </div>
                    <div className='form-group'>
                        <label className='font-weight-bold' htmlFor="password">Password</label>
                        <input
                            type="password" 
                            className="form-control" 
                            value={this.state.password}
                            onChange={this.handleInputChange}
                            name="password"
                            placeholder="password" 
                        />
                    </div>
                </form>
                {this.state.signInErrMsg}
                <div className='text-center mb-5'>
                    {this.state.isLoading ? <button className='btn btn-primary'><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span></button> : <button disabled={!this.state.email || !this.state.password} className='btn signinBtn' onClick={()=> this.handleSignInSubmit()}>Sign-In</button>}
                </div>
            </div>
        )

        //for sign up page
        if (this.state.authMode === "Sign Up") {
            mainHeadingText = <h2 className='mb-5 mt-4 text-center'>Create account</h2>;
            signUpPage = (
            <button className='btn' onClick={()=>this.switchAuthIn()}>Sign In</button>
            )
            signUpPage = (
                <div className='container '>
                    {mainHeadingText}
                    <form>
                        <div className='form-group'>
                            <label className='font-weight-bold' htmlFor="email">Email</label>
                            <input
                                type="email" 
                                className="form-control" 
                                value={this.state.email}
                                onChange={this.handleInputChange}
                                name="email"
                                placeholder="Email" 
                            />
                            {this.state.emailErrMsg}
                        </div>
                        <div className='form-group'>
                            <label className='font-weight-bold' htmlFor="password">Password</label>
                            <input
                                type="password" 
                                className="form-control" 
                                value={this.state.password}
                                onChange={this.handleInputChange}
                                name="password"
                                placeholder="password" 
                            />
                            {this.state.passErrMsg}
                        </div>
                        <div className='form-group'>
                            <label className='font-weight-bold' htmlFor="confirmPassword">Re-enter password</label>
                            <input
                                type="password" 
                                className="form-control" 
                                value={this.state.confirmPassword}
                                onChange={this.handleInputChange}
                                name="confirmPassword"
                                placeholder="confirm password" 
                            />
                            {this.state.conPassErrMsg}
                        </div>
                    </form>
                    <div className='text-center mb-5'>
                    {this.state.isLoading ? <button className='btn btn-primary'><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span></button> : <button disabled={!this.state.email || !this.state.password || !this.state.confirmPassword} className='btn signinBtn' onClick={()=> this.handleSignupSubmit()}>Sign-Up</button>}
                    </div>
                </div>
            )
            footerText = (
                <div className="modal-footer d-flex justify-content-center">
                    <p className='pt-3'>Already have an account?</p>
                    <button className='btn switchBtn' onClick={()=>this.switchAuthIn()}>Sign In</button>          
                </div>
            )
        }

   

        return(
            <div className="modal fade" tabIndex="-1" role="dialog" id="authModal" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        {/* <h5 className="modal-title"></h5> */}
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body h-75 d-flex align-items-center ">
                        {signUpPage}
                    </div>
                    {footerText}
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        isSignedIn: state.auth.isSignedIn, 
    }
}; 

const mapDispatchToProps = dispatch => {
    return{
        onTryAuth: (authData) => dispatch(tryAuth(authData)),
        onResetAuthState: () => dispatch(authResetState()),
        getScrapedPosts: () => dispatch(getScrapedPosts()),
        resetCount: () => dispatch(resetCount())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(authModal);