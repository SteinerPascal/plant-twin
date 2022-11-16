import { NamedNode, Quad_Object, Quad_Predicate, Quad_Subject, Store } from "n3"
interface INode {
    id:number,name:string,group:string
}
interface ILink {
    source:number,target:number, type:string
}
export interface ID3Js {
    nodes:Set<INode>
    links:Set<ILink>
}

const convertToD3 = (subject:NamedNode,store:Store)=>{
    const quads = store.getQuads(subject,null,null,new NamedNode('http://twin/forceGraph/'))
    const nodes = new Map<string,INode>()
    const d3DataSet:ID3Js = {
        nodes: new Set(),
        links: new Set()
    }

    const addNode = (term:Quad_Subject | Quad_Object,i:number)=>{
        let node:INode | null = null
        if(term.termType !== "Variable") {
            if(nodes.has(term.value)){
                const n =  nodes.get(term.value)
                if(n) node = n
            } else {
                node = {
                    id: i,
                    name:term.value,
                    group:term.termType
                }
                nodes.set(term.value,node)
            }
        }
        return node
    }

    const addLink = (pred: Quad_Predicate,nodeSubj:INode,nodeObj:INode):ILink | null=>{
        if(pred.termType === "Variable") return null
        return {
            source:nodeSubj.id,
            target:nodeObj.id,
            type:pred.value
        }
    }

    quads.forEach((q,i)=>{
        const nodeSubj = addNode( q.subject,i)
        const nodeObj = addNode(q.object,i)
        if(!(nodeSubj && nodeObj)) return
        const linkObj = addLink(q.predicate,nodeSubj,nodeObj)
        if(linkObj) d3DataSet.links.add(linkObj)
        d3DataSet.nodes.add(nodeSubj)
        d3DataSet.nodes.add(nodeObj)
    })
    return d3DataSet
}
export default convertToD3


