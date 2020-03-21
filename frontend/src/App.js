import React from 'react';
import './App.css';
import {LoginPage,CreateAndPracticePage} from './components/form-components.js';

function App(){
  return(
    <div className="tabbed-page-set">
      <div className="tabbed-page-control">
        <button type="button" name="page" className="tab">New</button>
        <button type="button" name="page" className="tab">Login</button>
      </div>
      <div id="create-page" className="tabbed-page">
        <CreateAndPracticePage/>
      </div>
    </div>
  );

}

export default App;
