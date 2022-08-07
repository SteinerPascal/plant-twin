import fs from "fs"
import AbstractFAB from "./AbstractFab";

// https://javascript.plainenglish.io/how-to-build-a-plugin-system-with-node-js-68c097eb3a2e
const FabLoader = ()=> {

  const loadFromConfig = async (path='./plugins.json') => {
    const pluginJson = JSON.parse(fs.readFileSync(path,'utf8')).plugins;
    const plugins: Array<typeof AbstractFAB> = []
    for (let plugin in pluginJson) {
      const path = pluginJson[plugin]
      const module:any = await load(path).then(result => {if(result) plugins.push()})
      if(plugin) plugins.push(module);
    }
    return plugins
  }

  const load = async (path:string) => {
    let plugin
    try {
      fs.existsSync(path);
      plugin = await import(path);
      // make type check for Abstract Plugin here
      if(isValidPlugin(plugin)){
        console.log(`Loaded plugin: '${plugin}'`);
        return plugin
      } else{
        throw Error(`'${plugin}': is not of type AbstractPlugin`)
      }
    } catch (e:any) {
      console.error(e.message)
      console.log(`Failed to load '${plugin}'`)
      //stop here application gracefully
    }
  }
  
  //some basic validation if the provided value is an IWidget['value']
  const isValidPlugin = (val: any): val is typeof AbstractFAB => {
    //every WidgetVal needs to have at least a label
    const name = val?.name
    const isApplicable = val?.isApplicable
    const isFunction =  typeof val?.isApplicable === 'function' 
    const isInstance = val instanceof AbstractFAB
    return name && isApplicable && isFunction && isInstance
  }
}
export default FabLoader