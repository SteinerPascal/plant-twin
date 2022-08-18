import { Quad, Store } from "n3";
import { useState } from "react";
import { useRef, useEffect,} from "react";
import { FabHolder } from "../../fab-manager/FabHolder";
import FabLoader, { PluginObject } from "../../fab-manager/FabLoader";




import "./menu.scss";
//https://codesandbox.io/s/circles-forked-wl8j87?file=/src/App.js

//const Abstract = React.lazy(() => import("/home/pascal/plant-twin/src/fab-manager/AbstractFab") as Promise<{ default: ComponentType<any>; }>);

const CircularMenu = ({endpointUrl,twinStore}:{endpointUrl:string,twinStore:Store})=> {
  const graph = useRef<HTMLDivElement>(null);
  const [fabElements,setFabs] = useState<null | JSX.Element[]>(null)

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
  useEffect(() => {
    const fetchPlugins = async ()=>{
      const fabs = await fabLoader.loadFromConfig()
      // gets all the quads in the store
      const quadSet = twinStore.getQuads(null,null,null,null)
      console.log(`quadset ${quadSet.length}`)
      const elements:Array<JSX.Element> = []
      quadSet.forEach((q:Quad)=>{  

        const applicables:Array<PluginObject["component"]> = []     
        fabs.forEach(f=>{
          console.log(`loadedFab: ${console.dir(f)}`)
          if(f?.semanticQuery(endpointUrl,twinStore,q.object)) return applicables.push(f.component)
        });
        elements.push( <FabHolder key={q.object.value} endpointUrl={endpointUrl} binding={q} store={twinStore} fabs={applicables}/>)
      });
      setFabs(elements)
    }
    fetchPlugins()

  }, [twinStore]);

  const renderFabs = ()=>{
    if(fabElements){
      console.log('shouldbe loaded')
      if(graph.current){
      return styleChildren(graph.current,fabElements)
      }
    } else {
      return <div>Loading Fab</div>
    }
  }

  return (
    <div className="App">
      <div className="cyclegraph" ref={graph}>
          {renderFabs()}
      </div>
    </div>
  );
}
export default CircularMenu