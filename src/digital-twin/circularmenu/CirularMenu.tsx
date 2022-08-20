import { Quad, Store } from "n3";
import { useState } from "react";
import { useRef, useEffect,} from "react";
import { FabHolder } from "../../fab-manager/FabHolder";
import FabLoader, { PluginObject } from "../../fab-manager/FabLoader";
import ActionModal from "./ActionModal";

import "./menu.scss";


//https://codesandbox.io/s/circles-forked-wl8j87?file=/src/App.js

const CircularMenu = ({endpointUrl,twinStore}:{endpointUrl:string,twinStore:Store})=> {
  // Handling a action click on a plugin
  const [open, onFabOpen] = useState(false);
  const [actionEl, setActionEl] = useState(<div></div>)
  const handleClose = () =>{
    console.warn('CLOSE')
    onFabOpen(false)
  } ;
  const handleClicked = (jsxEl:JSX.Element)=> {
      console.log('handleclicked')
      setActionEl(jsxEl)
      onFabOpen(true)
  }

  const graph = useRef<HTMLDivElement>(null);
  const [fabElements,setFabs] = useState<null | JSX.Element[]>(null)

  //Utility function to set the right css to the htmldiv elements
  const styleChildren = (cyclegraph:HTMLDivElement,fabs:JSX.Element[])=>{

    let angle = 360 - 90;
    let dangle = 360 / fabs.length;

    const circleElements = fabs.map(el=>{
      angle += dangle;
      const style = {
        transform:`rotate(${angle}deg) translate(${cyclegraph.clientWidth /
        1.9}px) rotate(-${angle}deg)`
      }
      return <div style={style} className='circle' >{el}</div>
    })
    console.log(`circles? ${circleElements.length}`)
    return circleElements
  }

  const fabLoader = new FabLoader()
  // Here we need to load all the fabs e.g plugins
  // After they are loaded we call their utility function 'semanticQuery'. 
  // This query decides then if that fab is applicable for this data.
  useEffect(() => {
    const fetchPlugins = async ()=>{
      const fabs = await fabLoader.loadFromConfig()
      // gets all the quads in the store
      const quadSet = twinStore.getQuads(null,null,null,null)
      console.log(`quadset ${quadSet.length}`)
      const elements:Array<JSX.Element> = []
      quadSet.forEach((q:Quad)=>{  

        const applicables:Array<PluginObject["component"]> = []     
        fabs.forEach(async (f)=>{
          if(await f?.semanticQuery(endpointUrl,twinStore,q.object)) return applicables.push(f.component)
        });
        elements.push( <FabHolder key={q.object.value} endpointUrl={endpointUrl} binding={q} store={twinStore} fabs={applicables} actionHandler={handleClicked}/>)
      });
      setFabs(elements)
    }
    fetchPlugins()

  }, [twinStore]);

  // this method takes all the fabs. styles them and gives it back as a list
  const renderFabs = ()=>{
    if(fabElements){
      if(graph.current){
      return styleChildren(graph.current,fabElements)
      }
    } else {
      return <div>Loading Fab</div>
    }
  }

  return (
    <div className="App">
       <ActionModal open={open} handleClose={handleClose} actionEl={actionEl}></ActionModal>
      <div className="cyclegraph" ref={graph}>
          {renderFabs()}
      </div>
    </div>
  );
}
export default CircularMenu