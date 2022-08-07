import {useState } from "react";
import Layout from '../layout/Layout'
import "Sparnatural/dist/sparnatural.js"
import "Sparnatural/dist/sparnatural.css"
import Sparnatural from "./sparnatural/SparNatural";
import "@triply/yasgui/build/yasgui.min.css";
import Tab from "@triply/yasgui/build/ts/src/Tab";
import Yasg from "./yasgui/yasg";
import SparNaturalManagerBoundary from "./sparnatural/SparNaturalManagerBoundary";


const Manager = () => {

  const [tab, setTab] = useState<Tab | null>(null);
  
  const onTabChange = (tab:Tab)=>{
    setTab(tab)
  }

  return (
    <Layout>
      <h1>Digital Twin Manager</h1>
      <div className="row">
        <div id="ui-search" style={{width:"auto"}}>
        <SparNaturalManagerBoundary>
          <Sparnatural tab={tab} ></Sparnatural>
        </SparNaturalManagerBoundary>
        </div>
      </div>
      <div className="row">
        <Yasg onTabChange={onTabChange}></Yasg>
      </div>
    </Layout>
  );
};

export default Manager;
