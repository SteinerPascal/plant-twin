import { Point } from "geojson"
import { NamedNode, Quad, Quad_Subject } from "n3"
import { Dispatch, SetStateAction } from "react"
import GraphComponent from "../graph-visualizer/GraphComponent"
import convertToD3 from "../graph-visualizer/quad2D3"
import { wktToGeoJson } from "../sparnaturalmanager/yasgui/plugins/map-plugin/wktParsing"
import SparqlHandler from "../SparqlHandler"
import { deviceMarker } from "./markersvg"


const createMarker = (feature: Point, popUpString:JSX.Element, index:number,onSubjectClick:(subj:JSX.Element)=>void) => {
    const marker ={
      id: index,
      iconColor: "red",
      onClick:modalOpen,
      position: [ feature.coordinates[1], feature.coordinates[0]],
      customIcon:deviceMarker
    }

    function modalOpen(){
      onSubjectClick(popUpString)
    }
    return marker
}

const createModalObj = (graph:Quad[]):JSX.Element => {
    const data = convertToD3(graph)
  return <GraphComponent dataSet={data} ></GraphComponent>
}

const getDeviceQuads = (deviceNode:Quad_Subject,graph:NamedNode) => {
    const deviceQuads:Quad[] = []
    const labels = SparqlHandler.rdfStore.getQuads(deviceNode,SparqlHandler.RDFS.label,null,graph)
    deviceQuads.push(...labels)
    SparqlHandler.rdfStore.getQuads(deviceNode,SparqlHandler.SSNSYSTEM.hasSystemCapability,null,graph).forEach(q=>{
        deviceQuads.push(q)
        SparqlHandler.rdfStore.getQuads(q.object,null,null,graph).forEach(p=>{
            deviceQuads.push(p)
            deviceQuads.push(...SparqlHandler.rdfStore.getQuads(p.object,null, null,graph)) 
        })
    })
    return deviceQuads
}

export const getDevices = (addData: Dispatch<SetStateAction<JSX.Element[]>>,onSubjectClick:(subj:JSX.Element)=>void)=>{
    const mapDeviceGraph = new NamedNode("http://twin/mapDevices/")
    SparqlHandler.getMapDeviceData().then(stream=>{
    const markers:Array<any> = []

    stream.on('data',(binding:Quad)=>{
        console.log('data')
        SparqlHandler.rdfStore.add(new Quad(binding.subject,binding.predicate,binding.object,mapDeviceGraph)) // result comes in RDF/JS Quad
      });
      
    stream.on('end',()=>{
      console.log('add device data')
        const devices = SparqlHandler.rdfStore.getSubjects(SparqlHandler.SSNSYSTEM.hasSystemCapability,null,mapDeviceGraph)
        devices.forEach((d,i)=>{
           console.log('for d')
            const locations = SparqlHandler.rdfStore.getObjects(d,SparqlHandler.GEO.hasLocation,mapDeviceGraph)
            if(locations.length > 1) console.warn('Device has more than one location!')
            const spatialCoverage = SparqlHandler.rdfStore.getObjects(d,SparqlHandler.GEO.hasCoverage,mapDeviceGraph)
            if(spatialCoverage.length > 1) console.warn('Device has more than one coverage for its function!')
            
            const graph = getDeviceQuads(d,mapDeviceGraph)
            const modal = createModalObj(graph)
            console.dir(locations)
            const geometry = wktToGeoJson(locations[0].value)
            if(geometry.type === "Point"){
                console.log('createmarker')
                const marker = createMarker(geometry,modal,i,onSubjectClick)
                markers.push(marker)
            } 
        })
        addData(markers)
    });
    stream.on('error',(err)=>{
      throw Error(err.message)

    });
  })
}