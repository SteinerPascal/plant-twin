import { DataFactory, Quad, Store } from "n3";
import { useEffect, useState } from "react";
import { NamedNode } from "n3";
import convertToD3 from "./quad2D3";
import ActionModal from "../digital-twin/circularmenu/ActionModal";
import GraphComponent from "./GraphComponent";
import SparqlHandler from "../digital-twin/SparqlHandler";


export default function ForceGraph({subject,openFab}:{subject:string,openFab:boolean}){
    const [open, onFabOpen] = useState(openFab);
    console.log(`subject received: ${subject}`)
    const [graphModal,renderGraphModal] = useState(<div>Loading Graph</div>)
    console.log('here')
    //const [dataSet,setDataSet] = useState<null|ID3Js>(null)

    
    const handleClose = () =>{
        onFabOpen(false)
    } ;


    useEffect(() => {
        if(!subject) return renderGraphModal(<div>No subject loaded</div>)
        subject = subject.replaceAll('"','')
        const prefix = subject.split(':').at(0)
       // see if it has prefix e.g sosa:Thing
        let iri:NamedNode
        if(prefix){
            iri = DataFactory.namedNode(`${SparqlHandler.ns.get(prefix)}#${subject.split(':').at(1)}`)
        } else {
            iri = DataFactory.namedNode(subject)
        } 
        const resultStream = SparqlHandler.explainActuation(iri)
        resultStream.then(result =>{     
          result.on('data',(binding:Quad)=>{
            console.log('add data')
            console.dir(binding)
            SparqlHandler.rdfStore.add(new Quad(binding.subject,binding.predicate,binding.object,new NamedNode("http://twin/forceGraph/"))) // result comes in RDF/JS Quad
          })
          result.on('end',()=>{
            console.log('set data')
            let dataSet = convertToD3(iri,SparqlHandler.rdfStore)
            if(dataSet)
            renderGraphModal(<ActionModal open={open} handleClose={handleClose } actionEl={<GraphComponent dataSet={dataSet}/>} />)
          })
        })
    
      }, [subject])

    return(
        <div>
            {graphModal}   
        </div>

    )
}