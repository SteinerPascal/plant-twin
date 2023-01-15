import { Quad, Quad_Object, Quad_Predicate, Quad_Subject } from "n3"
import SparqlHandler from "../SparqlHandler"

interface INode {
    id:number,name:string,termType:string,prefix:string
}
interface ILink {
    source:number,target:number, name:string, prefix:string
}
// uses Sets for easy converting of data
interface ID3JsInternal {
    nodes:Set<INode>
    links:Set<ILink>
}
// outside interface
export interface ID3Js {
    nodes:Array<INode>
    links:Array<ILink>
}

const convertToD3 = (quads:Quad[])=>{
    const nodes = new Map<string,INode>()
    const d3DataSet:ID3JsInternal = {
        nodes: new Set(),
        links: new Set()
    }
    let counter = 0
    const addNode = (term:Quad_Subject | Quad_Object)=>{
        let node:INode | null = null
        if(term.termType !== "Variable") {
            if(nodes.has(term.value)){
                const n =  nodes.get(term.value)
                if(n) node = n
            } else {
                const nsObj = SparqlHandler.getNamespaceObject(term.value)
                node = {
                    id: counter++,
                    name:nsObj.value,
                    termType:term.termType,
                    prefix: nsObj.namespace
                }
                nodes.set(term.value,node)
            }
        }
        return node
    }

    const addLink = (pred: Quad_Predicate,nodeSubj:INode,nodeObj:INode):ILink | null=>{
        if(pred.termType === "Variable") return null
        const nsObj = SparqlHandler.getNamespaceObject(pred.value)
        return {
            source:nodeSubj.id,
            target:nodeObj.id,
            name:nsObj.value,
            prefix:nsObj.namespace
        }
    }

    quads.forEach((q,i)=>{
        const nodeSubj = addNode(q.subject)
        const nodeObj = addNode(q.object)
        if(!(nodeSubj && nodeObj)) return
        const linkObj = addLink(q.predicate,nodeSubj,nodeObj)
        if(linkObj) d3DataSet.links.add(linkObj)
        d3DataSet.nodes.add(nodeSubj)
        d3DataSet.nodes.add(nodeObj)
    })

    return {
        nodes: Array.from(d3DataSet.nodes),
        links: Array.from(d3DataSet.links)
    }
}
export default convertToD3


