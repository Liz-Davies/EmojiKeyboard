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
        const {emoji,key_mapping,clickAction} = this.props;
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
    clickAction(e,key){
        e.preventDefault();
        this.actionRecord.push({
            time:new Date(),
            action:"button_click",
            target:key,
            alias:EN_KEY_MAP[key]
        });
        let {password_val} = this.state;
        this.setState({password_val:password_val+key})
    }
    keyPress(e){
        let key = e.target.value.charAt(e.target.value.length-1)
        this.actionRecord.push({
            time:new Date(),
            action:"key_press",
            target:key,
            alias:EN_KEY_MAP[key]
        });
        this.setState({password_val:e.target.value})
        console.log(this.actionRecord[this.actionRecord.length-1]);
    }
    submitAction(e){
        e.preventDefault();
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
        let rendered_rows = ROWS_CONFIG_EN.map((row,index)=><EmojiKeyRow key={index} onKeyPress={this.keyPress.bind(this)} clickAction={this.clickAction.bind(this)} keys={row}/>);
        return (
            <div>
                <div className="form-row">
                    <input className="text-input" type="password" id="emoji-pass-field" onChange={this.keyPress.bind(this)} value={this.state.password_val}/>
                    <button className="form-submit" type="submit">Submit</button>
                </div>
                <div className="keyboard-en emoji-keyboard">
                    {rendered_rows}
                </div>
            </div>
        );
    }
}
export default EmojiKeyboard;
