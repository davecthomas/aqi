import React from 'react';
import Button from 'react-bootstrap/Button';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// import location_img from './my_location.png';

// https://www.digitalocean.com/community/tutorials/how-to-integrate-the-google-maps-api-into-react-applications
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';

const mapStyles = {
  width: '50%',
  height: '50%'
};

export class MapContainer extends React.Component {
  state = {
    showingInfoWindow: false,  // Hides or shows the InfoWindow
    activeMarker: {},          // Shows the active marker upon click
    selectedPlace: {}          // Shows the InfoWindow to the selected place upon a marker
  };

  render() {
    return (
      <Map
        google={this.props.google}
        zoom={14}
        style={mapStyles}
        initialCenter={
          {
            lat: 40.1616,
            lon: -74.4418
          }
        }
      />
    );
  }
}

GoogleApiWrapper({
  apiKey: ("AIzaSyBYD9kl_bCw4tfChsC0GFOcVXgKEG5gyBA")
})(MapContainer)

class Location extends React.Component{
  constructor(props) {
    super(props);
    this._child = React.createRef();
    this.state = {
        error: null,
    };
    this.default = {
        lat: 40.1616,
        lon: -74.4418
    };
    this.status = null;
    this.position_coords = null;
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
    this.position_coords = position.coords;
    this.forceUpdate();
    this._child.current.refreshAqi(this.position_coords.latitude, this.position_coords.longitude);
  }

   getCurrentPositionCallbackError(error) {
    console.log('Geolocation error : code ' + error.code + ' - ' + error.message);
    this.state.error = error.code + ' - ' + error.message;
  }

  onChange(){
    console.log("onchange");
  }

  getLocation(){
    return this.position_coords;
  }

  render() {
    var lat = null;
    var lon = null;
    var location = "";
    if (this.position_coords != null){
      lat = this.position_coords.latitude;
      lon = this.position_coords.longitude;
    } else {
      lat = this.default.lat;
      lon = this.default.lon;
    }
    location = "Location: "+ lat + ", " + lon;
    return(
      <div>
      <Button onClick={this.handleClick}>Use my location</Button>
      <p id="location" lat={lat} lon={lon}>{location}</p>
      <AqiLoad ref={this._child} name="Air Quality Index" lat={lat} lon={lon}>
      </AqiLoad>
      </div>
      );
  }
}

class AqiLoad extends React.Component {
    constructor(props) {
      super(props);
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
        params: "latLong/?format=application/json",
        key: "&API_KEY=8232EB37-A326-41FD-8E59-303E253E2294",
      };
      this.default = {
        lat: 40.1616,
        lon: -74.4418
      };
      if (this.props.lat){
        this.lat = this.props.lat;
      } else{
        this.lat = this.default.lat;
      }
      if (this.props.lon){
        this.lon = this.props.lon
      } else {
        this.lon = this.default.lon;
      }
    }

    refreshAqi(lat=null, lon=null) {
      if ((lat != null) && (lon != null)){
        this.lat = lat;
        this.lon = lon;
      }
      if (this.state.isLoaded){
        var url = this.cors_proxy.url+this.aqi_service.url+this.aqi_service.params+"&latitude="+this.lat+"&longitude="+this.lon+this.aqi_service.key;
        alert (url);
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
        // if (document.getElementById("location") != null){
        //   var lat = document.getElementById("location").getAttribute("lat");
        //   var lon = document.getElementById("location").getAttribute("lon");
        // }
      }

    }

    componentDidMount() {
      this.state.isLoaded = true;
      this.refreshAqi();

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
        return <div><h2 lat={this.lat} lon={this.lon}>{this.state.metric} in {this.state.location}: {this.state.aqi}</h2>
        <p>Category {this.state.evaluation} ({this.state.evaluation_description})</p>
        </div>;
      }
    }
}

// class AqiContent extends React.Component {
//   render() {
//     return (<div>{this.props.aqi}</div>)
//   }
// }

function App() {
  return (
    <div className="App">
      <header className="App-header">
      </header>
      <div className="App-body">
      <Location/>
      </div>
      <MapContainer/>
    </div>
  );
}

export default App;
