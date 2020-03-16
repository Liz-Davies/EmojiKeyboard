import React from 'react';
import './App.css';
import EmojiKeyboard from './components/emoji-keyboard.js'

function App() {
  return (
    <div className="container">
        <div className="row">
            <form className="passwordForm">
                <EmojiKeyboard/>
            </form>
        </div>
    </div>
  );
}

export default App;
