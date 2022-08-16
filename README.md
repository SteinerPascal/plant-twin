## Personal Notes:
https://stackoverflow.com/questions/10152390/dynamically-arrange-some-elements-around-a-circle
https://stackoverflow.com/questions/56310915/how-to-add-a-dynamic-amount-of-circles-around-other-circle-using-css-and-reactjs
https://snack.expo.dev/@xeteke8423/circular-btn-example


## Sparnatural
Refactors done:
- add node.js module exports
- add sparnatural.js as index file in package.json
- package naming small capital
- set libraryTarget: 'commonjs2',
	libraryExport: 'default',
    in the sparnatural webpack config

Sparnatural integration:
- declaration file for jsx element src/declaration.d.ts

## Yasgui
The react parent should listen on the 'YasrClickEvent' to catch clicks on IRIs
```
  // registers click listener on YASR 
  // CustomTable component emits YasrIriClick even on clicks on IRI's
  const registerURICliclListener = (yasr:Yasr) => {
    yasr.rootEl.addEventListener('YasrIriClick',(evt:Event)=>{
      let iri = (evt as CustomEvent).detail // need to cast. see: https://github.com/microsoft/TypeScript/issues/28357
      handleOpen()
      setIRI(iri)
    })
  }
```


## Leaflet plugin Yasr
Focus points:
- Clustering of markers (otherwise messy with markers with same coordinates)
- Controll layer for columns containing geo literals
- Different coloring for columns containing polygon literals.
- creating pop up strings for markers and polygons. For the polygons, if there are more than one with the same coordinates, then it will get rendered again.
  That's because we can not make assumptions if there are different rdf datas referencing the same polygon. For example:
     Park_1 -> hasLocation -> wkt_1 && ProtectedArea_1 -> has Location ->wkt_1
- You can add different tilebase layers for leaflet. For example openMap or a custom map from geneva town council.
- Parsing of geo literals is done with the MapPlugin.parsingFunction callback. It is responsible to deliver Polygons and Points
### Issues:
  I need to import geoman plugin or otherwise leaflet in sparnatural crashes because map.pm attribute doesn't get initialized

### Semantic Selection of FABs
```
  loadedFabs.filter(f=>{
    objSet.forEach(()=>{
      if(f.semanticQuery(endpointUrl,twinStore)){

      }
    });
  });
```
The selection currently follows a very basic search where all the objects are tried to be matched against all the possible fabs. Maybe that can be replaced with a Constract where Values{objects} query? 

## Plugin loading 
it seems to work if it is not loaded from plugins
IMPORTANT: the types between the plant twin and the plugins needs to be the same. for example @types/n3
