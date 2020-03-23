import React from 'react';
import './App.css';
import {LoginPage,CreateAndPracticePage} from './components/form-components.js';

class App extends React.Component{
  constructor(props){
    super(props)
    this.state={
      status:""
    }
  }
  setCreate(){
    this.setState({status:"create"});
  }
  setLogin(){
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
