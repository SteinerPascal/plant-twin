import { DataFactory, Quad, Store } from "n3";
import { useState } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Layout from '../layout/Layout'
import BackGround from "./BackGround";
import CircularMenu from "./circularmenu/CirularMenu";
import SparqlHandler from "./SparqlHandler";

interface RoutingState {
  subject: string
}

const Twin = () => {
  const location = useLocation()
  const { subject } = (location.state as RoutingState)
  const [loaded, loadTwinData] = useState(false);
  const [twinStore, createStore] = useState(new Store());
  //let CircularMenu = React.lazy(()=>import( "./circularmenu/CirularMenu") )
  // create Store and get twin information
  const endpointUrl = "http://localhost:7200/repositories/geneva-example"
  // TODO: move away from hardcoded endpoint
  const sparqlHandler = new SparqlHandler(endpointUrl)
  useEffect(() => {
    const resultStream = sparqlHandler.describeTwin(DataFactory.namedNode(subject))
    resultStream.then(result =>{      
      result.on('data',(binding)=>{
        console.dir(`bind: ${JSON.stringify(binding)}`)
        twinStore.add(binding as Quad) // result comes in RDF/JS Quad
      })
      result.on('end',()=>{
       loadTwinData(true)
      })
    })

  }, [subject])
  const renderMenu = ()=>{
    if(loaded){
      return <CircularMenu endpointUrl={endpointUrl} twinStore={twinStore}></CircularMenu>
    } else {
      return <div>Loading the Twin Menu</div>
    }
  }

  return (
    <Layout>
      <BackGround></BackGround>
      <h1>Digital Twin UI for {subject}</h1>
      { renderMenu() }
    </Layout>
  );
  

};

export default Twin;
