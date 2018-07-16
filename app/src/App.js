import React, { Component } from 'react';
import RoutesComponent from "./components/routesComponent";
import './assets/styles/main.css';

class App extends Component {
  render() {
    return (
      <div className="App">
          <RoutesComponent/>
      </div>
    );
  }
}

export default App;
