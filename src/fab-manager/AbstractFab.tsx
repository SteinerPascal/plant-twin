
import { QueryEngine } from "@comunica/query-sparql"
import CircularMenu from "../digital-twin/circularmenu/CirularMenu"
import CustomBtn from "../digital-twin/circularmenu/buttons/CustomBtn"

const AbstractFAB = ({name,actionBtns}:{name:string,actionBtns:Array<typeof CustomBtn>}) => {
    
    const fetchRDFStream = async (queryEngine:QueryEngine, endpoint:string,queryString:string)=>{
        const bindingsStream = await queryEngine.queryBindings(queryString, {
        sources: [endpoint],
        });
        return bindingsStream
    }
}
export default AbstractFAB

