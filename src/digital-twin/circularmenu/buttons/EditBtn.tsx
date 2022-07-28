import EditIcon from "@mui/icons-material/EditOutlined";
import IconButton from "@mui/material/IconButton";

//004E64
//EB9E3B
//870058


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