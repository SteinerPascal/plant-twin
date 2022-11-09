import LightModeIcon from '@mui/icons-material/LightMode';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import ParkIcon from '@mui/icons-material/Park';
import NaturePeopleIcon from '@mui/icons-material/NaturePeople';

export default class MuiIconMatcher{
    private static defaultBtnIcon = <LightModeIcon sx={{fontSize: 50,color:"white"}} />
    private static defaultTwinIcon = <QuestionMarkIcon sx={{fontSize: 50,color:"white"}} />
    iconPrefixMap = new Map<string,JSX.Element>([
        ['http://www.w3.org/ns/sosa/',<ParkIcon sx={{fontSize: 50,color:"white"}} />]
    ])
    iconTypeMap = new Map<string,JSX.Element>([
        ['http://twin-example/geneva#Tree',<ParkIcon sx={{fontSize: 50,color:"white"}} />],
        ['http://twin-example/geneva#Space',<NaturePeopleIcon sx={{fontSize: 50,color:"white"}} />],
        ['http://www.w3.org/ns/sosa/Sensor',<NaturePeopleIcon sx={{fontSize: 50,color:"white"}} />],
    ])
    constructor(defaultBtnIcon:JSX.Element,defaultTwinIcon:JSX.Element){
        MuiIconMatcher.defaultBtnIcon = defaultBtnIcon
        MuiIconMatcher.defaultTwinIcon = defaultTwinIcon
    }

    static matchTwinIcon(iri:string):JSX.Element {

        return this.defaultTwinIcon
    }

    static matchBtnIcon(iri:string):JSX.Element {
        if(!this.isValidIri()) throw Error(`string provided is not a valid IRI: ${iri}`)

        return this.defaultBtnIcon
        
    }

    private static matchByPrefix() {

    }
    private static matchByType() {

    }

    private static isValidIri(): boolean {
        return true
    }



}