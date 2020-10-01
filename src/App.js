import React from 'react';
import Button from 'react-bootstrap/Button';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const maps_key = process.env.REACT_APP_MAPS_KEY;
/*global google*/

// import GoogleMapReact from 'google-map-react';

// const bindResizeListener = (map, maps, bounds) => {
//   maps.event.addDomListenerOnce(map, 'idle', () => {
//     maps.event.addDomListener(window, 'resize', () => {
//       map.fitBounds(bounds);
//     });
//   });
// };

// const apiIsLoaded = (map, maps) => {
//   if (map) {
//     const bounds = new maps.LatLngBounds();
//     map.fitBounds(bounds);
//     bindResizeListener(map, maps, bounds);
//   }
// };

// class AqiMap extends React.Component {

//   static defaultProps = {
//     center: {
//       lat: 40.1616,
//       lng: -74.4418
//     },
//     zoom: 11
//   };

//   constructor(props) {
//     super(props);

//     if (this.props.lat){
//       this.lat = this.props.lat;
//     } else{
//       this.lat = AqiMap.defaultProps.center.lat;
//     }
//     if (this.props.lon){
//       this.lon = this.props.lon
//     } else {
//       this.lon = AqiMap.defaultProps.center.lng;
//     }
//   }

//   updateLocation(lat, lon){
//     alert(lat+", " +lon);
//     this.setState({
//       center: {lat: lat, lng: lon}
//     });
//   }

//   render() {
//     return (
//       // Important! Always set the container height explicitly
//       <div style={{ height: '90vh', width: '100%' }}>
//         <GoogleMapReact
//           bootstrapURLKeys={{ key: maps_key }}
//           defaultCenter={{lat: this.lat, lng: this.lon}}
//           center={[this.lat, this.lon]}
//           defaultZoom={this.props.zoom}
//         >
//         </GoogleMapReact>
//       </div>
//     );
//   }
// }

// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.
let map, infoWindow;

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -34.397, lng: 150.644 },
    zoom: 6
  });
  infoWindow = new google.maps.InfoWindow();

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        infoWindow.setPosition(pos);
        infoWindow.setContent("Location found.");
        infoWindow.open(map);
        map.setCenter(pos);
      },
      () => {
        handleLocationError(true, infoWindow, map.getCenter());
      }
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}

class Location extends React.Component{
  constructor(props) {
    super(props);
    this._child = React.createRef();
    // this._child_map = React.createRef();
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
    //  this.setState({ disabled: "disabled" });
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
    // this._child_map.current.updateLocation(this.position_coords.latitude, this.position_coords.longitude);
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
      <div id="map" lat={lat} lon={lon} ></div>
      </div>
      );
  }
}

class AqiLoad extends React.Component {
    constructor(props) {
      alert(maps_key);
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
        key: "&API_KEY="+maps_key,
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

class AqiMap extends React.Component {
  constructor(props) {
      super(props);
      this.maps_key = maps_key;
      this.src = "https://maps.googleapis.com/maps/api/js?key="+this.maps_key+"&callback=initMap&libraries=&v=weekly";
  }
  render() {
    return (
     <script src={this.src} defer></script>
    )
  }
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <AqiMap/>
      </header>
      <div className="App-body">
      <Location/>
      </div>
    </div>
  );
}

export default App;
