import React from 'react';
import EmojiKeyboard, {EmojiPasswordGenerator} from './emoji-keyboard.js';
//import EmojiPasswordGenerator from './components/emoji-string-generator.js'
//eslint-disable-next-line
// const host = "134.117.132.42"

export class FormSubmitResponse extends React.Component{
    render(){

        return (
          <div className="form-row">
            {this.props.status ? <div className={"message-box message-"+this.props.status}>{this.props.message}</div>:""}
          </div>
        );
    }
}

export class PasswordForm extends React.Component{
    constructor(props){
        super(props);
        this.client_events=[];
        this.eventLogging("start",navigator.userAgent);
        this.status_message = {
            success: this.props.hasOwnProperty("successMsg") ? this.props.successMsg : "Success. Thank you for your participation",
            fail: "That password was incorrect. Please try again."
        }
        this.state = {
            status:null
        }
    }
    eventLogging(action,data){
      this.client_events.push({
        time:Date.now(),
        goal:this.props.goal,
        action:action,
        data:data
      });
    }
    submitAction(e){
        const component = this
        e.preventDefault();
        const {id,path} = this.props;
        var form = document.querySelector('#'+id);
        var form_data = {
            username:form.elements['username'].value,
            password:form.elements['password'].value
        }
        this.eventLogging("submit",`${form_data.password}(${form.elements['emoji_password'].value})`)
        form_data.client_events=this.client_events.splice(0,this.client_events.length);
        const xhr = new XMLHttpRequest();
        xhr.open('POST',path);
        xhr.setRequestHeader('Content-Type','application/json')
        xhr.onload = function(){
            if(xhr.status===200){
                component.setState({status:'success'})
            }else if(xhr.status === 401){
                component.setState({status:'fail'})
            }else{
                component.setState({status:null});
                alert("It's not you, it's us. Something went wrong when submitting. You received error: "+xhr.status);
            }
        }
        xhr.send(JSON.stringify(form_data));
    }
    render(){
        const {status} = this.state;
        const {id,title} = this.props;
        return (<div className="row">
            <form id={id}  onSubmit={this.submitAction.bind(this)} className="form passwordForm" autoComplete="off">
            <h2 id={id+"-title"} className="form-title">{title}</h2>
            <FormSubmitResponse status={status} message={this.status_message[status]} />
            <div className="form-cluster">
                <label htmlFor="login-username-field">Username</label>
                <input name="username" id="login-username-field" type="text"  autoComplete="off"/>
            </div>
            <EmojiKeyboard id="login-password-field" type="password"/>
            <div className="form-row">
                <button className="btn form-submit" type="submit">Submit</button>
            </div>
        </form>
    </div>);
    }
}

export class NewUserForm extends React.Component{
    constructor(props){
      super(props);
      this.props.eventLogging("start",navigator.userAgent);
    }

    render(){
        const {submitAction,eventLogging, disabled,msg,msgType} = this.props;
        return (<div className="row">
            <form  id="new-user-form"  onSubmit={submitAction} className="form newUserForm" autoComplete="off">
            <FormSubmitResponse status={msgType} message={msg}/>
            <h2 id="new-user-title" className="form-title">Create Identity</h2>
                <div className="form-cluster">
                    <label htmlFor="new-username-field">Username</label>
                    <input name="username" id="new-username-field" type="text" readOnly={disabled}  autoComplete="off"/>
                </div>
                <EmojiPasswordGenerator eventLogging={eventLogging}  passLength="4" disabled={disabled}/>
            </form>
        </div>);
    }
}

export class CreateAndPracticePage extends React.Component{

    constructor(props){
        super(props)
        this.client_events=[]
        this.state = {
            practice:false,
            respMsg:"",
            respType:null
        }
    }
    eventLogging(action,data){
      this.client_events.push({
        time:Date.now(),
        goal:"create",
        action:action,
        data:data
      })
    }
    submitNewUser(e){
        e.preventDefault();
        const that =this;
        var form = document.querySelector('#new-user-form');
        let password = form.elements['password'].value;
        let username = form.elements['username'].value;
        this.eventLogging("acceptPass",`${password}(${form.elements['emoji-password'].value})`)
        var form_data = {
            client_events:this.client_events.map((entry)=>{entry.uid = username; return entry}),
            username: username,
            password: password
        }
        const xhr = new XMLHttpRequest();
        xhr.open('POST',`create`);
        xhr.setRequestHeader('Content-Type','application/json')
        xhr.onload = function(){
            if(xhr.status===200){
                that.setState({
                  practice:true,
                  respType:"success",
                  respMsg:"User created. You can practice below or press cancel to return."
                })
                that.client_events.splice(0,that.client_events.length);
            }else if(xhr.status === 400){
                that.setState({
                  respType:"fail",
                  respMsg:"That username is already in use"
                })
                that.eventLogging("creation_fail","user-exists")
            }else{
                that.setState({
                  respType:"fail",
                  respMsg:"It's not you, it's us. Something went wrong when submitting. You received error: "+xhr.status
                });
                that.eventLogging("creation_fail","server-error")
            }
        }
        xhr.send(JSON.stringify(form_data));
    }
    render(){
        const {practice,respType,respMsg} = this.state;
        const {exitPage} = this.props;
        return(
            <div className="container">
                <NewUserForm
                  eventLogging={this.eventLogging.bind(this)}
                  submitAction={this.submitNewUser.bind(this)}
                  disabled={practice}
                  msg={respMsg}
                  msgType={respType}/>
                {practice?<PasswordForm
                      path="practice"
                      goal="create"
                      id="password-form"
                      successMsg="Successful practice. Hit cancel to return to login and try for real"
                      title="Practice Login"/>:''}
                <div className="row">
                  <button type="button"
                    className="btn btn-danger"
                    onClick={exitPage}>Cancel</button>
                </div>
            </div>
        )
    }
}
//eslint-disable-next-line
export class LoginPage extends React.Component{
    render(){
        return(
            <div className="container">
                <PasswordForm id="password-form" goal="login" path="login" title="Login" />
            </div>
        )
    }
}
