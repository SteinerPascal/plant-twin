import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import IconButton from "@mui/material/IconButton";

//004E64
//EB9E3B
//870058


export default function ViewBtn(){

    return(
        <IconButton aria-label="delete" sx={{backgroundColor:'#870058', "&:hover": {
            backgroundColor: "#870058",
            cursor: "default",
            transform: "scale(1.2)"
            }}}>
        <RemoveRedEyeIcon sx={{color:"white"}} />
      </IconButton> 
    )
}