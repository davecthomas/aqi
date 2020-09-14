import React from 'react';
// import logo from './logo.svg';
import Button from 'react-bootstrap/Button';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class AquiLoadButton extends React.Component {
    constructor() {
      super();
      this.handleClick = this.handleClick.bind(this);
    }
    handleClick () {
      alert("hi");

    }
    render() {
        return <Button onClick={this.handleClick}>{this.props.name}</Button>;
    }
}


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          <AquiLoadButton name="Air Quality Index"/>
        </p>
      </header>
    </div>
  );
}

export default App;
