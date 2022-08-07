import fs from "fs"
import AbstractPlugin from "./AbstractFab";

// https://javascript.plainenglish.io/how-to-build-a-plugin-system-with-node-js-68c097eb3a2e
export default class Plugins {
  private plugins:Array<AbstractPlugin>
  constructor() {
    this.plugins = [];
  }

  async loadFromConfig(path='./plugins.json') {
    const pluginJson = JSON.parse(fs.readFileSync(path,'utf8')).plugins;
    for (let plugin in pluginJson) {
      const path = pluginJson[plugin]
      this.load(path);
    }
  }

  private async load(path:string) {
    let plugin
    try {
      fs.existsSync(path);
      plugin = await import(path);
      // make type check for Abstract Plugin here
      if(this.isValidPlugin(plugin)){
        this.plugins.push(plugin)
        console.log(`Loaded plugin: '${plugin}'`);
      } else{
        throw Error(`'${plugin}': is not of type AbstractPlugin`)
      }
    } catch (e:any) {
      console.error(e.message)
      console.log(`Failed to load '${plugin}'`)
      //stop here application gracefully
    }
  }

  private getPlugins(){
    return this.plugins
  }
  
  //some basic validation if the provided value is an IWidget['value']
  private isValidPlugin(val: any): val is AbstractPlugin {
    //every WidgetVal needs to have at least a label
    const name = val?.name
    const isApplicable = val?.isApplicable
    const isFunction =  typeof val?.isApplicable === 'function' 
    const isInstance = val instanceof AbstractPlugin
    return name && isApplicable && isFunction && isInstance
  }
}