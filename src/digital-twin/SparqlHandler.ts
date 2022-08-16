import { NamedNode } from "n3";
import SparqlClient from "sparql-http-client"
import { CONSTRUCT } from '@tpluscode/sparql-builder'


//import QueryEngineBase from "@comunica/query-sparql-rdfjs";
//https://github.com/rubensworks/fetch-sparql-endpoint.js
export default class SparqlHandler {
    private endpointUrl
    private client
    constructor(endpointUrl:string ){
        this.endpointUrl = endpointUrl
        this.client = new SparqlClient( {endpointUrl} )
    }

    // Find a way on how to reference in the ontology what should be described
    async describeThing(){

    }
    // This gets all the related infos to the twin entity
    // It is the main source of information for all the FABs and actions
    describeTwin(twinIRI:NamedNode){
        const query = CONSTRUCT.WHERE`${twinIRI} ?p ?o`.build()
        const bindingsStream = this.client.query.construct(query)
        return bindingsStream
    }


    async queryConstruct(query:string){
        const bindingsStream = await this.client.query.construct(query)
        return bindingsStream
    }

    async querySelect(query:string) {
        const bindingsStream = await this.client.query.select(query)
        return bindingsStream
    }

    getEndpoint() {
        return this.endpointUrl
    }
    
    setEndpoint(endpointUrl:string) {
        this.endpointUrl = endpointUrl
    }
}
