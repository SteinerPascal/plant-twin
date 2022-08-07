import EditIcon from "@mui/icons-material/EditOutlined";
import IconButton from "@mui/material/IconButton";

// EditButton is used to Edit the triple
// It shows the triples associated with this Semantic Node
// This is first of all the relationship between digital entity and the information node
export default function EditBtn(){

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