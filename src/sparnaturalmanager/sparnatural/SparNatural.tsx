import {useEffect, useRef, useState } from "react";

import "Sparnatural/dist/sparnatural.js"
import "Sparnatural/dist/sparnatural.css"
import config from "./config";
import Tab from "@triply/yasgui/build/ts/src/Tab";

interface SparNatural extends HTMLElement {
  settings:any
}

const Sparnatural =({tab}:{tab:Tab | null}) => {
  const [error, setError] = useState(false);
  if (error) {
    throw error;
  }
  
  const sparRef = useRef<Element|null>(null);
  useEffect(() => {
    //let sparObj = new SparNatural()
      // If you would like to overwride default settings
    let settings = {
      config: config,
      //language:lang,
      onQueryUpdated: function(queryString:string, queryJson:any, specProvider:any) {
        queryString = specProvider.expandSparql(queryString);
        queryString = semanticPostProcess(queryString, queryJson);
        tab?.getYasqe()?.setValue(queryString)
        tab?.getYasqe()?.addPrefixes({"gn": "http://www.geonames.org/ontology#"})

      },
      sparqlPrefixes:{
        "gn": "http://www.geonames.org/ontology#"
      }
    }

    let spar = document.querySelector('spar-natural') as SparNatural;
    sparRef.current = spar
    
    let semanticPostProcess = function(queryString:string, queryJson:any) {
      queryString = prefixesPostProcess(queryString, queryJson);
      return queryString;
    } 
    let prefixesPostProcess = function(queryString:string, queryJson:any) {
      if(queryString.indexOf("rdf-schema#") == -1) {
        queryString = queryString.replace("SELECT ", "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> \nSELECT ");
      }         
      return queryString;
    }
    if(tab != null) spar.settings = settings
  });
  return (
    <div>
      <link
        href="https://stackpath.bootstrapcdn.com/bootswatch/4.3.1/litera/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-D/7uAka7uwterkSxa2LwZR7RJqH2X6jfmhkJ0vFPGUtPyBMF2WMq9S+f9Ik5jJu1"
        crossOrigin="anonymous"
      />

    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@5.9.0/css/all.min.css"
    />
      <div id="ui-search" style={{width:"auto"}}>
      <spar-natural></spar-natural>
      </div>
    </div>

  );
};

export default Sparnatural;
