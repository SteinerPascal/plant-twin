import { Quad, Store } from "n3"
import { useEffect, useState } from "react"
import { PluginObject } from "./FabLoader"

export default function FabContainer({semanticQ, comp,endpointUrl,store,quad,actionCB}:{semanticQ:PluginObject["semanticQuery"] ,comp:PluginObject["component"],endpointUrl:string,store:Store,quad:Quad,actionCB: (jsxEl:JSX.Element)=>void}){
    const [fab,addFab] = useState<JSX.Element>()
	useEffect(() => {
        const fetchFab = async ()=>{
            const renderable = await semanticQ(endpointUrl,store,quad)
            if(renderable) addFab(comp(endpointUrl,store,quad,actionCB))
        }
        fetchFab()
    },[])
	

    return(
        <div>
            {fab}
        </div>
 
    )
}