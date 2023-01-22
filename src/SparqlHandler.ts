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
    static PROV = namespace('http://www.w3.org/ns/prov#')
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

        const query = SELECT`?foi ?deduction ?propLbl ?stateLbl ?goalStateLbl (GROUP_CONCAT(DISTINCT ?sensor; SEPARATOR=", ") as ?sensor)`.WHERE`
        ?deduction a <http://www.w3id.org/def/caso#Deduction>;
            ${this.SOSA.hasFeatureOfInterest} ${twinIRI};
            ${this.SOSA.hasFeatureOfInterest} ?foi;
            ${this.SOSA.observedProperty}/${this.RDFS.label} ?propLbl;
            <http://www.w3id.org/def/caso#hasResultState> ?resState.
            ?resState ${this.RDFS.label} ?stateLbl;
            	^<http://www.w3id.org/def/caso#hasState> ?stateProp.  
        OPTIONAL{
            ?deduction ${this.SOSA.hasFeatureOfInterest}/${this.IRRIG.hasGoalState} ?propState.
            ?propState ${this.RDFS.label} ?lbl;
                ^<http://www.w3id.org/def/caso#hasState> ?stateProp #must belong to the same prop
        }
        BIND(COALESCE(?lbl,"No goal state defined") as ?goalStateLbl)
        OPTIONAL{
            ?deduction ${this.PROV.wasInformedBy}/${this.SOSA.madeBySensor}/${this.RDFS.label} ?sensor
        }
        `.GROUP().BY('propLbl').THEN.BY('foi').THEN.BY('stateLbl').THEN.BY('goalStateLbl').THEN.BY('deduction').build()
        console.dir(query)
        
        const bindingsStream = this.client.query.select(query)
        return bindingsStream
    }

    static getDeductionExplanation(deductionIRI:NamedNode){
        if(!this.client) throw Error('No SparqlClient initialized!')
        if(!this.validUrl(deductionIRI.value)) throw Error(`Passed parameter ${deductionIRI.value} is not a valid IRI`)
        const query = SELECT`?foi ?sensorLbl ?deductionLbl ?resStateLbl`.WHERE`
        ${deductionIRI} ${this.PROV.wasInformedBy}+ ?deduction.
        ${deductionIRI} ${this.SOSA.hasFeatureOfInterest} ?foi
        {
            ?deduction a ${this.SOSA.Observation}.
            ${deductionIRI} ${this.RDFS.label} ?deductionLbl.
            ?deduction ${this.PROV.wasInformedBy}/${this.SOSA.madeBySensor}/${this.RDFS.label} ?sensorLbl.
            ${deductionIRI} <http://www.w3id.org/def/caso#hasResultState> ?resState.
            ?resState ${this.RDFS.label} ?resStateLbl
        } UNION {
            ?deduction a <http://www.w3id.org/def/caso#:Deduction>.
            ?deduction ${this.RDFS.label} ?deductionLbl.
            ?deduction ${this.PROV.wasInformedBy}/${this.SOSA.madeBySensor}/${this.RDFS.label} ?sensorLbl.
            ?deduction <http://www.w3id.org/def/caso#hasResultState> ?resState.
            ?resState ${this.RDFS.label} ?resStateLbl
        }`.build()
        console.log(query)
        const bindingsStream = this.client.query.select(query)
        return bindingsStream
    }

    static getProcessRecommendation(waterNeedDed:NamedNode){
        if(!this.client) throw Error('No SparqlClient initialized!')
        if(!this.validUrl(waterNeedDed.value)) throw Error(`Passed parameter ${waterNeedDed.value} is not a valid IRI`)
        const query = SELECT`?device ?deviceLbl ?deviceDesc ?aaLbl ?aaDesc ?procedure ?procedureLbl ?resState ?goalState`.WHERE`
            ${waterNeedDed} ${this.PROV.wasInformedBy}+ ?deduction.
            ?deduction a <http://www.w3id.org/def/caso#Deduction>;
                ${this.SOSA.hasFeatureOfInterest} ?foi;
                <http://www.w3id.org/def/caso#hasResultState> ?resState.
                ?resState ^<http://www.w3id.org/def/caso#hasState> ?stateProp.
                ?foi <http://www.w3id.org/def/irrig#hasGoalState> ?goalState.
                ?goalState ^<http://www.w3id.org/def/caso#hasState> ?stateProp
                FILTER(?goalState != ?resState)
            ?procedure a sosa:Procedure.
            ?procedure ssn:hasInput ?resState.
            ?procedure ssn:hasOutput ?goalState.
            ?resState <http://www.w3id.org/def/caso#greaterThan>|<http://www.w3id.org/def/caso#lesserThan> ?goalState.
            ?procedure rdfs:label ?procedureLbl.
            ?device a ${this.SAREF.Actuator};
                <https://www.w3.org/2019/wot/td#title> ?deviceLbl;
                <https://www.w3.org/2019/wot/td#hasActionAffordance> ?aa.
            OPTIONAL{
                    ?device <https://www.w3.org/2019/wot/td#description> ?deviceDesc
                }
                ?aa ${this.SSN.implements} ?procedure;
                    <https://www.w3.org/2019/wot/td#title> ?aaLbl
            OPTIONAL{
                ?aa <https://www.w3.org/2019/wot/td#description> ?aaDesc
            }
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
        ?sensor ${this.GEO.hasSensingRadius} ?spatial_coverage.
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
