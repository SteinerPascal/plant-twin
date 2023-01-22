import { NamedNode, Quad, Store } from "n3";
import { useState } from "react";
import { useRef, useEffect,} from "react";
import { FabHolder } from "../fab-manager/FabHolder";
import MuiIconMatcher from "../../iconmatcher/MuiIconMatcher";
import IconButton from "@mui/material/IconButton";
import SparqlHandler from "../../SparqlHandler";
import ActionModal from "./ActionModal";
import "./menu.scss";
import StateTable, { StateRow } from "./StateTable";
import DeductionTable, { DeductionRow } from "./DeductionTable";
import ProcessTable, { ProcessRow } from "./ProcessTable";


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
  const recommendedProcessClicked = (event:any) => {
    SparqlHandler.getProcessRecommendation(new NamedNode(event.currentTarget.value)).then(stream => {
      const states: ProcessRow[]= []
      stream.on('data',(row)=>{
        states.push({
          device: row['device'],
          deviceLbl: row['deviceLbl'],
          deviceDesc: row['deviceDesc'],
          aaLbl: row['aaLbl'],
          aaDesc: row['aaDesc'],
          procedure: row['procedure'],
          procedureLbl: row['procedureLbl']
        })
      })
      stream.on('end',()=>{
        console.log('states')
        console.dir(states)
        setActionEl(<ProcessTable stateData={states}  />)
        onFabOpen(true)
      })
    })
  }

  const stateEvaluationClicked = (event:any) => {
    const val = JSON.parse(event.currentTarget.value) as {deduction:string,foi:string}
    SparqlHandler.getDeductionExplanation(new NamedNode( val.deduction)).then(stream=>{
      const states: DeductionRow[]= []
      stream.on('data',(row)=>{
        states.push({
          foi: row['foi'],
          sensorLbl: row['sensorLbl'],
          deductionLbl: row['deductionLbl'],
          resStateLbl: row['resStateLbl'],
        })
      })
      stream.on('end',()=>{
        console.log('states')
        console.dir(states)
        setActionEl(<DeductionTable deduction={new NamedNode(val.deduction)} actionHandler={recommendedProcessClicked}stateData={states} />)
        onFabOpen(true)
      })
    })
  }

  const graph = useRef<HTMLDivElement>(null);
  const twinicon = useRef<HTMLDivElement>(null);
  const [fabHolders,setFabHolders] = useState<null | JSX.Element[]>(null)
  const [states, addStates] = useState<Array<StateRow>>([]);

  //Utility function to set the right css to the htmldiv elements
  const styleChildren = (cyclegraph:HTMLDivElement,fabs:JSX.Element[])=>{

    let angle = 170;
    let dangle = 190 / fabs.length;

    const circleElements = fabs.map(el=>{
      angle += dangle;
      const style = {
        transform:`rotate(${angle}deg) translate(${cyclegraph.clientWidth /
        1.6}px) rotate(-${angle}deg)`
      }
      const quad = el.props.quad
      return <div>
        <p className='text' style={{ fontSize:20, transform:`rotate(${angle}deg) translate(${cyclegraph.clientWidth / 2.1}px)`, color:"#935939", width:'max-content'}}>
            {`${getWithoutNamespace(quad.predicate.value)} =>`}
        </p>
        <div key={angle} style={style} className='circle' >{el}</div>
      </div>
      
    })
    return circleElements
  }


  const getWithoutNamespace = (iri:string)=>{
    if(iri.includes('#')) return iri.split('#').at(-1)
    return iri.split('/').at(-1)
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
    const fetchPropertyStates = () => {
      SparqlHandler.getTwinState(new NamedNode(subject)).then(stream=>{
        const states: StateRow[]= []
        stream.on('data',(row)=>{
          states.push({
            foi: row['foi'],
            deduction: row['deduction'],
            propLbl: row['propLbl'],
            stateLbl: row['stateLbl'],
            goalStateLbl: row['goalStateLbl'],
            sensor: row['sensor']

          })
        })
        stream.on('end',()=>{
          addStates(states)
        })
      })
    }
    fetchPlugins()
    fetchPropertyStates()
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
    <div className="App" style={{color:'#A36746'}}>
       <ActionModal open={open} handleClose={handleClose} actionEl={actionEl}></ActionModal>
      <div className="cyclegraph" ref={graph}>
          {renderFabHolders()}
        <div className="twinicon" style={{zIndex:2,position:"absolute",marginLeft:'56%', marginTop:'40%'}} ref={twinicon}>
        {renderTwinIcon()}
        </div>
        <h1 style={{color:"#935939", fontSize:"25px",position:"absolute",marginLeft:"55%",marginTop:"81%"}}>Digital Twin: {getWithoutNamespace(subject)}</h1>
        <StateTable  stateData={states} actionHandler={stateEvaluationClicked} />
      </div>
    </div>
  );
}
export default CircularMenu