import React from 'react';
import './App.css';
import EmojiKeyboard, {EmojiPasswordGenerator} from './components/emoji-keyboard.js';
//import EmojiPasswordGenerator from './components/emoji-string-generator.js'

function App() {
  return (
    <div className="container">
        <div className="row">
            <EmojiPasswordGenerator passLength="4"/>
        </div>
        <div className="row">
            <form className="passwordForm" autoComplete="off">
                <div className="form-row">
                    <label htmlFor="login-username-field">Username</label>
                    <input id="login-username-field" type="text"  autoComplete="off"/>
                </div>
                <EmojiKeyboard id="login-password-field" type="password"/>
            </form>
        </div>
    </div>
  );
}

export default App;
