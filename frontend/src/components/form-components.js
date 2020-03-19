import React from 'react';
import EmojiKeyboard, {EmojiPasswordGenerator} from './emoji-keyboard.js';
//import EmojiPasswordGenerator from './components/emoji-string-generator.js'
const request_path = "0.0.0.0:8000/"

export class FormSubmitResponse extends React.Component{
    render(){
        return <div className={"message-box message-"+this.props.status}>{this.props.message}</div>
    }
}

export class PasswordForm extends React.Component{
    constructor(props){
        super(props);
        this.status_message = {
            success: "Success. Thank you for your participation",
            fail: "That password was incorrect. Please try again."
        }
        this.state = {
            status:null
        }
    }
    submitAction(e){
        const component = this
        e.preventDefault();
        const {id,url} = this.props;
        var form = document.querySelector('#'+id);
        var form_data = {
            username:form.elements['username'].value,
            password:form.elements['password'].value
        }
        console.log(form_data)
        const xhr = new XMLHttpRequest();
        xhr.open('POST',url);
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
            {status!=null?<FormSubmitResponse status={status} message={this.status_message[status]} /> : ""}
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
    render(){
        const {submitAction, disabled} = this.props;
        return (<div className="row">
            <form  id="new-user-form"  onSubmit={submitAction} className="form newUserForm" autoComplete="off">
            <h2 id="new-user-title" className="form-title">Create Identity</h2>
                <div className="form-cluster">
                    <label htmlFor="new-username-field">Username</label>
                    <input name="username" id="new-username-field" type="text" readOnly={disabled}  autoComplete="off"/>
                </div>
                <EmojiPasswordGenerator passLength="4" disabled={disabled}/>
            </form>
        </div>);
    }
}

export class CreateAndPracticePage extends React.Component{
    submitNewUser(e){
        e.preventDefault();
        // const {id,url} = this.props;
        var form = document.querySelector('#new-user-form');
        var form_data = {
            username:form.elements['username'].value,
            password:form.elements['password'].value
        }
        console.log(form_data)
        this.setState({practice:true})
        // const xhr = new XMLHttpRequest();
        // xhr.open('POST',url);
        // xhr.setRequestHeader('Content-Type','application/json')
        // xhr.onload = function(){
        //     if(xhr.status==200){
        //         this.setState({status:'success'})
        //         this.setState({disabled:true})
        //     }else if(xhr.status == 400){
        //         this.setState({status:'fail'})
        //     }else{
        //         this.setState({status:null});
        //         alert("It's not you, it's us. Something went wrong when submitting. You received error: "+xhr.status);
        //     }
        // }
        // xhr.send(JSON.Stringify(form_data));
    }
    constructor(props){
        super(props)
        this.state = {
            practice:false
        }
    }
    render(){
        const {practice} = this.state
        return(
            <div className="container">
                <NewUserForm submitAction={this.submitNewUser.bind(this)} disabled={practice}/>
                {practice?<PasswordForm id="password-form" title="Practice Login"/>:''}
            </div>
        )
    }
}
export class LoginPage extends React.Component{
    render(){
        return(
            <div className="container">
                <PasswordForm id="password-form" title="Login" />
            </div>
        )
    }
}

function App(){
    return (
        <CreateAndPracticePage/>
      );
}

//
// function App() {
//   return (
//     <div className="container">
//         <div className="row">
//             <EmojiPasswordGenerator passLength="4"/>
//         </div>
//         <div className="row">
//             <PasswordForm id="password-form" />
//         </div>
//     </div>
//   );
// }
//

export default App;
