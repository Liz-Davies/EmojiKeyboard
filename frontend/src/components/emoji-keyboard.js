import React from 'react';
import './keyboard.css';

/*
The core components are stored in this file.
The keyboard renders key rows and the key rows render keys.

The config for what keys appear in which rows and which emojis appear on which
keys appears in a short config below.

Because of shared configs the EmojiPasswordGenerator is also written here.

This file also imports the css page which imports selected font (Noto-Emoji)
so that the font is always carried with the components.
*/

const LANG_CONFIG_MAP ={
	"0": "🍁",
	"1": "🌵",
	"2": "🚗",
	"3": "🗿",
	"4": "🎲",
	"5": "⚽",
	"6": "🎿",
	"7": "🐧",
	"8": "🐱",
	"9": "🌸",
	"-": "🎃",
	"=": "🌲",
	"q": "🍉",
	"w": "🍍",
	"e": "️🍒",
	"r": "🎱",
	"t": "🏆",
	"y": "🐞",
	"u": "️🐼",
	"i": "🐖",
	"o": "💨",
	"p": "☔️",
	"[": "❄️",
	"]": "🎀",
	"a": "🍦",
	"s": "🍺",
	"d": "☕",
	"f": "🎬",
	"g": "🎥",
	"h": "🎵",
	"j": "👑",
	"k": "💎",
	"l": "🏠",
	";": "💌",
	"'": "🔑",
	"\\": "💡",
	"z": "♣️",
	"x": "♦️",
	"c": "♠️",
	"v": "♥️",
	"b": "🌃",
	"n": "🔭",
	"m": "🚀",
	",": "🌙",
	".": "🌠",
	"/": "📫"
}
const LANG_CONFIG_ROWS = [
		['1','2','3','4','5','6','7','8','9','0','-','='],
		['q','w','e','r','t','y','u','i','o','p','[',']'],
		['a','s','d','f','g','h','j','k','l',';','\'','\\'],
		['z','x','c','v','b','n','m',',','.','/']
];

function convertToEmoji(str){
	return str.split("").map(ch=>LANG_CONFIG_MAP[ch]).join("")
}


class EmojiKey extends React.Component{
    render(){
        const {key_mapping,clickAction} = this.props;
        return <button className='emoji-key'
					onClick={(e)=>clickAction(e,key_mapping)}
					type="button">
						<span className='emoji-char'>{LANG_CONFIG_MAP[key_mapping]}</span>
						<span className='key-reminder'>{key_mapping}</span>
					</button>
    }
}

class EmojiKeyRow extends React.Component{
    render(){
        let { keys, clickAction } = this.props;
        let rendered_keys = keys.map((letter)=>(
            <EmojiKey key={letter}
				id={"emoji-key-"+letter}
                key_mapping={letter}
                clickAction={clickAction}/>
        ));
        return <div className="emoji-keyboard-row">{rendered_keys}</div>
    }
}

export class EmojiKeyboard extends React.Component{
  constructor(props){
      super()
      this.actionRecord=[]
      this.actionRecord.push({
          time:new Date(),
          action:"page_open",
      })
      this.state={
          val:"",
		pass_visible:false
      }
  }
  clickAction(e,key){
      e.preventDefault();
      let {val} = this.state;
      this.setState({val:val+key})
  }
	inputEntry(e){
		this.setState({val:e.target.value})
	}
  keyDown(e){
	//handle key presses that are made while working with the keyboard
		let key = e.key.toLowerCase();//account for accidental capslock
		let {val} = this.state;
		if("backspace" === key){
			this.setState({val:val.slice(0,val.length-1)})
		}else if(key in LANG_CONFIG_MAP){
			this.logKey("key_press",key)
			this.setState({val:val+key})
		}
  }
	revealPass(){
		this.setState({pass_visible:true});
	}
	hidePass(){
		this.setState({pass_visible:false})
	}
    render(){
        let rendered_rows = LANG_CONFIG_ROWS.map((row,index)=><EmojiKeyRow key={index} clickAction={this.clickAction.bind(this)} keys={row}/>);
		const {id} = this.props;
		const {val,pass_visible} = this.state;
        return (
            <div>
                <div className="form-cluster">
                    <label htmlFor="#emoji-pass-field">Password</label>
					<input className="text-input emoji-field"
						required={true}
						name="password"
						type="password"
						id={id}
						autoComplete="off"
						onChange={this.inputEntry.bind(this)}
						value={val}
						hidden={pass_visible}/>
					<input className="text-input emoji-text emoji-field"
						name="emoji_password"
						type="text"
						id={id+"-emoji"}
						readOnly={true}
						autoComplete="off"
						onChange={this.inputEntry.bind(this)}
						value={convertToEmoji(val)}
						hidden={!pass_visible}/>
					<button className="in-field-button emoji-text text-muted"
						type="button"
						onMouseLeave={this.hidePass.bind(this)}
						onMouseEnter={this.revealPass.bind(this)}>{pass_visible?"🙉":"🙈"}</button>
                </div>
				 <div className="form-row">
	                <div className="keyboard-en emoji-keyboard" onKeyDown={this.keyDown.bind(this)}>
	                    {rendered_rows}
	                </div>
				</div>
            </div>
        );
    }
}



export class EmojiPasswordGenerator extends React.Component{
	constructor(props){
		super(props)
		this.validChars = Object.keys(LANG_CONFIG_MAP);
		this.state={
			curr_pass:"",
			emoji_pass:"",
			remaining_tries:3,
			hidePassword:props.hidePassword
		}
	}
	componentDidMount(){
		let new_pass = this.generatePassword();
		this.setState({
			curr_pass:new_pass,
			emoji_pass:convertToEmoji(new_pass),
		})
	}

	generatePassword(){
		var chars = "";
		var range = this.validChars.length;
		for(var i=0;i<this.props.passLength;i++){
			chars+=this.validChars[Math.floor(Math.random()*range)];
		}
        return chars
	}
    refreshPassword(){
	    const {eventLogging} = this.props;
        const new_pass = this.generatePassword();
		eventLogging("changePass",new_pass);
        this.setState({
            curr_pass:new_pass,
            emoji_pass:convertToEmoji(new_pass),
            remaining_tries:this.state.remaining_tries-1
        })
    }
	render(){
		const{emoji_pass,curr_pass,hidePassword,remaining_tries} = this.state
		const {disabled} = this.props
		return(<div id="new-emoji-pass-field">
			<input hidden={true} readOnly={true} name="password" value={curr_pass}/>️
			<div className="form-cluster">
				<label htmlFor="new-emoji-pass">New Password</label>
				<input className="emoji-field emoji-text"
					name="emoji-password"
					type={hidePassword ? "password" : "text"}
					readOnly={true}
					value={emoji_pass}/>
			</div>
			<div className="form-row button-row">
				<button className="btn btn-lrg btn-danger"
					type="button"
                    onClick={this.refreshPassword.bind(this)}
                    disabled={remaining_tries===0 || disabled} >Regenerate ({remaining_tries})</button>
				<button className="btn btn-lrg btn-accept"
					type="submit"
					disabled={disabled}>Accept Password</button>
			</div>
		</div>)
	}
}

export default EmojiKeyboard;
