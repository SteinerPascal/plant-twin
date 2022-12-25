//https://github.com/innFactory/react-planet
//https://morioh.com/p/a2d037c571d7
import { Quad, Store} from "n3"
import { useEffect, useState } from "react";
import {Planet} from "react-planet"
import SparqlHandler from "../../SparqlHandler";
import MuiIconMatcher from "../../iconmatcher/MuiIconMatcher";
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
        }
        fetchFabs()
    },[])

    const getFabs = ()=>{
        return loadedFabs?.map((f)=>{
           return <FabContainer key={`${f.component.name}-${quad.object.value}`} semanticQ={f.semanticQuery} comp={f.component} endpointUrl={endpointUrl} store={store} quad={quad} actionCB={actionHandler}  />
        })
    }

    const renderFabIcon = () => {
        if(quad.object.termType === "Literal") return MuiIconMatcher.getLiteralIcon()
        const quadSet = store.getQuads(quad.object,SparqlHandler.RDF.type,null,null)
        const icons:Array<JSX.Element> = []
        quadSet.forEach((q:Quad)=>{
          const match = MuiIconMatcher.matchBtnIcon(q.object.value)
          if(match){
            icons.push(match)
            return
          }
        })
        
        if(icons.length >= 1) return icons[0]
        // Try to match the predicate
        const prefixMatch = MuiIconMatcher.matchBtnIcon(quad.object.value)
        if(prefixMatch){
            icons.push(prefixMatch)
        }
        if(icons.length >= 1) return icons[0]

        return MuiIconMatcher.getDefaultBtnIcon()
        
      }

    const getWithoutNamespace = (iri:string)=>{
        if(iri.includes('#')) return iri.split('#').at(-1)
        return iri.split('/').at(-1)
    }
    return(
        <div>
            <p style={{position:'absolute',left:'-20px',top:'-40px', color:"white", width:'max-content'}}>{`${getWithoutNamespace(quad.predicate.value)} => ${getWithoutNamespace(quad.object.value)}`}</p>
            <Planet
                centerContent={<CustomBtn icon={renderFabIcon()}/>}
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
