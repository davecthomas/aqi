import React from 'react';
// import logo from './logo.svg';
import Button from 'react-bootstrap/Button';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class AquiLoadButton extends React.Component {
    constructor() {
      super();
        this.state = {
        error: null,
        isLoaded: false,
        items: []
      };
      this.handleClick = this.handleClick.bind(this);
    }
    handleClick () {
      alert("hi");

    }

    componentDidMount() {
        fetch("http://www.airnowapi.org/aq/forecast/zipCode/?format=application/json&zipCode=98109&date=2020-09-14&distance=25&API_KEY=8232EB37-A326-41FD-8E59-303E253E2294")
          .then(res => res.json())
          .then(
            (result) => {
              this.setState({
                isLoaded: true,
                items: result.items
              });
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
              this.setState({
                isLoaded: true,
                error
              });
            }
          )
      }



    render() {
      const { error, isLoaded, items } = this.state;
      if (error) {
        return <div>Error: {error.message}</div>;
      } else if (!isLoaded) {
        return <div>Loading...</div>;
      } else {
        return <Button onClick={this.handleClick}>{this.props.name}</Button>;
      }
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
