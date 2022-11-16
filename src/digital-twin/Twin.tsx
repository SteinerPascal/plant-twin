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

const Twin = ({endpointUrl}:{endpointUrl:string}) => {
  
  let navigate = useNavigate();
  // Customnavigation for plugins (fabs) they currently can not trigger the route component
  var ps = window.history.pushState; 
  window.history.pushState = function(){
    ps.apply(window.history, arguments as any); // preserve normal functionality
    console.log("navigating", arguments); // do something extra here; raise an event
    if("subject" in arguments[0] && arguments[2].includes("/twin/") && arguments[0].subject != subject){
      changeSubject(arguments[0].subject)
    }
    if("subject" in arguments[0] && arguments[2].includes("/tdeditor/") ){

        // navigate to the tdeditor with the 
        navigate(arguments[2],{state:arguments[0]}); 
    }
  }; // end forwardfab

  const [subject,changeSubject] = useState((useLocation().state as RoutingState).subject)
  const [twinStore, createStore] = useState<Store>(new Store());

  // TODO: move away from hardcoded endpoint
  const sparqlHandler = new SparqlHandler(endpointUrl)
  const [menu,renderMenu] = useState<JSX.Element >(<div>LOADING DIGITAL TWIN</div>)

  useEffect(() => {
    const resultStream = SparqlHandler.describeTwin(DataFactory.namedNode(subject))
    resultStream.then(result =>{      
      result.on('data',(binding)=>{
        console.log(`data:`)
        console.dir(binding)
        //console.dir(`bind: ${JSON.stringify(binding)}`)
        createStore(new Store())
        twinStore.add(binding as Quad) // result comes in RDF/JS Quad
      })
      result.on('end',()=>{
        renderMenu(<CircularMenu subject= {subject} endpointUrl={endpointUrl} twinStore={twinStore}></CircularMenu>)
      })
    })

  }, [subject])

  return (
    <Layout>
      <BackGround></BackGround>
      <h1 style={{color:"white", fontSize:"25px"}}>Digital Twin UI for {subject}</h1>
      { menu }
    </Layout>
  );
};

export default Twin;
