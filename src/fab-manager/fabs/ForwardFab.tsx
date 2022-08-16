import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined';
import IconButton from "@mui/material/IconButton";
import { Quad_Object, Store } from 'n3';



export const semanticQuery = async (endpointUrl:string, store:Store,object:Quad_Object)=>{
    // just doublechecks if the object is in the store.
    // should match every time
    const objects = (store:Store,object:Quad_Object)=>{
        return store.getQuads(null, null, object,null)
    }

   if(object) return true

   return false
}

export default function ForwardFab(){

    return(
        <IconButton aria-label="delete" sx={{backgroundColor:'#870058', "&:hover": {
            backgroundColor: "#870058",
            cursor: "default",
            transform: "scale(1.2)"
            }}}>
        <TipsAndUpdatesOutlinedIcon sx={{color:"white"}} />
      </IconButton> 
    )
}