import { Quad, Store } from "n3";
import { useState } from "react";
import { useRef, useEffect,} from "react";
import { FabHolder } from "../../fab-manager/FabHolder";
import ActionModal from "./ActionModal";

import "./menu.scss";


//https://codesandbox.io/s/circles-forked-wl8j87?file=/src/App.js

const CircularMenu = ({endpointUrl,twinStore}:{endpointUrl:string,twinStore:Store})=> {
  // Handling a action click on a plugin
  const [open, onFabOpen] = useState(false);
  const [actionEl, setActionEl] = useState(<div></div>)
  const handleClose = () =>{
    onFabOpen(false)
  } ;
  const handleClicked = (jsxEl:JSX.Element)=> {
      setActionEl(jsxEl)
      onFabOpen(true)
  }

  const graph = useRef<HTMLDivElement>(null);
  const [fabHolders,setFabHolders] = useState<null | JSX.Element[]>(null)

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
    return circleElements
  }


  // Here we need to load all the fabs e.g plugins
  // After they are loaded we call their utility function 'semanticQuery'. 
  // This query decides then if that fab is applicable for this data.
 
  useEffect(() => {
    const fetchPlugins = ()=>{
      // gets all the quads in the store
      const quadSet = twinStore.getQuads(null,null,null,null)
      const elements:Array<JSX.Element> = quadSet.map((q:Quad)=>{  
        return <FabHolder key={q.object.value} endpointUrl={endpointUrl} quad={q} store={twinStore} actionHandler={handleClicked}/>
      });
      setFabHolders(elements)
    }
    fetchPlugins()

  }, [twinStore]);

  // this method takes all the fabs. styles them and gives it back as a list
  const renderFabHolders = ()=>{
    if(fabHolders){
      if(graph.current){
      return styleChildren(graph.current,fabHolders)
      }
    } else {
      return <div>Loading Fabholders</div>
    }
  }

  return (
    <div className="App">
       <ActionModal open={open} handleClose={handleClose} actionEl={actionEl}></ActionModal>
      <div className="cyclegraph" ref={graph}>
          {renderFabHolders()}
      </div>
    </div>
  );
}
export default CircularMenu