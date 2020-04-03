import React from 'react';
import EmojiKeyboard, {EmojiPasswordGenerator} from './emoji-keyboard.js';
import './form-components.css';
//import EmojiPasswordGenerator from './components/emoji-string-generator.js'
//eslint-disable-next-line
// const host = "134.117.132.42"

const STORE_CONFIGS = [
    {
        name:"Banksy-ATM",
        id:"mr-banks",
        tag_line:"Deposit or withdraw your edgy street art",
    },
    {
        name:"Shopping Frands",
        id:"shop-frands",
        tag_line:"Wiw you shop wif mi?"
    },
    {
        name:"Kwazy Cupcakes!",
        id : "kwazy",
        tag_line:"The totally kwazy row-matching app"
    }
]

function emojiSpan(str){
    return <span className="emoji-text">{str}</span>
}

export class MessageBox extends React.Component{
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
        this.default_status_message = {
            success: this.props.hasOwnProperty("successMsg") ? this.props.successMsg : "Success.",
            fail: "That password was incorrect. Please try again."
        }
        this.state = {
            status:null,
        }
    }
    componentWillMount(){
          this.remaining_tries = 3;
          console.log("Will Mount")
    }
    eventLogging(action,data){
      this.client_events.push({
        time:Date.now(),
        goal:this.props.goal,
        action:action,
        data:data,
        website:this.props.website
      });
    }
    submitAction(e){
        const component = this
        e.preventDefault();
        const {id,path,website} = this.props;
        var form = document.querySelector('#'+id);
        this.eventLogging("submit",`${form.elements['password'].value}(${form.elements['emoji_password'].value})`)
        var form_data = {
          //add username to all client events
            client_events: this.client_events.map((item)=>{item.username=form.elements['username'].value;return item;}),
            username:form.elements['username'].value,
            password:form.elements['password'].value,
            website:website
        }
        console.log(form_data)
        this.client_events.splice(0,this.client_events.length);//empty list
        const xhr = new XMLHttpRequest();
        this.err_message ="";
        xhr.open('POST',path);
        xhr.setRequestHeader('Content-Type','application/json')
        xhr.onload = function(){
            console.log(xhr.status);
            if(xhr.status===200){

                component.setState({
                    status:'success',
                });
                form.reset()
                if(component.props.onSuccess) component.props.onSuccess();
            }else if(xhr.status === 401){
                component.remaining_tries-=1;
                if(component.remaining_tries ===0){
                  component.props.onSuccess();
                  component.err_message = "You've run out of attempts. Moving to next website";
                  component.remaining_tries = 3;
                }
                component.setState({status:'fail'})
            }else if (xhr.status === 404){
              component.err_message="User does not exist";
              component.setState({status:'fail'})

            } else {
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
            <MessageBox status={status} message={this.err_message ? this.err_message : this.default_status_message[status]} />
            <div className="form-cluster">
                <label htmlFor="login-username-field">Username</label>
                <input required="true" name="username" id="login-username-field" type="text"  autoComplete="off"/>
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
        const {submitAction,eventLogging, disabled,msg,msgType,username,website} = this.props;
        console.log(website)
        return (<div className="row">
            <form  id="new-user-form"  onSubmit={submitAction} className="form newUserForm" autoComplete="off">
            <MessageBox status={msgType} message={msg}/>
            <h2 id="new-user-title" className="form-title">Create Identity</h2>
                <div className="form-cluster">
                    <label htmlFor="new-username-field">Username</label>
                    <input name="username" id="new-username-field" type="text" readOnly={disabled || username!==null} value={username}  autoComplete="off"/>
                </div>
                <EmojiPasswordGenerator key={website} eventLogging={eventLogging}  passLength="4" disabled={disabled}/>
            </form>
        </div>);
    }
}

class StoreSelector extends React.Component{
    // selectStore
    // selectedStore
    //availableStores}/>
    render(){
        const {selectedStore,availableStores} = this.props;
        const rendered_shops = availableStores.map((item)=>{
            return(<button key={item.id}
                className={"shop-selection "+item.id}
                disabled={item.id===selectedStore.id}
                onClick={()=>this.props.selectStore(item)}>
                {item.name}
            </button>)
        });
        return (
            <div className="form-row store-selector">
                {rendered_shops}
            </div>
        );
    }

}

export class CreateAndPracticePage extends React.Component{
    completedCreatePrompt = 'You have created your final password. When you are done practicing hit the "return" button above to return to the login prompt';
    constructor(props){
        super(props)
        this.client_events=[]
        this.state = {
            practice:false,
            user:null,
            respMsg:"",
            respType:null,
            currentShop:STORE_CONFIGS[0],
            shopOptions:STORE_CONFIGS.slice(0,STORE_CONFIGS.length)
            //copy list so we can modify it as we go
        }
    }
    eventLogging(action,data){
      this.client_events.push({
        time:Date.now(),
        goal:"create",
        action:action,
        website:this.state.currentShop.id,
        data:data
      })
    }
    submitNewUser(e){
        e.preventDefault();
        var form = document.querySelector('#new-user-form');
        if(form.elements['username'].value.length<4){
          this.setState({
            respType:"fail",
            respMsg:"Username must be at least 4 characters"
          });
          return;
        }else if(form.elements['username'].value.length>32){
          this.setState({
            respType:"fail",
            respMsg:"Username must be shorter than 32 characters"
          });
          return;
        }else if(!form.elements['username'].value.match(/^[A-Za-z0-9]+$/)){
          this.setState({
            respType:"fail",
            respMsg:"Username must be AlphaNumeric"
          });
          return;
        }
        const that =this;
        const { shopOptions, currentShop } = this.state;

        let password = form.elements['password'].value;
        let username = form.elements['username'].value;
        this.eventLogging("acceptPass",`${password}(${form.elements['emoji-password'].value})`)
        var form_data = {
            client_events:this.client_events.map((entry)=>{entry.username = username; return entry}),
            username: username,
            password: password,
            website: currentShop.id
        }
        console.log(form_data)
        that.client_events.splice(0,that.client_events.length); //empty list
        const xhr = new XMLHttpRequest();
        xhr.open('POST',`create`);
        xhr.setRequestHeader('Content-Type','application/json')
        xhr.onload = function(){
            if(xhr.status===200){
                that.setState({
                  practice:true,
                  respType:"success",
                  respMsg: "Password created. You can practice below.",
                  shopOptions:shopOptions.filter((item)=>item.name!==currentShop.name),
                  userCreated:true,
                })
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
    onSuccess(){
        this.setState({
            respType:"",
            respMsg:""
        })
    }
    selectStore(shop){
        this.eventLogging("switch-to-website",shop.id);
        this.setState({
            currentShop:shop,
            practice:false,
            respType:null,
            respMsg:""
        });
    }
    renderStores(){
      const {currentShop,shopOptions,user,practice,respMsg,respType} = this.state
      return STORE_CONFIGS.map((store)=>{return(
        <div className={currentShop.id === store.id ? "" : "hidden"}>
          <h1 className="brand-title">{store.name}</h1>
          <h4 className="tag-line">{store.tag_line}</h4>
          <NewUserForm
            eventLogging={this.eventLogging.bind(this)}
            submitAction={this.submitNewUser.bind(this)}
            username={user}
            disabled={practice}
            website={store.id}
            msg={respMsg}
            msgType={respType}/>
          {practice?<PasswordForm
              path="practice"
              goal="create"
              website={store.id}
              id="password-form"
              onSuccess={this.onSuccess.bind(this)}
              successMsg="Successful practice."
              title="Practice Login"/>:''}
        </div>)
      });
    }
    render(){
        const {practice,respType,respMsg,currentShop,shopOptions,user} = this.state;
        const {exitPage} = this.props;
        return(
            <div className={"container "+currentShop.id}>
                <div className="row">
                  <button type="button"
                    className="btn btn-text"
                    onClick={exitPage}>{ shopOptions.length === 0 ?
                        <span>{emojiSpan("⬅️")}Return</span> :
                        <span>{emojiSpan("✖️")}Cancel</span> }
                  </button>
                </div>
                <MessageBox status={ shopOptions.length === 0 ? "success" : "" }
                    message={ this.completedCreatePrompt }/>
                <StoreSelector
                    selectStore={this.selectStore.bind(this)}
                    selectedStore={currentShop}
                    availableStores={shopOptions}/>
                {this.renderStores()}
            </div>
        )
    }
}
//eslint-disable-next-line
export class LoginPage extends React.Component{
    thank_you_msg = 'We here at team "A Funny Name" would like to thank you for your participation. We appreciate the time you have taken to assist us in our academic pursuits'
    constructor(props){
        super(props)
        //shuffledList
        this.shopOptions=STORE_CONFIGS.map((item)=>{return  {sortIndex:Math.random(),value:item.id}}).
          sort((a,b)=>a.sortIndex - b.sortIndex).
          map((item)=>item.value);
        this.state={
            currentShop:this.shopOptions.pop()//last element of the random list
        }
    }
    nextWebsite(){
        const { shopOptions} = this.state
        this.setState({
            currentShop:this.shopOptions.pop()
        })
    }
    renderShops(){
      return STORE_CONFIGS.map((shop,index)=>{
        return(
            <div className={"container "+shop.id + " " + (shop.id===this.state.currentShop? "" : "hidden")}>
                <h1 className="brand-title">{shop.name}</h1>
                <h4 className="tag-line">{shop.tag_line}</h4>
                <PasswordForm onSuccess={this.nextWebsite.bind(this)}
                    id="password-form"
                    website={shop.id}
                    successMsg="Success! Moving to next website."
                    goal="login"
                    path="login"
                    title="Login" />
            </div>
        )
      })
    }
    render(){
        const {currentShop} = this.state;
        return( this.shopOptions.length > 0 ? this.renderShops() :
              <div className="container">
                  <MessageBox status="success" message={this.thank_you_msg}/>
              </div>
        )
    }
}