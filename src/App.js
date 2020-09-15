import React from 'react';
// import logo from './logo.svg';
import Button from 'react-bootstrap/Button';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class AquiLoadButton extends React.Component {
    constructor() {
      super();
        this.state = {
        data: null,
        isLoaded: false,
        items: []
      };
      this.cors_proxy = {
        url: "https://cors-anywhere.herokuapp.com/",
        header: "x-requested-with"
      };
      this.aqi_service = {
        url: "http://www.airnowapi.org/aq/forecast/",
        params: "zipCode/?format=application/json",
        key: "&API_KEY=8232EB37-A326-41FD-8E59-303E253E2294",
      };
      this.handleClick = this.handleClick.bind(this);
    }
    handleClick () {
      console.log(this.state.items);

    }

    componentDidMount() {
      // https://cors-anywhere.herokuapp.com/http://www.airnowapi.org/aq/forecast/zipCode/?format=application/json&zipCode=98109&date=2020-09-14&distance=25&API_KEY=8232EB37-A326-41FD-8E59-303E253E2294
      var url = this.cors_proxy.url+this.aqi_service.url+this.aqi_service.params+"&zipCode=98109&distance=25"+this.aqi_service.key;
      fetch(url, {headers: {"x-requested-with": null}})
        .then(response => response.json())
        .then(
          result => {
            this.setState({
              isLoaded: true,
              items: result
            });
          },
          error => {
            alert(error)
            this.setState({
              isLoaded: true,
              error: error
            });
          }
        );
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
          <AquiLoadButton name="Air Quality Index"/>
      </header>
    </div>
  );
}

export default App;
