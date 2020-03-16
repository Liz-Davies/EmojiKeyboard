import React from 'react';
import './keyboard.css';

const EN_KEY_MAP ={
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
const ROWS_CONFIG_EN = [
		['1','2','3','4','5','6','7','8','9','0','-','='],
		['q','w','e','r','t','y','u','i','o','p','[',']'],
		['a','s','d','f','g','h','j','k','l',';','\'','\\'],
		['z','x','c','v','b','n','m',',','.','/']
];


class EmojiKey extends React.Component{
    render(){
        const {key_mapping,clickAction} = this.props;
        return <button className='emoji-key' onClick={(e)=>clickAction(e,key_mapping)}><span className='emoji-char'>{EN_KEY_MAP[key_mapping]}</span><span className='key-reminder'>{key_mapping}</span></button>
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
            password_val:""
        }
    }
	logKey(event_name,key){
		let new_action = {
            time:new Date(),
            action:event_name,
            target:key,
            alias:EN_KEY_MAP[key]
        }
		console.log(new_action)
		this.actionRecord.push(new_action);
	}
    clickAction(e,key){
        e.preventDefault();
		this.logKey('button_click',key)
        let {password_val} = this.state;
        this.setState({password_val:password_val+key})
    }
	inputEntry(e){
		let {password_val} = this.state;
		let key = e.target.value.charAt(e.target.value.length-1)
		this.logKey('input_change',key)
        this.setState({password_val:e.target.value})
	}
    keyDown(e){
		//handle key presses that are made while working with the keyboard
		let key = e.key.toLowerCase();//account for accidental capslock
		let {password_val} = this.state;
		if("backspace" === key){
			this.setState({password_val:password_val.slice(0,password_val.length-1)})
		}else if("enter"===key){
			this.submitAction()
		}else if(key in EN_KEY_MAP){
			this.logKey("key_press",key)
			this.setState({password_val:password_val+key})
		}else{
			this.setState({password_val:password_val})
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
    render(){
        let rendered_rows = ROWS_CONFIG_EN.map((row,index)=><EmojiKeyRow key={index} clickAction={this.clickAction.bind(this)} keys={row}/>);
        return (
            <div>
                <div className="form-row">
                    <label htmlFor="#emoji-pass-field">Password</label>
					<input className="text-input"
						type="password"
						id="emoji-pass-field"
						autoComplete="off"
						onChange={this.inputEntry.bind(this)}
						value={this.state.password_val}/>
                </div>
                <div className="keyboard-en emoji-keyboard" onKeyDown={this.keyDown.bind(this)}>
                    {rendered_rows}
                </div>
				<button className="form-submit" onSubmit={this.submitAction} type="submit">Submit</button>
            </div>
        );
    }
}
export default EmojiKeyboard;
