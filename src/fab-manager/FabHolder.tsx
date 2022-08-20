//https://github.com/innFactory/react-planet
//https://morioh.com/p/a2d037c571d7


import { Quad, Store} from "n3"
import {Planet} from "react-planet"
import CustomBtn from "./buttons/CustomBtn"
import { PluginObject } from "./FabLoader";


export const FabHolder = ({endpointUrl, binding, store, fabs, actionHandler}:{endpointUrl:string, binding: Quad, store:Store, fabs:Array<PluginObject["component"]>, actionHandler: (jsxEl:JSX.Element)=>void}) => {

    return(
        <div>
            <p>{binding.object.value}</p>
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
                {fabs.map(f=>{
                    if(f)return f(endpointUrl,store,binding,actionHandler)
                    
                })}
                <div />
                <div />
                <div />
                <div />
            </Planet>
        </div>

    )
}
