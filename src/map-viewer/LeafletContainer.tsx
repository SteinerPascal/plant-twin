import { useEffect, useState } from 'react'
import { wktToGeoJson } from "../sparnaturalmanager/yasgui/plugins/map-plugin/wktParsing";
import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
} from 'react-leaflet'
import SparqlHandler from '../SparqlHandler'
import { Literal, NamedNode } from 'n3';
import { Point } from 'geojson';
import L from 'leaflet';
import CustomPopUp from './PopUp';
import PixiOverlay from "react-leaflet-pixi-overlay";
import markersvg from './markersvg';

export default function LeafletContainer(){
  const [mapdata,addData] = useState<Array<JSX.Element>>([])

  const createMarker = (feature: Point, popUpString:JSX.Element, index:number) => {
    const latLng = new L.LatLng(feature.coordinates[1],feature.coordinates[0])
    //if(this.config.markerOptions) markerOptions = this.config.markerOptions

    const test ={
      id: "randomStringOrNumber",
      iconColor: "red",
      position: [ feature.coordinates[1], feature.coordinates[0]],
      popup: popUpString,
      customIcon:markersvg
    }
    return test
    
    //this.addToLayerList(marker)
    //if clustering is activated, then don't draw the marker but gather it in the cluster
    //this.markerCluster.addLayer(marker)
}

const createPopUpString = (row:any):JSX.Element => {
  let popUp:{[key: string]: string} = {}
  const entries = Object.entries(row).forEach(([key, value]) => {
    const val = value as NamedNode | Literal
    if(val.termType === "Literal" && val.datatype.value === `${SparqlHandler.GEO.wktLiteral.value}`)
    return false// don't include wkt in pop up
    popUp[key] = val.value
  })  
  return <CustomPopUp popUpObj={popUp}></CustomPopUp>
}
  useEffect(() => {
    let rowIndex = 0
    SparqlHandler.getMapData().then(stream=>{
      const geometries:Array<any> = []
      stream.on('data',(row)=>{
        Object.entries(row).forEach(([key, value]) => {
          const val = value as NamedNode | Literal

          if('datatype' in val && val.datatype.value === `${SparqlHandler.GEO.wktLiteral.value}`) {
            // val is a geoliteral
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
        console.log('add data')
        console.log(`Nr. of subjects: ${geometries.length}`)
        addData(geometries)
      })
      stream.on('error',(err)=>{
        throw Error(err.message)

      })
    })
    },[])

  return(
    <MapContainer preferCanvas={true} center={[47.3769, 8.5417]} style={{height:"99%"}} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <PixiOverlay markers={mapdata as any} />
    </MapContainer>

  )
}

