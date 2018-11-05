import React, { Component } from 'react';
import { Main, Header } from './components/Main';

/*
Component that renders our Header and Main component.
This component will render our entire application.
No changes should be made here.
*/
class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Main />
      </div>
    );
  }
}

export default App;
