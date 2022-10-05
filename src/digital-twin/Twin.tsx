import { DataFactory, Quad, Store } from "n3";
import { useState } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from '../layout/Layout'
import BackGround from "./BackGround";
import CircularMenu from "./circularmenu/CirularMenu";
import SparqlHandler from "./SparqlHandler";

interface RoutingState {
  subject: string
}


const Twin = () => {
  const navigate = useNavigate()
  var ps = window.history.pushState; 
  window.history.pushState = function(){
    ps.apply(window.history, arguments as any); // preserve normal functionality
    console.log("navigating", arguments); // do something extra here; raise an event
    if("subject" in arguments[0] && arguments[2].includes("/twin/") && arguments[0].subject != subject){
      changeSubject(arguments[0].subject)
    }
  };

  const [subject,changeSubject] = useState((useLocation().state as RoutingState).subject)
  const [twinStore, createStore] = useState<Store>(new Store());
  // create Store and get twin information
  const endpointUrl = "http://localhost:7200/repositories/geneva-example"
  // TODO: move away from hardcoded endpoint
  const sparqlHandler = new SparqlHandler(endpointUrl)
  const [menu,renderMenu] = useState<JSX.Element >(<div>LOADING DIGITAL TWIN</div>)

  useEffect(() => {
    console.log(`use effect in Twin.tsx with subj:${subject}`)
    const resultStream = sparqlHandler.describeTwin(DataFactory.namedNode(subject))
    resultStream.then(result =>{      
      result.on('data',(binding)=>{
        console.dir(`bind: ${JSON.stringify(binding)}`)
        createStore(new Store())
        twinStore.add(binding as Quad) // result comes in RDF/JS Quad
      })
      result.on('end',()=>{
        console.log('onEnd')
        renderMenu(<CircularMenu endpointUrl={endpointUrl} twinStore={twinStore}></CircularMenu>)
      })
    })

  }, [subject])

  return (
    <Layout>
      <BackGround></BackGround>
      <h1>Digital Twin UI for {subject}</h1>
      {console.log('RENDERTWIN')}
      { menu }
    </Layout>
  );
  

};

export default Twin;
