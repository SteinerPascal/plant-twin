import { DataFactory, Quad, Store } from "n3";
import { useLocation } from "react-router-dom";
import FabLoader from "../fab-manager/FabLoader";
import Layout from '../layout/Layout'
import CircularMenu from "./circularmenu/CirularMenu";
import SparqlHandler from "./SparqlHandler";

interface RoutingState {
  subject: string
}

const Twin = () => {
  const location = useLocation()
  const { subject } = (location.state as RoutingState)
  // load FAB as plugins
  const fabLoader = new FabLoader()
  const fabs = fabLoader.loadFromConfig()//default path
  // create Store and get twin information
  const store = new Store();
  // TODO: move away from hardcoded endpoint
  const sparqlHandler = new SparqlHandler("http://localhost:7200/repositories/geneva-example")

  const resultStream =  sparqlHandler.describeTwin(DataFactory.namedNode(subject))
  resultStream.then(result =>{
    console.warn('Result was reloaded')
    result.on('data',(binding)=>{
      store.add(binding as Quad) // result comes in RDF/JS Quad
    })
  })
  return (
    <Layout>
      <h1>Digital Twin UI for {subject}</h1>
      <CircularMenu twinStore={store}></CircularMenu>
    </Layout>
  );
  

};

export default Twin;
