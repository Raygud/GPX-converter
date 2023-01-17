import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from 'react-leaflet'
import { Icon } from 'leaflet';
import React, { useState, useEffect, useRef } from 'react';
import "leaflet/dist/leaflet.css";
import "./LeafletMap.scss"
const LeafletMap = () => {
  const [track, setTrack] = useState<Array<[number, number]>>()
  const [change, setChange] = useState<boolean>(false)
  const [startPos, setStartPos] = useState<[number, number]>([62.011293,-6.763457])
  const [selectedOption, setSelectedOption] = useState('green');

  const mapRef = useRef<any>();

  const handleChange = (e:any) => {
    setSelectedOption(e.target.value);
  };

  const myIcon = new Icon({
    iconUrl: '/Images/Marker-icon.png',
    iconSize: [25,41],   
  iconAnchor: [12.5, 41],
  popupAnchor: [-113, -40]
  });

  const OutOfRange = new Icon({
    iconUrl: '/Images/logo192.png',
    iconSize: [25,41],   
  iconAnchor: [12.5, 41],
  popupAnchor: [-113, -40]
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        setStartPos([lat,lng])
      });
    } else {
      // Geolocation is not supported by the browser
      console.log('Geolocation is not supported by this browser.');
    }
  }, [])
  

  useEffect(() => {
    let timeoutId:number ;
    timeoutId = window.setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.flyTo(startPos, 13, {
          pan: {
            animate: true,
            duration: 1.5,
          },
          zoom: {
            animate: true,
          },
        });
      }
    }, 1000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [startPos]);


  const zoom = () => {
      if (mapRef.current) {
          mapRef.current.setZoom(1)
      }
  }

  const onChange = (e:any) => {
    // Get the file that was selected by the user
    const file = e.target.files[0];
    const TypeCheck = e.target.files[0].name.split(".")

    if(TypeCheck[1] !== "gpx"){
       alert("'Please select a gpx file'")
       return
    }
    // Create a new FileReader
    const reader = new FileReader();

    // Listen for the 'load' event on the FileReader
    reader.addEventListener('load', () => {
      // The 'load' event is fired when the file has been read successfully
      // Get the file content as a string
      const fileContent:any = reader.result;
      console.log(fileContent)
      if(fileContent){
      const fileLines = fileContent.split('\n');
      console.log(fileLines)
      GPXParser(fileLines)

      // Do something with the file content
  }});

    // Start reading the file
    reader.readAsText(file);
  };
    function GPXParser(ToParse:any) {
      let map:any =[]
      ToParse.map((item:any)=>{
          if(item.includes("trkpt") && item.includes("lat")){
              let lat = item.substring(item.indexOf('lat="')+5,item.indexOf('lon="')-2)
              let lng = item.substring(item.indexOf('lon="')+5,item.indexOf('">'))
              let coords = [lat,lng]
              map.push(coords)
          }
      })
      console.log(map[0])
      setStartPos(map[0])
      setTrack(map)
    }
  

    const position:[number,number] = [57.33338596299291, 10.502734975889325]


    return (<>
        <div className="leaflet-container">
            <MapContainer ref={mapRef}  center={startPos} zoom={13} scrollWheelZoom={false}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    
    {/* <Marker position={startPos} icon={change? myIcon:OutOfRange}>
    <Popup>
        A pretty CSS3 popup. <br /> Easily customizable.
      </Popup>
    </Marker> */}
    <Circle center={startPos} radius={2000} color="none" fillColor="pink" fillOpacity={0.5} />
    <Circle center={startPos} radius={5} color="red" fillColor="red" fillOpacity={1} />

    {track ? 
      <Polyline positions={track} color={selectedOption} />
    
    :null}

     
  </MapContainer>
        </div>
        <button onClick={() => setChange(!change)}>{change? "true":"false"}</button>
        <input type="file" accept='.gpx' id="myFileInput" onChange={onChange}/>
        <div>
      <select value={selectedOption} onChange={handleChange}>
        <option value="Red">Red</option>
        <option value="Yellow">Yellow</option>
        <option value="Green">Option 3</option>
        <option value="Blue">Option 3</option>
        <option value="Pink">Option 3</option>
        <option value="Purple">Option 3</option>

      </select>
      <p>You selected: {selectedOption}</p>
    </div>
        </>
    )
};

export default LeafletMap;
