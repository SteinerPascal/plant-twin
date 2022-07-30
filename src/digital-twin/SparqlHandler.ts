import {ISparqlEndpointFetcherArgs, SparqlEndpointFetcher} from "fetch-sparql-endpoint";

//https://github.com/rubensworks/fetch-sparql-endpoint.js
export default class SparqlHandler {
    private fetcher = new SparqlEndpointFetcher();
    private endpoint;
    private config;
    constructor(endpoint:string , config?:ISparqlEndpointFetcherArgs){
        this.endpoint = endpoint
        this.config = config
    }

    // find a way on how to reference in the ontology what should be described
    describeThing(query:string){

    }

    getDescriptionQuery(fetchDescrQuery:string){
        let res = ''
        this.fetcher.fetchTriples(this.endpoint,fetchDescrQuery)
        return res
    }

    getEndpoint() {
        return this.endpoint
    }
    
    setEndpoint(endpoint:string) {
        this.endpoint = endpoint
    }
}
