import React from 'react';
import './App.css';
import {LoginPage,CreateAndPracticePage} from './components/form-components.js';
const CREATE_USER_EXPLANATION = `Creating a new user.

Before procedeing please be sure you have signed the neccesary consent forms.

Proceeding, you will be prompted to create three different passwords for three different mock-websites. Once you accept a password you can practice it before moving to the next. You cannot change a password once it has been accepted. Please continue through all three passwords.`
const LOGIN_EXPLANATION = `Logging In.

Before procedeing please be sure you have signed the neccesary consent forms.

With the same passwords you created before you will be asked to submit the correct password for each mock-website. The websites will be presented in a random order.
`
/*
    The app element allows the user to enter either create or login pages.
*/
class App extends React.Component{
  constructor(props){
    super(props)
    this.state={
      status:""
    }
  }
  setCreate(){
    alert(CREATE_USER_EXPLANATION)
    this.setState({status:"create"});
  }
  setLogin(){
    alert(LOGIN_EXPLANATION)
    this.setState({status:"login"});
  }
  exitPage(){
    this.setState({status:""});
  }
  render(){
    const {status} = this.state;
    return(
      <div className="container">
        {status ==="create"? <CreateAndPracticePage exitPage={this.exitPage.bind(this)}/> :
          (status==="login" ? <LoginPage exitPage={this.exitPage.bind(this)}/> : (
            <div className="card-modal">
              <div className="card-title">Login</div>
              <div className="card-body">
                <div className="button-col">
                  <button id="create-user-btn"
                    onClick={this.setCreate.bind(this)}
                    type="button" className="btn btn-xl">New User</button>
                  <button id="login-btn"
                    onClick={this.setLogin.bind(this)}
                    type="button" className="btn btn-xl">Login</button>
                </div>
              </div>
            </div>
            )
          )
        }
      </div>
    );
  }


}

export default App;
