
export default {
  "@context": {
    Ontology: "http://www.w3.org/2002/07/owl#Ontology",
    Class: "http://www.w3.org/2002/07/owl#Class",
    ObjectProperty: "http://www.w3.org/2002/07/owl#ObjectProperty",
    label: "http://www.w3.org/2000/01/rdf-schema#label",
    domain: {
      "@id": "http://www.w3.org/2000/01/rdf-schema#domain",
      "@type": "@id",
    },
    range: {
      "@id": "http://www.w3.org/2000/01/rdf-schema#range",
      "@type": "@id",
    },
    unionOf: {
      "@id": "http://www.w3.org/2002/07/owl#unionOf",
      "@type": "@id",
    },
    subPropertyOf: {
      "@id": "http://www.w3.org/2000/01/rdf-schema#subPropertyOf",
      "@type": "@id",
    },
    faIcon:
      "http://data.sparna.fr/ontologies/sparnatural-config-core#faIcon",
    tooltip:
      "http://data.sparna.fr/ontologies/sparnatural-config-core#tooltip",
    sparqlString:
      "http://data.sparna.fr/ontologies/sparnatural-config-core#sparqlString",
    sparnatural:
      "http://data.sparna.fr/ontologies/sparnatural-config-core#",
    datasources:
      "http://data.sparna.fr/ontologies/sparnatural-config-datasources#",
  },
  "@graph": [
    {
      "@id": "http://labs.sparna.fr/sparnatural-demo-dbpedia/onto",
      "@type": "Ontology",
    },
    {
      "@id": "http://www.w3.org/ns/sosa/Actuator",
      "@type": "Class",
      label: [
        { "@value": "Actuator", "@language": "en" },
        { "@value": "Actuator", "@language": "fr" },
      ],
      faIcon: "fa-solid fa-microchip",
    },
    {
      "@id": "http://www.w3id.org/def/irrig#Tree",
      "@type": "Class",
      label: [
        { "@value": "Tree", "@language": "en" },
        { "@value": "Arbre", "@language": "fr" },
      ],
      tooltip: [
        { "@value": "en", "@language": "en" },
        { "@value": "fr", "@language": "fr" },
      ],
      faIcon: "fa-solid fa-tree",
      defaultLabelProperty:
      "http://labs.sparna.fr/sparnatural-demo-dbpedia/onto#auto_label"
    },
    {
      "@id": "http://aims.fao.org/aos/agrovoc/c_5630",
      "@type": "Class",
      label: [
        { "@value": "Pathogen", "@language": "en" },
        { "@value": "Pathogen", "@language": "fr" },
      ],
      faIcon: "fas fa-bug",
      defaultLabelProperty:
        "http://labs.sparna.fr/sparnatural-demo-dbpedia/onto#auto_label"
    },
    {
      "@id": "http://www.w3.org/ns/sosa/Sensor",
      "@type": "Class",
      label: [
        { "@value": "Sensor", "@language": "en" },
        { "@value": "Sensor", "@language": "fr" },
      ],
      faIcon: "fa-solid fa-microscope",
    },
    {
      "@id":
        "http://labs.sparna.fr/sparnatural-demo-dbpedia/onto#Unknown",
      "@type": "Class",
      label: [
        { "@value": "Unknown class", "@language": "en" },
        { "@value": "Classe inconnue", "@language": "fr" },
      ],
      faIcon: "fa-solid fa-question",
    },

    {
      "@id": "http://labs.sparna.fr/sparnatural-demo-dbpedia/onto#Date",
      "@type": "Class",
      subClassOf: "http://www.w3.org/2000/01/rdf-schema#Literal",
      label: [
        { "@value": "Date", "@language": "en" },
        { "@value": "Date", "@language": "fr" },
      ],
      faIcon: "fas fa-calendar-alt",
    },
    {
      "@id":"http://labs.sparna.fr/sparnatural-demo-dbpedia/onto#Area",
      "@type": "Class",
      subClassOf: "http://www.w3.org/2000/01/rdf-schema#Literal",
      label: [
        { "@value": "Area", "@language": "en" },
        { "@value": "Région", "@language": "fr" },
      ],
      faIcon: "fa-solid fa-earth-africa"
    },
    {
      "@id":"http://www.geonames.org/ontology#A.ADM1",
      "@type": "Class",
      label: [
        { "@value": "Canton", "@language": "en" },
        { "@value": "Canton", "@language": "fr" },
      ],
      faIcon: "fa-solid fa-map-pin"
    },
    {
      "@id":"http://twin-example/zurich#AgrovocTerm",
      "@type": "Class",
      label: [
        { "@value": "Tree type", "@language": "en" },
        { "@value": "Tree type", "@language": "fr" },
      ],
      faIcon: "fa-solid fa-leaf"
    },
    {
      "@id":"http://www.w3.org/ns/ssn/Property",
      "@type": "Class",
      label: [
        { "@value": "Property", "@language": "en" },
        { "@value": "Property", "@language": "fr" },
      ],
      faIcon: "fa-solid fa-star-shooting"
    },
    {
      "@id":"http://twin-example/zurich#Location",
      "@type": "Class",
      subClassOf: "http://www.w3.org/2000/01/rdf-schema#Literal",
      label: [
        { "@value": "Location", "@language": "en" },
        { "@value": "Location", "@language": "fr" },
      ],
      faIcon: "fas fa-map-marked-alt",
    },
    {

    },
    {
      "@id": "http://www.w3.org/ns/sosa/observesProperty",
      "@type": "ObjectProperty",
      subPropertyOf: "sparnatural:ListProperty",
      datasource: "datasources:list_rdfslabel_alpha_with_count",
      label: [
        { "@value": "observes", "@language": "en" },
        { "@value": "observes", "@language": "fr" },
      ],
      tooltip: [
        {
          "@value": "A sensor observes a Property of a feature of interest",
          "@language": "en",
        },
        {
          "@value": "A sensor observes a Property of a feature of interest",
          "@language": "fr",
        },
      ],
      domain:"http://www.w3.org/ns/sosa/Sensor",
      range: "http://www.w3.org/ns/ssn/Property",
      enableOptional: true,
      enableNegation: true,
    },
    {
      "@id": "http://twin-example/zurich#agrovocBroader",
      "@type": "ObjectProperty",
      subPropertyOf: "sparnatural:ListProperty",
      datasource: {
          queryString: `
          PREFIX agrovoc: <http://aims.fao.org/aos/agrovoc/>
          PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
          PREFIX irrig: <http://www.w3id.org/def/irrig#>
          PREFIX ex: <http://twin-example/zurich#>
          PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
          select distinct ?uri ?label where {
              ?tree rdf:type irrig:Tree.
              ?tree skos:broader ?broad.
              ?broad skos:prefLabel ?agrovocTerm.
              ?tree ex:agrovocBroader ?broader
              BIND(?broader as ?uri)
              Bind(?agrovocTerm as ?label)
          }`,
          sparqlEndpointUrl:"http://localhost:7200/repositories/map-data"
        },
      label: [
        { "@value": "is of Tree type", "@language": "en" },
        { "@value": "is of Tree type", "@language": "fr" },
      ],
      tooltip: [
        {
          "@value": "Subclass of a tree such as 'Quercus'",
          "@language": "en",
        },
        {
          "@value": "Subclass of a tree such as 'Quercus'",
          "@language": "fr",
        },
      ],
      domain:"http://www.w3id.org/def/irrig#Tree",
      range: "http://twin-example/zurich#AgrovocTerm",
      enableOptional: true,
      enableNegation: true,
    },
    {
      "@id": "http://www.w3.org/ns/sosa/actsOnProperty",
      "@type": "ObjectProperty",
      subPropertyOf: "sparnatural:ListProperty",
      datasource: "datasources:list_rdfslabel_alpha_with_count",
      label: [
        { "@value": "actsOnProperty", "@language": "en" },
        { "@value": "actsOnProperty", "@language": "fr" },
      ],
      tooltip: [
        {
          "@value": "An actuator acts on a property",
          "@language": "en",
        },
        {
          "@value": "An actuator acts on property",
          "@language": "fr",
        },
      ],
      domain:"http://www.w3.org/ns/sosa/Actuator",
      range: "http://www.w3.org/ns/ssn/Property",
      enableOptional: true,
      enableNegation: true,
    },
    {
      "@id":
        "http://labs.sparna.fr/sparnatural-demo-dbpedia/onto#withinArea",
      "@type": "ObjectProperty",
      subPropertyOf: "sparnatural:MapProperty",
      label: [
        { "@value": "withinArea", "@language": "en" },
        { "@value": "dans la zone", "@language": "fr" },
      ],
      domain: "http://twin-example/zurich#Location",
      range: "http://labs.sparna.fr/sparnatural-demo-dbpedia/onto#Area"
    },
    {
      "@id":
        "http://labs.sparna.fr/sparnatural-demo-dbpedia/onto#withinCanton",
      "@type": "ObjectProperty",
      datasource: {
        queryString: `
        PREFIX schema: <http://schema.org/>
        PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
        PREFIX gn: <http://www.geonames.org/ontology#>
        PREFIX geo: <http://www.opengis.net/ont/geosparql#>
        select distinct ?uri ?label where {
            ?Canton schema:name ?label.
            ?Canton gn:featureCode gn:A.ADM1 .  
            ?Canton <http://purl.org/dc/terms/issued> ?Date.
            FILTER (?Date = "2022-01-01"^^xsd:date)
            ?Canton geo:hasGeometry ?geom.
            ?geom geo:asWKT ?wkt
            Bind(?wkt as ?uri)
        }
        `,
        sparqlEndpointUrl:'https://geo.ld.admin.ch/query'
      },
      subPropertyOf: "sparnatural:ListPropertyGeo",
      label: [
        { "@value": "within canton", "@language": "en" },
        { "@value": "within canton", "@language": "fr" },
      ],
      domain: "http://twin-example/zurich#Location",
      range: "http://www.geonames.org/ontology#A.ADM1",
      sparqlString: 'gn:featureCode'
    },
    {
      "@id":
        "http://labs.sparna.fr/sparnatural-demo-dbpedia/onto#outsideArea",
      "@type": "ObjectProperty",
      subPropertyOf: "sparnatural:MapProperty",
      label: [
        { "@value": "outsideArea", "@language": "en" },
        { "@value": "dehors de la zone", "@language": "fr" },
      ],
      domain: "http://twin-example/zurich#Location",
      range: "http://labs.sparna.fr/sparnatural-demo-dbpedia/onto#Area"
    },
    {
      "@id":
        "http://www.opengis.net/ont/geosparql#hasGeometry",
      "@type": "ObjectProperty",
      subPropertyOf: "sparnatural:NonSelectableProperty",
      label: [
        { "@value": "has Location", "@language": "en" },
        { "@value": "dans la zone", "@language": "fr" },
      ],
      domain: "http://www.w3id.org/def/irrig#Tree",
      range: "http://twin-example/zurich#Location",
      sparqlString: "<http://www.opengis.net/ont/geosparql#hasGeometry>/<http://www.opengis.net/ont/geosparql#asWKT>"
    },
    {
      "@id":
        "http://www.opengis.net/ont/geosparql#hasLocation",
      "@type": "ObjectProperty",
      subPropertyOf: "sparnatural:NonSelectableProperty",
      label: [
        { "@value": "has Location", "@language": "en" },
        { "@value": "dans la zone", "@language": "fr" },
      ],
      domain: "http://www.w3.org/ns/sosa/Sensor",
      range: "http://twin-example/zurich#Location",
    },
    {
      "@id":
        "http://www.w3.org/ns/sosa/triggersActionOn",
      "@type": "ObjectProperty",
      subPropertyOf: "sparnatural:NonSelectableProperty",
      label: [
        { "@value": "triggers Action On", "@language": "en" },
        { "@value": "triggers Action On", "@language": "fr" },
      ],
      domain: "http://www.w3.org/ns/sosa/Sensor",
      range: "http://www.w3.org/ns/sosa/Actuator",
      sparqlString: "rdfs:label"
      
    },
    {
      "@id": "http://aims.fao.org/aos/agrontology#hasPathogen",
      "@type": "ObjectProperty",
      subPropertyOf: "sparnatural:TreeProperty",
      label: [
        { "@value": "has Possible Pathogen", "@language": "en" },
        { "@value": "has Possible Pathogen", "@language": "fr" },
      ],
      domain: "http://twin-example/zurich#AgrovocTerm",
      range: "http://aims.fao.org/aos/agrovoc/c_5630",
      treeRootsDatasource: {
          queryString: `
          PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
          SELECT ?uri ?label ?hasChildren
          WHERE {
          VALUES ?uri {<http://aims.fao.org/aos/agrovoc/c_5630>}
          ?uri skos:prefLabel ?label .
          filter langMatches(lang(?label), 'en')
          BIND(true AS ?hasChildren)
          }
          `,
          sparqlEndpointUrl:"https://agrovoc.fao.org/sparql"
      },
      treeChildrenDatasource: "datasources:tree_children_skosnarrower",
      sparqlService: "http://data.mydomain.org/ontology/sparnatural-config#AgrovocService",
    },
    {
      "@id":
        "http://labs.sparna.fr/sparnatural-demo-dbpedia/onto#auto_label",
      "@type": "ObjectProperty",
      subPropertyOf: "sparnatural:NonSelectableProperty",
      label: [
        { "@value": "name", "@language": "en" },
        { "@value": "nom", "@language": "fr" },
      ],
      sparqlString: "<http://www.w3.org/2004/02/skos/core#prefLabel>",
      range: "http://labs.sparna.fr/sparnatural-demo-dbpedia/onto#Text",
    },
    {
      "@id":
        "http://data.mydomain.org/ontology/sparnatural-config#AgrovocService",
      "@type": "sd:Service",
      endpoint: "https://agrovoc.fao.org/sparql" ,
      label: "Agrovoc SPARQL Endpoint"
    }
  ],
};
