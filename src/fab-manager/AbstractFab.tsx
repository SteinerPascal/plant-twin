
import { QueryEngine } from "@comunica/query-sparql"
import CircularMenu from "../digital-twin/circularmenu/CirularMenu"

export default abstract class Plugin {
    private name:String
    private menu:typeof CircularMenu

    constructor(menu: typeof CircularMenu,name:string){
        this.menu = menu
        this.name = name
    }

    
    async isfetchStream(queryEngine:QueryEngine, endpoint:string,queryString:string){
        const bindingsStream = await queryEngine.queryBindings(queryString, {
        sources: [endpoint],
        });
        return bindingsStream
    }
}