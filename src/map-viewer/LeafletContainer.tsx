import { useEffect, useState } from 'react'
import {
    MapContainer,
    Marker,
    Popup,
    TileLayer,
  } from 'react-leaflet'


  export default function LeafletContainer({semanticQ, comp,endpointUrl,store,quad,actionCB}:{semanticQ:PluginObject["semanticQuery"] ,comp:PluginObject["component"],endpointUrl:string,store:Store,quad:Quad,actionCB: (jsxEl:JSX.Element)=>void}){
    const [mapdata,addData] = useState<>()
	useEffect(() => {
        const fetchFab = async ()=>{
            const renderable = await semanticQ(endpointUrl,store,quad)
            if(renderable) addData(comp(endpointUrl,store,quad,actionCB))
        }
        fetchFab()
    },[])
	

    return(
        <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[51.505, -0.09]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
 
    )
}

