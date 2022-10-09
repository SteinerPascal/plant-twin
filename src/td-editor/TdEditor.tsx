import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../layout/Layout";
import AppFooter from "./AppFooter";
import AppHeader from "./components/AppHeader/AppHeader";
import JSONEditorComponent from "./components/Editor/Editor";
import TDViewer from "./components/TDViewer/TDViewer";
import GlobalState from "./context/GlobalState";

interface RoutingState {
  subject: string
}
export default function TdEditor(props:any) {

  const [subject,changeSubject] = useState<string | undefined>((useLocation().state as RoutingState)?.subject)

  
  const dragElement = (element:any, direction:any) => {
    let md:any;
    const first = document.getElementById("first");
    const second = document.getElementById("second");

    const onMouseMove = (e:any) => {
        var delta = {
            x: e.clientX - md.e.clientX,
            y: e.clientY - md.e.clientY
        };

        if (direction === "H") {
            delta.x = Math.min(Math.max(delta.x, -md.firstWidth),
                md.secondWidth);

            element.style.left = md.offsetLeft + delta.x + "px";
            if(first && second){
              first.style.width = (md.firstWidth + delta.x) + "px";
              //second.style.width = (md.secondWidth - delta.x) + "px";
            }
           
        }
    }

    const onMouseDown = (e:any) => {
      if(!first || !second) return
        md = {
            e,
            offsetLeft: element.offsetLeft,
            offsetTop: element.offsetTop,
            firstWidth: first.offsetWidth,
            secondWidth: second.offsetWidth
        };
        document.onmousemove = onMouseMove;
        document.onmouseup = () => {
            document.onmousemove = document.onmouseup = null;
        }
    }

    element.onmousedown = onMouseDown;
}

  const loadTDfromRouting = async (subject:string)=>{
    
  }

  useEffect(() => {
    // load the td if chosen by the digital twin framework
    if(subject){
      loadTDfromRouting(subject)
    } 
    dragElement(document.getElementById("separator"), "H"); 
  }, [props])
  
  return(
    <Layout>
      <GlobalState>
        <main className="h-full w-screen flex flex-col">
            <AppHeader></AppHeader>
            <div className="flex-grow splitter flex flex-row w-full height-adjust">
                <div className="w-5/12" id="first"><JSONEditorComponent /></div>
                <div id="separator"></div>
                <div className="w-7/12" id="second"><TDViewer /></div>
            </div>
            <AppFooter></AppFooter>
            <div id="modal-root"></div>
        </main>
    </GlobalState>
    </Layout>

  )
  
}