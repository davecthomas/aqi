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
      console.log(this.state.aqi);

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
              items: result,
              metric: result[1].ParameterName,
              aqi: result[1].AQI,
              location: result[1].ReportingArea,
              evaluation: result[1].Category.Number,
              evaluation_description: result[1].Category.Name
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

    getAqi = () => {
      return this.state.aqi;
    }

    render() {
      const { error, isLoaded, items } = this.state;
      if (error) {
        return <div>Error: {error.message}</div>;
      } else if (!isLoaded) {
        return <div>Loading...</div>;
      } else {
        return <div><h2>{this.state.metric} in {this.state.location}: {this.state.aqi}</h2>
        <p>Category {this.state.evaluation} ({this.state.evaluation_description})</p></div>;
        // return <Button onClick={this.handleClick} aqi={this.state.items}>{this.props.name}</Button>;
      }
    }
}

class AqiContent extends React.Component {
  render() {
    return (<div>{this.props.aqi}</div>)
  }
}

function App() {
  return (
    <div className="App">
      <header className="App-header">

      </header>
      <div className="App-body">
      <AquiLoadButton name="Air Quality Index">
        <AqiContent aqi={10}/>
      </AquiLoadButton>
      </div>
    </div>
  );
}

export default App;
