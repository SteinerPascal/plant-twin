import { useEffect, useState } from 'react'
import { wktToGeoJson } from "../sparnaturalmanager/yasgui/plugins/map-plugin/wktParsing";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from 'react-leaflet'
import SparqlHandler from '../SparqlHandler'
import { Literal, NamedNode } from 'n3';
import { Geometry, Point } from 'geojson';
import L from 'leaflet';
import customIcon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

export default function LeafletContainer(){
  const [mapdata,addData] = useState<Array<JSX.Element>>([])

  const markerIcon = L.icon({
    iconUrl: customIcon,
    shadowUrl: iconShadow
  });
  const createMarker = (feature: Point, popUpString:string, index:number) => {
    const latLng = new L.LatLng(feature.coordinates[0],feature.coordinates[1])
    let markerOptions:any ={
        icon:markerIcon
    }
    //if(this.config.markerOptions) markerOptions = this.config.markerOptions
    return<Marker key={index}position={latLng}>
        <Popup>
         {popUpString}
        </Popup>
      </Marker>
    
    //this.addToLayerList(marker)
    //if clustering is activated, then don't draw the marker but gather it in the cluster
    //this.markerCluster.addLayer(marker)
}

const createPopUpString = (row:any):string => {
  let popUp:{[key: string]: any;} = {}
  Object.entries(row).forEach(([key, value]) => {
    const val = value as NamedNode | Literal
    if(val.termType === "Literal" && val.datatype.value === `${SparqlHandler.GEO.wktLiteral}`)
    return // don't include wkt in pop up
    popUp[key] = val.value
  })
  let contentString = ``
  for (const [k, v] of Object.entries(popUp)) {
      contentString = `${contentString} <br> ${k}: <a class='iri' style="cursor: pointer; color:blue;">${v}</a>`
  }
  return contentString
}
  useEffect(() => {
    console.log('go')
    let rowIndex = 0
    SparqlHandler.getMapData().then(stream=>{
      const geometries:Array<JSX.Element> = []
      stream.on('data',(row)=>{
        Object.entries(row).forEach(([key, value]) => {
          console.dir(value)
          const val = value as NamedNode | Literal

          if('datatype' in val && val.datatype.value === `${SparqlHandler.GEO.wktLiteral.value}`) {
            // val is a geoliteral
            console.log('isgeoliteral')
            const position = wktToGeoJson(val.value)
            const popUpString = createPopUpString(row)
            if(position.type === "Point"){
              const marker = createMarker(position,popUpString,rowIndex)
              geometries.push(marker)
            } 
            //if(position.type === "Polygon") drawPoly(position,popUpString)
          }
        })
        rowIndex++       
      })
      stream.on('end',()=>{
        addData(geometries)
      })
    })
    },[])


  return(
    <MapContainer center={[47.3769, 8.5417]} style={{height:"99%"}} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {mapdata}
    </MapContainer>

  )
}

