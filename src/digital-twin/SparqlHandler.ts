import { NamedNode, Quad, Store } from "n3";
import {QueryEngine} from "@comunica/query-sparql"
import { CONSTRUCT } from '@tpluscode/sparql-builder'

//https://github.com/rubensworks/fetch-sparql-endpoint.js
export default class SparqlHandler {

    queryEngine = new QueryEngine()
    private endpoint;
    constructor(endpoint:string ){
        this.endpoint = endpoint
    }

    // Find a way on how to reference in the ontology what should be described
    async describeThing(){

    }
    // This gets all the related infos to the twin entity
    // It is the main source of information for all the FABs and actions
    async describeTwin(twinIRI:NamedNode){
        const query = CONSTRUCT.WHERE`${twinIRI} ?p ?o`.build()
        const bindingsStream = await this.queryEngine.queryBindings(query, {
        sources: ['https://fragments.dbpedia.org/2015/en'],
        });
        return bindingsStream
    }

    getEndpoint() {
        return this.endpoint
    }
    
    setEndpoint(endpoint:string) {
        this.endpoint = endpoint
    }
}
