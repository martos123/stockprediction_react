import React, { Component } from "react";
import "./App.css";
import Nav from './components/Nav';
import About from './components/About';
import Home from './components/Home';

import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';






class App extends Component {
  
  render() {
    
    return (
      <div>
        <Router>
          <div>
            <Nav />
            <Switch>
            <Route path='/' exact component={Home} />
            <Route path='/about' component={About}/>
            
            </Switch>
          </div>
        </Router>
        
      </div>
    );
  }
}
export default App;
