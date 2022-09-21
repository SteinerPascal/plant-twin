//https://github.com/innFactory/react-planet
//https://morioh.com/p/a2d037c571d7
import { Quad, Store} from "n3"
import React, { Suspense } from "react";
import { useEffect, useState } from "react";
import {Planet} from "react-planet"
import CustomBtn from "./buttons/CustomBtn"
import FabContainer from "./FabContainer";
import FabLoader, { PluginObject } from "./FabLoader";


export const FabHolder = ({endpointUrl, quad, store, actionHandler}:{endpointUrl:string, quad: Quad, store:Store, actionHandler: (jsxEl:JSX.Element)=>void}) => {
    const fabLoader = new FabLoader()
    const [loadedFabs,addFabs] = useState<PluginObject[]>()
 
    useEffect(() => {
        const fetchFabs = async ()=>{
            const fabs = await fabLoader.loadFromConfig()
            addFabs(fabs)
            console.log('fabs loaded')
        }
        fetchFabs()
    },[])
    const getFabs = ()=>{
        return loadedFabs?.map((f)=>{
           return <FabContainer semanticQ={f.semanticQuery} comp={f.component} endpointUrl={endpointUrl} store={store} quad={quad} actionCB={actionHandler}  />
        })
    }
    return(
        <div>
            <p style={{color:"white"}}>{quad.object.value}</p>
            <Planet
                centerContent={<CustomBtn />}
                hideOrbit
                autoClose={true}
                orbitRadius={60}
                bounceOnClose
                rotation={105}
                // the bounce direction is minimal visible
                // but on close it seems the button wobbling a bit to the bottom
                bounceDirection="BOTTOM"
                >
                {getFabs()}
                    
                <div />
                <div />
            </Planet>
        </div>
    )
}
