import React from 'react';
import './App.css';
import EmojiKeyboard from './components/emoji-keyboard.js'

function App() {
  return (
    <div className="container">
        <div className="row">
            <form className="passwordForm" autoComplete="off">
                <div className="form-row">
                    <label htmlFor="login-username-field">Username</label>
                    <input id="login-username-field" type="text"  autoComplete="off"/>
                </div>
                <EmojiKeyboard/>
            </form>
        </div>
    </div>
  );
}

export default App;
