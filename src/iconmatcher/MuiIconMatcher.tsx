import LightModeIcon from '@mui/icons-material/LightMode';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import ParkIcon from '@mui/icons-material/Park';
import NaturePeopleIcon from '@mui/icons-material/NaturePeople';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import MemoryIcon from '@mui/icons-material/Memory';
import LeafIcon from './LeafIcon';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import TranslateIcon from '@mui/icons-material/Translate';

export default class MuiIconMatcher{
    private static btnStyle = {fontSize:'40px',color:"white"}
    private static twinIconStyle = {fontSize:'100px',color:"black"}
    static isBtn = false;
    private static defaultBtnIcon = <LightModeIcon sx={this.btnStyle} />
    private static defaultTwinIcon = <QuestionMarkIcon sx={this.twinIconStyle} />
    private static literalIcon = <TranslateIcon sx={this.btnStyle} />
    private static iconTwinPrefixMap = new Map<string,JSX.Element>([
        ['http://www.w3.org/ns/sosa/',<MemoryIcon sx={this.twinIconStyle} />],
        ['http://aims.fao.org/aos/agrovoc/',<LeafIcon sx={this.twinIconStyle} />]   
    ])
    private static iconTwinTypeMap = new Map<string,JSX.Element>([
        ['http://www.w3.org/ns/sosa/Actuator',<MemoryIcon sx={this.twinIconStyle} />],
        ['http://twin-example/geneva#Tree',<ParkIcon sx={this.twinIconStyle} />],
        ['http://twin-example/geneva#Space',<NaturePeopleIcon sx={this.twinIconStyle} />],
        ['http://www.w3.org/ns/sosa/Sensor',<DeviceThermostatIcon sx={this.twinIconStyle} />],
        ['http://www.w3.org/ns/sosa/TemperatureSensor',<DeviceThermostatIcon sx={this.twinIconStyle} />],
        ['http://www.opengis.net/ont/geosparql#Point',<LocationOnIcon sx={this.twinIconStyle} />]
    ])
    private static iconBtnPrefixMap = new Map<string,JSX.Element>([
        ['http://www.w3.org/ns/sosa/',<MemoryIcon sx={this.btnStyle} />],
        ['http://aims.fao.org/aos/agrovoc/',<LeafIcon sx={this.btnStyle} />]   
    ])
    private static iconBtnTypeMap = new Map<string,JSX.Element>([
        ['http://www.w3.org/ns/sosa/Actuator',<MemoryIcon sx={this.btnStyle} />],
        ['http://twin-example/geneva#Tree',<ParkIcon sx={this.btnStyle} />],
        ['http://twin-example/geneva#Space',<NaturePeopleIcon sx={this.btnStyle} />],
        ['http://www.w3.org/ns/sosa/Sensor',<DeviceThermostatIcon sx={this.btnStyle} />],
        ['http://www.w3.org/ns/sosa/TemperatureSensor',<DeviceThermostatIcon sx={this.btnStyle} />],
        ['http://www.opengis.net/ont/geosparql#Point',<LocationOnIcon sx={this.btnStyle} />]
    ])

    constructor(defaultBtnIcon:JSX.Element,defaultTwinIcon:JSX.Element){
        MuiIconMatcher.defaultBtnIcon = defaultBtnIcon
        MuiIconMatcher.defaultTwinIcon = defaultTwinIcon
    }

    static matchTwinIcon(iri:string):JSX.Element | null {
        this.isBtn = false
        const typeMatch = MuiIconMatcher.iconTwinTypeMap.get(iri) 
        if(typeMatch !== undefined) return typeMatch
        const prefMatch = MuiIconMatcher.iconTwinPrefixMap.get(iri)
        if(prefMatch) return prefMatch
        return null 
    }

    static matchBtnIcon(iri:string):JSX.Element | null {
        this.isBtn = true
        const typeMatch = MuiIconMatcher.iconBtnTypeMap.get(iri) 
        if(typeMatch !== undefined) return typeMatch
        const namespace = this.getNamespace(iri)
        const prefMatch = MuiIconMatcher.iconBtnPrefixMap.get(namespace)
        if(prefMatch) return prefMatch
        return null
       
    }

    private static getNamespace(iri:string) {
        if(iri.includes('#')){
            const name = iri.split('#').at(0)
            return name ? name : ""
        } 
        let arr = iri.split('/')
        arr.pop()
        return `${arr.join('/')}/`
    }

    static getDefaultTwinIcon(){
        return this.defaultTwinIcon
    }
    static getDefaultBtnIcon(){
        return this.defaultBtnIcon
    }

    static getLiteralIcon() {
        return this.literalIcon
    }

}