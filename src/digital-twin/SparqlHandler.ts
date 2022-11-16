import { NamedNode } from "n3";
import SparqlClient from "sparql-http-client"
import { CONSTRUCT } from '@tpluscode/sparql-builder'
import namespace from '@rdfjs/namespace';
import { Quad } from "rdf-js";

//import QueryEngineBase from "@comunica/query-sparql-rdfjs";
//https://github.com/rubensworks/fetch-sparql-endpoint.js
export default class SparqlHandler {
    private static endpointUrl: string
    private static client: SparqlClient<Quad>
    static RDF = namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#")
    constructor(endpointUrl:string ){
        SparqlHandler.endpointUrl = endpointUrl
        SparqlHandler.client = new SparqlClient( {endpointUrl} )
    }

    // This gets all the related infos to the twin entity
    // It is the main source of information for all the FABs and actions
    static describeTwin(twinIRI:NamedNode){
        const query = CONSTRUCT`<http://twin-example/geneva#Oak_0> ?p ?o. ?o ${this.RDF.type} ?type`.WHERE`${twinIRI} ?p ?o. OPTIONAL{?o ${this.RDF.type} ?type}`.build()
        console.log(query)
        const bindingsStream = this.client.query.construct(query)
        return bindingsStream
    }

    static getEndpoint() {
        return this.endpointUrl
    }
    
    static setEndpoint(endpointUrl:string) {
        this.endpointUrl = endpointUrl
    }
}
