import L, { Polyline, Marker } from "leaflet";
import Parser from "@triply/yasr/build/ts/src/parsers"
var Wkt = require('wicket')
type DataRow = [number, ...(Parser.BindingValue | "")[]];
/*
    Callback function for the MapPlugin. 
    Uses wicket to parse WktLiterals to GeoJson and leaflet objects
*/

export const wktParsing = (row:DataRow,literal:string): Polyline | Marker =>{
    // split on whitespaces and filter out multiple subsequent whitespaces
    const stringParts = literal.split(' ').filter((subStr)=> subStr !== " ")
    console.dir(stringParts)
    // look for either Point or Polygon string
    let featureType = stringParts.find((string)=>{
        return string.includes('Polygon') || string.includes('Point') || string.includes('Polyline')
    })
    if(!featureType) throw Error(`The parsing function couldn't find substring "Polygon" or "Point" in wktLiteral: ${literal}`)


    const ind = stringParts.findIndex((prt)=>prt.includes(featureType as string))
    let wkt = stringParts.slice(ind,stringParts.length).join(' ')
    console.log(wkt)
    const wktObj = new Wkt.Wkt()
    const parsed = wktObj.read(wkt);
    console.log(wktObj.components);
    console.log(wktObj.toJson())
    return new L.Marker([46.20222, 6.14569])

}