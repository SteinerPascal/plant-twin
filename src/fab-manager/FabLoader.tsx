import { Quad_Object, Store } from "n3"
import json from './plugins.json'
import EditFab from 'core-plugins'
import semanticEditFab from "core-plugins"
/*
interface IFabProps {
  endpointUrl:string, 
  store:Store,
  object:Quad_Object
}
export interface IFab extends React.FunctionComponentElement<IFabProps> {}
*/


export interface PluginObject {
  semanticQuery: (endpoint:string,store:Store,object:Quad_Object)=>boolean,
  component: ( endpointUrl:string, store:Store, object:Quad_Object) => JSX.Element
}

// https://javascript.plainenglish.io/how-to-build-a-plugin-system-with-node-js-68c097eb3a2e
export default class FabLoader {

  async loadFromConfig (path='./plugins.json') {
    const plugins: Array<PluginObject> = []
    const entries = Object.entries(json)
    const forward = await import("/home/pascal/plant-twin/build/static/js/ForwardFab")
    const delet = await import("/home/pascal/plant-twin/build/static/js/DeleteFab")
    const edit = await import("/home/pascal/plant-twin/build/static/js/EditFab")
    const information = await import("/home/pascal/plant-twin/build/static/js/InformationFab")
    
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
    }]
    return await Promise.all(entries.map(e=>{
      const [key, value] = e;
      this.load("/home/pascal/core-plugins/lib/esm/index").then(result => {
        console.log(`plug loaded: ${console.dir(result)}`)
        if(result) return result
      })
      })
    )
  }

  private async load (path:string) {
    let plugin
    try {
      const plugin = await import("/home/pascal/plant-twin/node_modules/core-plugins/lib/esm/DeleteFab")
      //const plugin = await import("/home/pascal/plant-twin/build/static/js/InformationFab")
      //const plugin = await import(path)

      let obj = {
        semanticQuery: plugin.semanticQuery,
        component: plugin.default,
      }
      return obj
      // make type check for Abstract Plugin here
      /*
      if(this.isValidPlugin(pluginObj) && this.isValidSemanticQuery(pluginObj)){
        console.log(`Loaded plugin: '${console.dir(pluginObj)}'`);
        return pluginObj
      } else{
        return null
      }*/
    } catch (e:any) {
      console.error(e.message)
      console.log(`Failed to load '${plugin}'`)
      //stop here application gracefully
    }
  }
  
  //some basic type validation
  private isValidPlugin = (val: any): boolean => {
    return typeof val.component === 'function' //&& String(val).includes('return React.createElement')
  }
  private isValidSemanticQuery = (val: any): boolean =>{
    return typeof val.component === 'function'
  }
}