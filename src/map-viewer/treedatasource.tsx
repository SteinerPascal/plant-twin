import { Point } from "geojson"
import { Literal, NamedNode } from "n3"
import { Dispatch, SetStateAction } from "react"
import { wktToGeoJson } from "../sparnaturalmanager/yasgui/plugins/map-plugin/wktParsing"
import SparqlHandler from "../SparqlHandler"
import  { treeMarker } from "./markersvg"
import LeafletModal from "./TreeModal"




const createMarker = (feature: Point, popUpString:JSX.Element, index:number,onSubjectClick:(subj:JSX.Element)=>void) => {
    const marker ={
      id: index,
      iconColor: "green",
      onClick:modalOpen,
      position: [ feature.coordinates[1], feature.coordinates[0]],
      customIcon:treeMarker
    }

    function modalOpen(){
      onSubjectClick(popUpString)
    }
    return marker
}

const createModalObj = (row:any):JSX.Element => {
  let obj:{[key: string]: string} = {}
  const entries = Object.entries(row).forEach(([key, value]) => {
    const val = value as NamedNode | Literal
    if(val.termType === "Literal" && val.datatype.value === `${SparqlHandler.GEO.wktLiteral.value}`)
    return false// don't include wkt in pop up
    obj[key] = val.value
  })  
  return <LeafletModal contentObj={obj}></LeafletModal>
}

export const getTrees = (addData: Dispatch<SetStateAction<JSX.Element[]>>,onSubjectClick:(subj:JSX.Element)=>void)=>{
  SparqlHandler.getMapTreeData().then(stream=>{
    let rowIndex = 0
    const geometries:Array<any> = []
    stream.on('data',(row)=>{
      Object.entries(row).forEach(([key, value]) => {
        const val = value as NamedNode | Literal

        if('datatype' in val && val.datatype.value === `${SparqlHandler.GEO.wktLiteral.value}`) {
          // val is a geoliteral
          const position = wktToGeoJson(val.value)
          const popUpString = createModalObj(row)
          if(position.type === "Point"){
            const marker = createMarker(position,popUpString,rowIndex,onSubjectClick)
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
}

