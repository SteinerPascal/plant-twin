import { useEffect, useState } from "react"

function CustomPopUp({popUpObj}:{popUpObj: {[key:string]:string}}) {
    const [popup,addPopUp] = useState<JSX.Element>()
    useEffect(() => {
        let index = 0
        let contentElements = []
        for (const [k, v] of Object.entries(popUpObj)) {
            const content = <div key={index}>
                 <a style={{cursor:"pointer"}}href={v}>{k}: {v}</a>
            </div>
            
            //contentString = `${contentString} <br> ${k}: {<a class='iri' style="cursor: pointer; color:blue;">${v}</a>`
            contentElements.push(content)
            index++
        }
        addPopUp(<div>{contentElements}</div>)
    },[])
	
    return (
        <div style={{width:"300px"}}>
            {popup}
        </div>
    );
  }
  export default CustomPopUp;