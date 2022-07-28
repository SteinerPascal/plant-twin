//https://github.com/innFactory/react-planet
//https://morioh.com/p/a2d037c571d7

import {Planet} from "react-planet"
import CustomBtn from "./buttons/CustomIconBtn"
import DeleteBtn from "./buttons/DeleteBtn"
import EditBtn from "./buttons/EditBtn"
import ViewBtn from "./buttons/ViewBtn"

export default function CircularFAB() {
    
    return(
        <Planet
            centerContent={<CustomBtn />}
            hideOrbit
            autoClose
            orbitRadius={60}
            bounceOnClose
            rotation={105}
            // the bounce direction is minimal visible
            // but on close it seems the button wobbling a bit to the bottom
            bounceDirection="BOTTOM"
        >
            <DeleteBtn />
            <EditBtn />
            <ViewBtn />
            <div />
            <div />
            <div />
            <div />
        </Planet>
    )
}