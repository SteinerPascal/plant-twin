import { useEffect, useRef } from "react";
import "Sparnatural/dist/sparnatural.js"
import "Sparnatural/dist/sparnatural.css"
import Yasgui from "@triply/yasgui";
import "@triply/yasgui/build/yasgui.min.css";
import Tab from "@triply/yasgui/build/ts/src/Tab";
import Yasr from "@triply/yasr"
import * as CustomTable from "./plugins/custom-table/CustomTable";
import RoutingModal from "./modal/RoutingModal";
import React from "react";
import * as MapPlugin from "./plugins/map-plugin/MapPlugin";



// custom-table: Table plugin which reroutes clicks on IRIs to react routes
// map-plugin: Plugin which shows the result of geosparql in a map.
const registerYasrPlugins = () => {
 Yasgui.Yasr.registerPlugin('custom-table',CustomTable.default as any)
 Yasgui.Yasr.registerPlugin('custom-map',MapPlugin.default as any)
}


const Yasg = ({onTabChange}:{onTabChange:(changetab:Tab)=>void}) => {
  // Modal state
  const [open, setOpen] = React.useState(false);
  const [iriString, setIRI] = React.useState('');
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  // registers click listener on YASR 
  // CustomTable component emits YasrIriClick even on clicks on IRI's
  const registerURICliclListener = (yasr:Yasr) => {
    yasr.rootEl.addEventListener('YasrIriClick',(evt:Event)=>{
      let iri = (evt as CustomEvent).detail // need to cast. see: https://github.com/microsoft/TypeScript/issues/28357
      handleOpen()
      setIRI(iri)
    })
  }

  
  const refContainer = useRef<HTMLElement | null>(null);
  useEffect(() => {
    // initialize YASGUI
    refContainer.current = document.getElementById("yasgui")
    if(refContainer.current && (refContainer.current.children.length === 0)){
      registerYasrPlugins()
      Yasgui.Yasr.plugins.table.defaults.openIriInNewWindow = false
      let yasg =new Yasgui(refContainer.current, { requestConfig: { endpoint: "http://localhost:7200/repositories/geneva-example" }, copyEndpointOnNewTab: true});
      let initTab = yasg.getTab()
      if(initTab){
        registerURICliclListener(initTab.getYasr())
        initTab.getYasr().config.pluginOrder = [
          "table",
          "response",
          "custom-map",
          "boolean",
          "error"
      ]
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
      <RoutingModal open={open} handleClose={handleClose} iri={iriString}></RoutingModal>
      <div className="row">
        <div id="yasgui" />
      </div>
    </div>
  );
};

export default Yasg;
