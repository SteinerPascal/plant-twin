import { DataFactory, Quad, Store } from "n3";
import { useEffect, useState } from "react";
import { NamedNode } from "n3";
import convertToD3 from "./quad2D3";
import ActionModal from "../digital-twin/circularmenu/ActionModal";
import GraphComponent from "./GraphComponent";
import SparqlHandler from "../SparqlHandler";
import internal, { Stream } from "stream";


export default function ForceGraph({iri,openFab,resultStream}:{iri:string,openFab:boolean,resultStream:Promise<Stream & internal.Readable>}){
    const [open, onFabOpen] = useState(openFab);
    console.log(`subject received: ${iri}`)
    const [graphModal,renderGraphModal] = useState(<div>Loading Graph</div>)
    //const [dataSet,setDataSet] = useState<null|ID3Js>(null)
    const handleClose = () =>{
        onFabOpen(false)
    } ;


    useEffect(() => {
        resultStream.then(result =>{     
          result.on('data',(binding:Quad)=>{
            SparqlHandler.rdfStore.add(new Quad(binding.subject,binding.predicate,binding.object,new NamedNode("http://twin/forceGraph/"))) // result comes in RDF/JS Quad
          })
          result.on('end',()=>{
            console.log('set data')
            let dataSet = convertToD3(SparqlHandler.rdfStore.getQuads(iri,null,null,new NamedNode('http://twin/forceGraph/')))
            if(dataSet)
            renderGraphModal(<ActionModal open={open} handleClose={handleClose } actionEl={<GraphComponent dataSet={dataSet}/>} />)
          })
        })
    
      }, [iri])

    return(
        <div>
            {graphModal}   
        </div>

    )
}