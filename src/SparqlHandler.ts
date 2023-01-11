import { NamedNode, Store } from "n3";
import SparqlClient from "sparql-http-client"
import { CONSTRUCT, SELECT } from '@tpluscode/sparql-builder'
import namespace from '@rdfjs/namespace';
import iri from "iri"
//import QueryEngineBase from "@comunica/query-sparql-rdfjs";
//https://github.com/rubensworks/fetch-sparql-endpoint.js
export default class SparqlHandler {
    private static endpointUrl:string = '';
    private static client: SparqlClient
    static rdfStore = new Store()
    static RDF = namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#")
    static SOSA = namespace('http://www.w3.org/ns/sosa/')
    static IRRIG = namespace('http://www.w3id.org/def/irrig#')
    static GEO = namespace('http://www.opengis.net/ont/geosparql#')
    static SKOS = namespace('http://www.w3.org/2004/02/skos/core#')
    static ns =  new Map<string, string>([
        ["rdf", 'http://www.w3.org/1999/02/22-rdf-syntax-ns#'],
        ["sosa", 'http://www.w3.org/ns/sosa/'],
        ['irrig', 'http://www.w3id.org/def/irrig']
    ]);

    
    private constructor(){

    }

    // This gets all the related infos to the twin entity
    // It is the main source of information for all the FABs and actions
    static describeTwin(twinIRI:NamedNode) {
        if(!this.client) throw Error('No SparqlClient initialized!')
        if(!this.validUrl(twinIRI.value)) throw Error(`Passed parameter ${twinIRI} is not a valid IRI`)
        const query = CONSTRUCT`${twinIRI} ?p ?o. ?o ${this.RDF.type} ?type`.WHERE`${twinIRI} ?p ?o. OPTIONAL{?o ${this.RDF.type} ?type}`.build()
        console.log(query)
        const bindingsStream = this.client.query.construct(query)
        return bindingsStream
    }

    static explainActuation(actuationIRI:NamedNode) {
        if(!this.client) throw Error('No SparqlClient initialized!')
        if(!this.validUrl(actuationIRI.value)) throw Error(`Passed parameter ${actuationIRI} is not a valid IRI`)
        const query = CONSTRUCT`${actuationIRI} ?p ?o. `.WHERE`${actuationIRI} ?p ?o.`.build()
        console.log(query)
        const bindingsStream = this.client.query.construct(query)
        return bindingsStream
    }
    // Retrives data for the LeafletContainer
    static getMapData() {
        if(!this.client) throw Error('No SparqlClient initialized!')
        const query = SELECT`*`.WHERE`
        ?s a ${this.IRRIG.Tree};
    	    ${this.GEO.hasGeometry} ?pt;
    	    ${this.SKOS.prefLabel} ?prefLbl;
    	    ${this.SKOS.broader}/${this.SKOS.prefLabel}?broaderLbl.
        ?pt ${this.GEO.asWKT} ?wkt`.LIMIT(100)
        .build()
        const bindingsStream = this.client.query.select(query)
        return bindingsStream
    }

    static getEndpointUrl() {
        return this.endpointUrl
    }
    
    private static setEndpoint(endpointUrl:string) {
        this.endpointUrl = endpointUrl
    }

    static initSparqlClient(endpointUrl:string){
        this.setEndpoint(endpointUrl)
        this.client = new SparqlClient({endpointUrl})
    }

    
    private static validUrl = (url:string)=> {
        try {
            return new iri.IRI(url.trim()) // eslint-disable-line no-new
        } catch (_e) {
            return null
        }
    }

}
