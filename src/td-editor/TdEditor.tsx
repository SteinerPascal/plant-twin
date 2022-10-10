import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../layout/Layout";
import AppFooter from "./AppFooter";
import AppHeader from "./components/AppHeader/AppHeader";
import JSONEditorComponent from "./components/Editor/Editor";
import TDViewer from "./components/TDViewer/TDViewer";
import GlobalState from "./context/GlobalState";
import namespace from '@rdfjs/namespace';
import { SELECT } from '@tpluscode/sparql-builder'
import SparqlClient from "sparql-http-client"

interface RoutingState {
  subject: string
}
export default function TdEditor({endpointUrl}:{endpointUrl:string}) {

  const [subject,changeSubject] = useState<string | undefined>((useLocation().state as RoutingState)?.subject)

  
  const dragElement = (element:any, direction:any) => {
    let md:any;
    const first = document.getElementById("first");
    const second = document.getElementById("second");

    const onMouseMove = (e:any) => {
        var delta = {
            x: e.clientX - md.e.clientX,
            y: e.clientY - md.e.clientY
        };

        if (direction === "H") {
            delta.x = Math.min(Math.max(delta.x, -md.firstWidth),
                md.secondWidth);

            element.style.left = md.offsetLeft + delta.x + "px";
            if(first && second){
              first.style.width = (md.firstWidth + delta.x) + "px";
              //second.style.width = (md.secondWidth - delta.x) + "px";
            }
           
        }
    }

    const onMouseDown = (e:any) => {
      if(!first || !second) return
        md = {
            e,
            offsetLeft: element.offsetLeft,
            offsetTop: element.offsetTop,
            firstWidth: first.offsetWidth,
            secondWidth: second.offsetWidth
        };
        document.onmousemove = onMouseMove;
        document.onmouseup = () => {
            document.onmousemove = document.onmouseup = null;
        }
    }

    element.onmousedown = onMouseDown;
}
interface MongoConfig{
  endpoint: string,
  databaseName:string,
  collectionName:string
}
const getMongoConfig = (subject:string)=>{
  const ex = namespace('http://twin-example/geneva#')
  const config = namespace('http://twin-example/config#')
  const rdf = namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#")
  return new Promise((resolve,reject)=>{
      let endpoint = null
      const query = SELECT.ALL.WHERE`<${subject}> ${config.hostedOn} ?endpoint.
      ?endpoint ${rdf.type} ${config.MongoEndpoint};
        ${config.databaseName} ?databaseName;
        ${config.collectionName} ?collectionName`.build();
      const client = new SparqlClient( {endpointUrl} )
      client.query.select(query).then((bindingsStream:any)=>{
        console.log('inside')
        console.log(query)
          // check if this entity has a property assertion to a rdfs:comment
          bindingsStream.on('data', (row:MongoConfig) => {
              if(row['endpoint'] && row['databaseName'] && row['collectionName']){
                  const config = {
                    endpoint: row['endpoint'],
                    databaseName: row['databaseName'],
                    collectionName: row['collectionName']
                  }
                  resolve(config) 
              }
              reject(null)
          });

          bindingsStream.on('error', (err:Error) => {
              console.error(err)
              reject(null)
          });
      })
  })
}

  const loadTDfromRouting = async (subject:string)=>{
    const config = await getMongoConfig(subject) as MongoConfig
    console.log(`found config ${JSON.stringify(config)}`)
    const response = await fetch(`http://localhost:3001/api/td/${subject}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
     
    })
    .catch(error => {
      console.error(error)
      return;
    });
    response?.json().then((json)=>{
      console.dir(json)
    })
  }

  useEffect(() => {
    // load the td if chosen by the digital twin framework
    if(subject){
      loadTDfromRouting(subject)
    } 
    dragElement(document.getElementById("separator"), "H"); 
  }, [endpointUrl,subject])
  
  return(
    <Layout>
      <GlobalState>
        <main className="h-full w-screen flex flex-col">
            <AppHeader></AppHeader>
            <div className="flex-grow splitter flex flex-row w-full height-adjust">
                <div className="w-5/12" id="first"><JSONEditorComponent /></div>
                <div id="separator"></div>
                <div className="w-7/12" id="second"><TDViewer /></div>
            </div>
            <AppFooter></AppFooter>
            <div id="modal-root"></div>
        </main>
    </GlobalState>
    </Layout>

  )
  
}