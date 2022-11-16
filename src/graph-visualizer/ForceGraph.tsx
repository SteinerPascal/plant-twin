import { Store } from "n3";
import { useState } from "react";
import { NamedNode } from "n3";
import convertToD3 from "./quad2D3";
import ActionModal from "../digital-twin/circularmenu/ActionModal";
import GraphComponent from "./GraphComponent";


export default function ForceGraph({subject,store}:{subject:NamedNode,store:Store}){
    const [open, onFabOpen] = useState(false);
    const handleClicked = (jsxEl:JSX.Element)=> {
        onFabOpen(true)
    }
    const [dataSet,setDataSet] = useState(()=>{
        return convertToD3(subject,store)
     })

    const handleClose = () =>{
        onFabOpen(false)
    } ;

    console.dir(dataSet)

    return(
        <ActionModal open={open} handleClose={handleClose } actionEl={<GraphComponent dataSet={dataSet}/>} />
            
        
    )

}