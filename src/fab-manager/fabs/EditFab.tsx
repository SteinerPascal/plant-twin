import EditIcon from "@mui/icons-material/EditOutlined";
import IconButton from "@mui/material/IconButton";
import { Quad_Object, Store } from "n3";


export const semanticQuery = async (endpointUrl:string, store:Store,object:Quad_Object)=>{
    // just doublechecks if the object is in the store.
    // should match every time
    const objects = (store:Store,object:Quad_Object)=>{
        return store.getQuads(null, null, object,null)
    }

   if(object) return true

   return false
}

// EditButton is used to Edit the triple
// It shows the triples associated with this Semantic Node
// This is first of all the relationship between digital entity and the information node
export default function EditFab(){

    return(
        <IconButton aria-label="delete" sx={{backgroundColor:'#EB9E3B', "&:hover": {
            backgroundColor: "#EB9E3B",
            cursor: "default",
            transform: "scale(1.2)"
            }}}>
        <EditIcon sx={{color:"white"}} />
      </IconButton> 
    )
}