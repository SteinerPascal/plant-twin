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
    static RDFS = namespace('http://www.w3.org/2000/01/rdf-schema#')
    static SOSA = namespace('http://www.w3.org/ns/sosa/')
    static SSN = namespace('http://www.w3.org/ns/ssn/')
    static CASO = namespace('http://www.w3id.org/def/caso#')
    static IRRIG = namespace('http://www.w3id.org/def/irrig#')
    static GEO = namespace('http://www.opengis.net/ont/geosparql#')
    static SKOS = namespace('http://www.w3.org/2004/02/skos/core#')
    static SAREF = namespace('https://saref.etsi.org/core/')
    static SSNSYSTEM = namespace('http://www.w3.org/ns/ssn/systems/')
    static ns =  new Map<string, string>([
        ["rdf", 'http://www.w3.org/1999/02/22-rdf-syntax-ns#'],
        ["sosa", 'http://www.w3.org/ns/sosa/'],
        ['irrig', 'http://www.w3id.org/def/irrig']
    ]);

    private constructor(){}

    // This gets all the related infos to the twin entity
    // It is the main source of information for all the FABs and actions
    static describeTwin(twinIRI:NamedNode) {
        if(!this.client) throw Error('No SparqlClient initialized!')
        if(!this.validUrl(twinIRI.value)) throw Error(`Passed parameter ${twinIRI} is not a valid IRI`)
        const query = CONSTRUCT`${twinIRI} ?p ?o. ?o ${this.RDF.type} ?type`.WHERE`
        ${twinIRI} ?p ?o. FILTER(${twinIRI} != ?o)
        FILTER (!isBlank(?o)) 
        FILTER NOT EXISTS{${twinIRI} ${this.RDF.type} ?o.} 
        FILTER NOT EXISTS{${twinIRI} ${this.SSN.hasProperty} ?o.}
        FILTER NOT EXISTS{${twinIRI} ${this.SOSA.isFeatureOfInterestOf} ?o}
        OPTIONAL{?o ${this.RDF.type} ?type}`.build()
        const bindingsStream = this.client.query.construct(query)
        return bindingsStream
    }

    static getTwinState(twinIRI:NamedNode){
        if(!this.client) throw Error('No SparqlClient initialized!')
        if(!this.validUrl(twinIRI.value)) throw Error(`Passed parameter ${twinIRI} is not a valid IRI`)
        const query = SELECT`?propLbl ?deductionLbl ?stateLbl`.
        WHERE`?deduction a ${this.CASO.Deduction}; 
            ${this.SOSA.hasFeatureOfInterest} ${twinIRI}; 
            ${this.SOSA.observedProperty}/${this.RDFS.label} ?propLbl;
            ${this.CASO.hasResultState}/${this.RDFS.label} ?stateLbl. 
        `.build()
        console.dir(query)
        const bindingsStream = this.client.query.select(query)
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
    static getMapTreeData() {
        if(!this.client) throw Error('No SparqlClient initialized!')
        const query = SELECT`*`.WHERE`
        ?subject a ${this.IRRIG.Tree};
    	    ${this.GEO.hasGeometry} ?location;
    	    ${this.SKOS.prefLabel} ?preferred_label;
    	    ${this.SKOS.broader}/${this.SKOS.prefLabel}?broader_label.
        ?location ${this.GEO.asWKT} ?wkt`
        .build()
        const bindingsStream = this.client.query.select(query)
        return bindingsStream
    }

    static getMapDeviceData() {
        
        if(!this.client) throw Error('No SparqlClient initialized!')
        const query = CONSTRUCT`
        ?sensor a ${this.SAREF.Sensor};
        ${this.RDFS.label} ?label;
        ${this.GEO.hasLocation} ?location;
        <http://www.w3.org/ns/ssn/systems/hasSystemCapability>  ?capabilities.
        ?capabilities <http://www.w3.org/ns/ssn/systems/hasSystemProperty>  ?system_property.
        ?system_property ?p ?o.
        ?sensor ${this.GEO.hasCoverage} ?spatial_coverage.
        ?sensor ${this.RDFS.comment} ?comment
        `.WHERE`
        ?sensor a ${this.SAREF.Sensor};
    	    ${this.RDFS.label} ?label;
            ${this.GEO.hasGeometry}/${this.GEO.asWKT} ?location;
            <http://www.w3.org/ns/ssn/systems/hasSystemCapability> ?capabilities.
        ?capabilities <http://www.w3.org/ns/ssn/systems/hasSystemProperty> ?system_property.
        ?system_property ?p ?o.
        FILTER NOT EXISTS {?system_property ${this.RDF.type} ?o}
        OPTIONAL{
            ?system_property ${this.GEO.hasGeometry}/${this.GEO.asWKT} ?spatial_coverage.
        }
        OPTIONAL {
            ?sensor ${this.RDFS.comment} ?comment
        }`
        .build()
        console.log(query)
        const bindingsStream = this.client.query.construct(query)
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

    static getNamespaceObject(q:string):{namespace:string, value:string}{
        if(q.includes('#')){
            return {
                namespace: `${q.split('#').at(0)}#`,
                value: `${q.split('#').at(1)}`
            }
        } else {
            return {
                namespace:`${(q.split('/').slice(0, -1)).join('/')}`,
                value:`${q.split('/').pop()}`
            }
        }
    }
      

    
    private static validUrl = (url:string)=> {
        try {
            return new iri.IRI(url.trim()) // eslint-disable-line no-new
        } catch (_e) {
            return null
        }
    }

}
