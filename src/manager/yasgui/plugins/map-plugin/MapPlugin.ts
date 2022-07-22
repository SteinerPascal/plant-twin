import {Plugin} from "@triply/yasr/build/ts/src/plugins/index"
import Parser from "@triply/yasr/build/ts/src/parsers"
import { drawSvgStringAsElement } from "../utils";
import Yasr from "@triply/yasr/build/ts/src/index"
import L, { Polyline, Marker } from "leaflet";
import { wktParsing } from "./wktParsing";


/*
    Currently this plugin supports only the wktLiteral parsing.
    If you would like to add further parsing like GML or KML, just implement a serializer callback for parseGeoLiteral()
*/

export interface PluginConfig {
    setView: {
        center: L.LatLngExpression,
        zoom?: number,
        options?: L.ZoomPanOptions
    }
    tileLayer: {
        urlTemplate: string, 
        options?: L.TileLayerOptions
    }
    parsingFunction: (row:DataRow, literalValue:string)=> Polyline | Marker
}

type DataRow = [number, ...(Parser.BindingValue | "")[]];




export default class MapPlugin implements Plugin<PluginConfig>{
    priority: number = 5; // priority for sorting the plugins in yasr
    private yasr:Yasr
    private mapEL:HTMLElement | null = null;
    private map:L.Map | null = null
    private resultSet: DataRow[] | null = null
    private config: PluginConfig;
    hideFromSelection?: boolean = false;
    label?: string = 'Map';
    options?: PluginConfig;
    // define the default config for leaflet
    public static defaults: PluginConfig = {
        setView: {
            center:[46.20222, 6.14569], // Geneva, Switzerland
            zoom: 13,
            options: undefined
        },
        tileLayer: {
            urlTemplate: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            options: {
                maxZoom: 19,
                attribution: "© OpenStreetMap"
            }
        },
        parsingFunction: wktParsing
        
    }

    constructor(yasr:Yasr){
        this.yasr = yasr;
        this.config = MapPlugin.defaults
    }
    // Map plugin can handle results in the form of geosparql wktLiterals
    // http://schemas.opengis.net/geosparql/1.0/geosparql_vocab_all.rdf#wktLiteral
    canHandleResults(): boolean {
        let rows = this.getRows()
        if(rows && rows.length > 0){
            return rows.some((row: DataRow)=>{ // if a cell contains a geosparql value
                // Test all rows because of OPTIONAL in SPARQL
                if(this.getGeosparqlValue(row)) return true
            })
        }
        return false
    }

    // this method checks if there is a geosparql value in a cell for a given row
    private getGeosparqlValue(row:DataRow): Parser.BindingValue[] | null {
        let res = row.filter((cell)=>{
            if(this.isBindingValue(cell)){
               if(cell?.datatype === "http://www.opengis.net/ont/geosparql#wktLiteral") return true
               // add here further type such as 'http://www.opengis.net/ont/gml'
            }
            return false
        });
        //found geo value?
        if(res.length > 0 ) return (res as Parser.BindingValue[])
        return null
    }

    draw(persistentConfig: any, runtimeConfig?: any): void | Promise<void> {
        const rows = this.getRows()
        if(rows === this.resultSet) return // nothing changed. nothing to do
        //if the resultset changed, then cleanup and rerender
        this.cleanUp()
        this.createMap()
        
        rows.map((row:DataRow)=>{   
            this.parseGeoLiteral(row,this.config.parsingFunction)
        })

    }

    private createMap(){
        this.mapEL = document.createElement('div')
        this.mapEL.setAttribute('id','map')
        const parentEl = document.getElementById('resultsId1')
        if(!parentEl) throw Error(`Couldn't find parent element of Yasr. No element found with Id: resultsId1`)
        parentEl.appendChild(this.mapEL)
        this.map = L.map('map').setView(this.config.setView.center,this.config.setView.zoom,this.config.setView.options)
        L.tileLayer(this.config.tileLayer.urlTemplate,this.config.tileLayer.options).addTo(this.map)
    }
    
    getIcon(): Element {
        return drawSvgStringAsElement(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M408 120C408 174.6 334.9 271.9 302.8 311.1C295.1 321.6 280.9 321.6 273.2 311.1C241.1 271.9 168 174.6 168 120C168 53.73 221.7 0 288 0C354.3 0 408 53.73 408 120zM288 152C310.1 152 328 134.1 328 112C328 89.91 310.1 72 288 72C265.9 72 248 89.91 248 112C248 134.1 265.9 152 288 152zM425.6 179.8C426.1 178.6 426.6 177.4 427.1 176.1L543.1 129.7C558.9 123.4 576 135 576 152V422.8C576 432.6 570 441.4 560.9 445.1L416 503V200.4C419.5 193.5 422.7 186.7 425.6 179.8zM150.4 179.8C153.3 186.7 156.5 193.5 160 200.4V451.8L32.91 502.7C17.15 508.1 0 497.4 0 480.4V209.6C0 199.8 5.975 190.1 15.09 187.3L137.6 138.3C140 152.5 144.9 166.6 150.4 179.8H150.4zM327.8 331.1C341.7 314.6 363.5 286.3 384 255V504.3L192 449.4V255C212.5 286.3 234.3 314.6 248.2 331.1C268.7 357.6 307.3 357.6 327.8 331.1L327.8 331.1z"/></svg>`)
    }
    helpReference?: string | undefined;

    private parseGeoLiteral(row:DataRow, cb:(row:DataRow, literal:string)=>Polyline | Marker){
        const literals = this.getGeosparqlValue(row)
        if(!literals) return
        const features = literals.map((bindings)=>{
            cb(row,bindings.value) // let callback do the parsing
        })
    }

    private getRows(): DataRow[] {
        if (!this.yasr.results) return [];
        const bindings = this.yasr.results.getBindings();
        if (!bindings) return [];
        // Vars decide the columns
        const vars = this.yasr.results.getVariables();
        // Use "" as the empty value, undefined will throw runtime errors
        return bindings.map((binding, rowId) => [rowId + 1, ...vars.map((variable) => binding[variable] ?? "")]);
      }
    
    // remove the already rendered map so we can rerender it
    private cleanUp() {
        this.mapEL?.remove()
    }

    // see: https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards
    private isBindingValue(cell: number | "" | Parser.BindingValue): cell is Parser.BindingValue {
        if(cell === '') return false
        if(typeof cell === 'number') return false
        return ('value' in cell && (('type' in cell) || ('datatype' in cell)))
      }

}
