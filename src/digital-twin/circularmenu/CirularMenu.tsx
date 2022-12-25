import { Quad, Store } from "n3";
import { useState } from "react";
import { useRef, useEffect,} from "react";
import { FabHolder } from "../fab-manager/FabHolder";
import MuiIconMatcher from "../../iconmatcher/MuiIconMatcher";
import IconButton from "@mui/material/IconButton";
import SparqlHandler from "../../SparqlHandler";
import ActionModal from "./ActionModal";
import "./menu.scss";


//https://codesandbox.io/s/circles-forked-wl8j87?file=/src/App.js

const CircularMenu = ({subject,endpointUrl,twinStore}:{subject:string,endpointUrl:string,twinStore:Store})=> {
  
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
  const twinicon = useRef<HTMLDivElement>(null);
  const [fabHolders,setFabHolders] = useState<null | JSX.Element[]>(null)

  //Utility function to set the right css to the htmldiv elements
  const styleChildren = (cyclegraph:HTMLDivElement,fabs:JSX.Element[])=>{

    let angle = 360 - 90;
    let dangle = 360 / fabs.length;

    const circleElements = fabs.map(el=>{
      angle += dangle;
      const style = {
        transform:`rotate(${angle}deg) translate(${cyclegraph.clientWidth /
        2.4}px) rotate(-${angle}deg)`
      }
      return <div key={angle} style={style} className='circle' >{el}</div>
    })
    return circleElements
  }


  // Here we need to load all the fabs e.g plugins
  // After they are loaded we call their utility function 'semanticQuery'. 
  // This query decides then if that fab is applicable for this data.
 
  useEffect(() => {
    const fetchPlugins = ()=>{
      // gets all the quads in the store
      const quadSet = twinStore.getQuads(subject,null,null,null)
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

  const renderTwinIcon = () => {
    const quadSet = twinStore.getQuads(subject,SparqlHandler.RDF.type,null,null)
    const icons:Array<JSX.Element> = []
    quadSet.forEach((q:Quad)=>{
      const match = MuiIconMatcher.matchTwinIcon(q.object.value)
      if(match) icons.push(match)
    })
    if(icons.length === 0) return MuiIconMatcher.getDefaultTwinIcon()
    return icons[0]
  }

  return (
    <div className="App">
       <ActionModal open={open} handleClose={handleClose} actionEl={actionEl}></ActionModal>
      <div className="cyclegraph" ref={graph}>
          {renderFabHolders()}
        <div className="twinicon" style={{zIndex:2,position:"absolute",marginLeft:'42%', marginTop:'42%'}} ref={twinicon}>
        <IconButton aria-label="custombtn"  sx={{backgroundColor:'#f1c27d', "&:hover": {
            backgroundColor: "#f1c27d",
            }}} >
        {renderTwinIcon()}
      </IconButton> 
        </div>
      </div>
    </div>
  );
}
export default CircularMenu