import React from 'react';
import Button from 'react-bootstrap/Button';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// import location_img from './my_location.png';

class Location extends React.Component{
  constructor() {
    super();
    this.state = {
        error: null,
    };
    this.default = {
      lat: 47.6205099,
      lon: -122.3514661
    };
    this.status = null;
    this.postion_coords = null;
    this.handleClick = this.handleClick.bind(this);

  }

  handleClick () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.getCurrentPositionCallback, this.getCurrentPositionError);
      this.status = "";
    } else {
      this.status = "Geolocation is not supported by this browser.";
      console.log(this.status)
    }
  }

  componentDidMount() {

  }

  getCurrentPositionCallback = position => {
    console.log(position.coords)
    this.postion_coords = position.coords;
    console.log(this.ppostion_coords)
    this.forceUpdate();
  }

   getCurrentPositionCallbackError(error) {
    console.log('Geolocation error : code ' + error.code + ' - ' + error.message);
    this.state.error = error.code + ' - ' + error.message;
  }

  onChange(){
    console.log("onchange");
  }

  render() {
    // if (this.state.position != null) {
    //   pos_jsx =
    //     <p>Latitude: {this.state.position.coords.latitude}
    //     <br/>Longitude: {this.state.position.coords.longitude} </p>;
    // } else {
    //   pos_jsx = <p>Location error {this.state.error}</p>;
    // }
    //  <img src={location_img} onClick={this.myfunction} />
    var lat = null;
    var lon = null;
    var location = "";
    if (this.postion_coords != null){
      lat = this.postion_coords.latitude;
      lon = this.postion_coords.longitude;
      location = "Location: "+ lat + ", " + lon;
    }
    return(
      <div>
      <Button onClick={this.handleClick}>Use my location</Button>
      <p>{location}</p>
      </div>
      );
  }
}

class AquiLoad extends React.Component {
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
      <AquiLoad name="Air Quality Index">
        <AqiContent/>
      </AquiLoad>
      </div>

      <Location/>
    </div>
  );
}

export default App;
