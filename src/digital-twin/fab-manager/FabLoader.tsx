import { Quad, Quad_Object, Store, Triple } from "n3"
import React, { FunctionComponent } from "react"
import json from './plugins.json'
/*
interface IFabProps {
  endpointUrl:string, 
  store:Store,
  object:Quad_Object
}
export interface IFab extends React.FunctionComponentElement<IFabProps> {}
*/


export interface PluginObject {
  semanticQuery: (endpoint:string,store:Store,quad:Quad)=>Promise<Boolean>,
  component: ( endpointUrl:string, store:Store, triple:Quad,actionCB:(jsxEl:JSX.Element)=>void) => JSX.Element
}

// https://javascript.plainenglish.io/how-to-build-a-plugin-system-with-node-js-68c097eb3a2e
export default class FabLoader {

  async loadFromConfig (path='./plugins.json') {
    const plugins: Array<PluginObject> = []
    const entries = Object.entries(json)
    const forward = await import('forwardfab')
    const delet = await import("deletefab")
    const edit = await import("editfab")
    const information = await import("informationfab")
    const webfab = await import("webfab")
    const tdeditorfab = await import('tdeditorfab')
    const weatherfab = await import('weatherfab')
    const laziness = React.lazy(()=>{
      return new Promise((resolve)=>{
        if(webfab)
        return webfab.default as React.ComponentType<any>
      })
        
    })
    
    return [{
      semanticQuery:delet.semanticQuery,
      component: delet.default
    },{
      semanticQuery:forward.semanticQuery,
      component: forward.default
    },{
      semanticQuery:edit.semanticQuery,
      component: edit.default
    },{
      semanticQuery:information.semanticQuery,
      component: information.default
    },
    {
      semanticQuery: tdeditorfab.semanticQuery,
      component: tdeditorfab.default
    },
    {
      semanticQuery: weatherfab.semanticQuery,
      component: weatherfab.default
    },
    {
      semanticQuery: webfab.semanticQuery,
      component: webfab.default
    },

  ]
    /*
    return await Promise.all(entries.map(e=>{
      const [key, value] = e;
      this.load("/home/pascal/core-plugins/lib/esm/index").then(result => {
        console.log(`plug loaded: ${console.dir(result)}`)
        if(result) return result
      })
      })
    )*/
  }
/*
  private async load (path:string) {
    let plugin
    try {
      //const plugin = await import("/home/pascal/plant-twin/node_modules/forwardfab/lib/esm/index")
      //const plugin = await import("/home/pascal/plant-twin/build/static/js/InformationFab")
      //const plugin = await import(path)

      let obj = {
        semanticQuery: plugin.semanticQuery,
        component: plugin.default,
      }
      return obj
      // make type check for Abstract Plugin here
      
      if(this.isValidPlugin(pluginObj) && this.isValidSemanticQuery(pluginObj)){
        console.log(`Loaded plugin: '${console.dir(pluginObj)}'`);
        return pluginObj
      } else{
        return null
      }
    } catch (e:any) {
      console.error(e.message)
      console.log(`Failed to load '${plugin}'`)
      //stop here application gracefully
    }
  }
  */
  //some basic type validation
  private isValidPlugin = (val: any): boolean => {
    return typeof val.component === 'function' //&& String(val).includes('return React.createElement')
  }
  private isValidSemanticQuery = (val: any): boolean =>{
    return typeof val.component === 'function'
  }
}