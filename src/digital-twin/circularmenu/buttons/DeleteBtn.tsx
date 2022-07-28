import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import IconButton from "@mui/material/IconButton";

//004E64
//EB9E3B
//870058


export default function DeleteBtn(){

    return(
        <IconButton aria-label="delete" sx={{backgroundColor:'#004E64', "&:hover": {
            backgroundColor: "#004E64",
            cursor: "default",
            transform: "scale(1.2)"
            }}}>
        <DeleteIcon sx={{color:"white"}} />
      </IconButton> 
    )
}