import React from 'react';
import './keyboard.css';
// import LANG_CONFIG from './emoji-language-config.js'

const LANG_CONFIG_MAP ={
	"0": "🌻",
	"1": "🌵",
	"2": "🚗",
	"3": "🗿",
	"4": "🥊",
	"5": "⚽",
	"6": "🎿",
	"7": "🐶",
	"8": "🐱",
	"9": "🌸",
	"-": "🎃",
	"=": "🌲",
	"q": "🍉",
	"w": "🌶️",
	"e": "️🍒",
	"r": "🎱",
	"t": "🥇",
	"y": "🐞",
	"u": "️🦄",
	"i": "🐖",
	"o": "💨",
	"p": "🌧️",
	"[": "❄️",
	"]": "🎀",
	"a": "🍦",
	"s": "🍺",
	"d": "☕",
	"f": "🎬",
	"g": "📽️️",
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
	"b": "👾",
	"n": "🤖",
	"m": "🚀",
	",": "🌙",
	".": "☄️",
	"/": "🧦"
}
const LANG_CONFIG_ROWS = [
		['1','2','3','4','5','6','7','8','9','0','-','='],
		['q','w','e','r','t','y','u','i','o','p','[',']'],
		['a','s','d','f','g','h','j','k','l',';','\'','\\'],
		['z','x','c','v','b','n','m',',','.','/']
];


class EmojiKey extends React.Component{
    render(){
        const {key_mapping,clickAction} = this.props;
        return <button className='emoji-key' onClick={(e)=>clickAction(e,key_mapping)}><span className='emoji-char'>{LANG_CONFIG_MAP[key_mapping]}</span><span className='key-reminder'>{key_mapping}</span></button>
    }
}

class EmojiKeyRow extends React.Component{
    render(){
        let { keys, clickAction } = this.props;
        let rendered_keys = keys.map((letter)=>(
            <EmojiKey key={letter}
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
			field_errors:new Set()
        }
    }
	logKey(event_name,key){
		let new_action = {
            time:new Date(),
            action:event_name,
            target:key,
            alias:LANG_CONFIG_MAP[key]
        }
		console.log(new_action)
		this.actionRecord.push(new_action);
	}
    clickAction(e,key){
        e.preventDefault();
		this.logKey('button_click',key)
        let {val} = this.state;
        this.setState({val:val+key})
    }
	inputEntry(e){
		let key = e.target.value.charAt(e.target.value.length-1)
		this.logKey('input_change',key)
		this.setState({val:e.target.value})
	}
    keyDown(e){
		//handle key presses that are made while working with the keyboard
		let key = e.key.toLowerCase();//account for accidental capslock
		let {val} = this.state;
		if("backspace" === key){
			this.setState({val:val.slice(0,val.length-1)})
		}else if("enter"===key){
			this.submitAction()
		}else if(key in LANG_CONFIG_MAP){
			this.logKey("key_press",key)
			this.setState({val:val+key})
		}else{
			this.setState({val:val})
		}


    }
    submitAction(e){
		if(e){
			e.preventDefault();
		}
        this.actionRecord.push({
            time:new Date(),
            action:"submit"
        });
        // var submitInfo = {
        //     action_record:this.actionRecord,
        // }
        //submit info to server
        //success return success

        //fail add fail to actionRecord
    }
	onSuccess(){
		//clear field
		this.setState({val:""})
	}
    render(){
        let rendered_rows = LANG_CONFIG_ROWS.map((row,index)=><EmojiKeyRow key={index} clickAction={this.clickAction.bind(this)} keys={row}/>);
        return (
            <div>
                <div className="form-row">
                    <label htmlFor="#emoji-pass-field">Password</label>
					<input className="text-input"
						type={this.props.type}
						id={this.props.id}
						autoComplete="off"
						onChange={this.inputEntry.bind(this)}
						value={this.state.val}/>
                </div>
				 <div className="form-row">
	                <div className="keyboard-en emoji-keyboard" onKeyDown={this.keyDown.bind(this)}>
	                    {rendered_rows}
	                </div>
				</div>
				<button className="form-submit" onSubmit={this.submitAction} type="submit">Submit</button>
            </div>
        );
    }
}



export class EmojiPasswordGenerator extends React.Component{
	constructor(props){
		super(props)
		this.validChars = Object.keys(LANG_CONFIG_MAP);
        let new_pass = this.generatePassword();
		this.state={
			curr_pass:new_pass,
			emoji_pass:this.convertToEmoji(new_pass),
			remaining_tries:3
		}
	}
	generatePassword(){
		var chars = "";
		var range = this.validChars.length;
		for(var i=0;i<this.props.passLength;i++){
			chars+=this.validChars[Math.floor(Math.random()*range)];
		}
        return chars
	}
    convertToEmoji(str){
        return str.split("").map(ch=>LANG_CONFIG_MAP[ch]).join("")
    }
    refreshPassword(){
        const new_pass = this.generatePassword();
        this.setState({
            curr_pass:new_pass,
            emoji_pass:this.convertToEmoji(new_pass),
            remaining_tries:this.state.remaining_tries-1
        })
    }
	render(){
		return(<div className="new-emoji-pass-field">
			<span className="new-emoji-pass">{this.state.emoji_pass}</span>
			<span className="button-row">
				<button className="btn btn-lrg btn-danger"
                    onClick={this.refreshPassword.bind(this)}
                    disabled={this.state.remaining_tries===0}>Regenerate {this.state.remaining_tries}</button>
				<button className="btn btn-lrg btn-accept">Accept Password</button>
			</span>
		</div>)
	}
}

export default EmojiKeyboard;
