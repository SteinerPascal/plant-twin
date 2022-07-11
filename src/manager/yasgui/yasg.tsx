import React, { useEffect, useRef, useState } from "react";
import "Sparnatural/dist/sparnatural.js"
import "Sparnatural/dist/sparnatural.css"
import Yasgui from "@triply/yasgui";
import "@triply/yasgui/build/yasgui.min.css";
import Tab from "@triply/yasgui/build/ts/src/Tab";

const Yasg = ({onTabChange}:{onTabChange:(changetab:Tab)=>void}) => {

  let el:HTMLElement | null
  useEffect(() => {
    el = document.getElementById("yasgui")
    console.dir(el)
    if(el){
        console.dir(Yasgui.defaults)
      let yasg =new Yasgui(el, { requestConfig: { endpoint: "http://example.com/sparql" }, copyEndpointOnNewTab: false});

      let initTab = yasg.getTab()
      if(initTab){
        onTabChange(initTab)
      } else {
        throw Error('initTab not found in Yasgui component')
      }
      
      yasg.on("tabAdd", (instance: Yasgui, newTabId: string) => {
        //check if current Tab exists
        let tab = yasg.getTab(newTabId)
        if(tab){
            onTabChange(tab)
            return
        } 
        throw Error(`yasgui tab id: ${newTabId} wasn't found!`)
        
        // TODO delete or prevent tab from getting created
      });
    }else{
      throw Error("Couldn't find element yasgui")
    }
  }, []);

  return (
    <div>
      <div className="row">
        <div id="yasgui" />
      </div>
    </div>
  );
};

export default Yasg;
