import { useEffect, useState } from 'react'
import {
  MapContainer,
  TileLayer,
} from 'react-leaflet'
import PixiOverlay from "react-leaflet-pixi-overlay";
import ActionModal from '../digital-twin/circularmenu/ActionModal';
import { getTrees } from './treedatasource';

export default function LeafletContainer(){
  const [mapdata,addData] = useState<Array<JSX.Element>>([])
  const [actionEl, setActionEl] = useState(<div></div>)
  const [open, onModalOpen] = useState(false);
  const handleClose = () =>{
    onModalOpen(false)
  } ;
  const onSubjectClick = (subj:JSX.Element) =>{
    console.log('clicked')
    setActionEl(subj)
    onModalOpen(true);
  }

  
  useEffect(() => {
    getTrees(addData,onSubjectClick)
 
    },[])

  return(
    <div style={{height:"100%"}}>
      <ActionModal open={open} handleClose={handleClose} actionEl={actionEl}></ActionModal>
      <MapContainer preferCanvas={true} center={[47.3769, 8.5417]} style={{height:"99%"}} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <PixiOverlay markers={mapdata as any} />
      </MapContainer>
    </div>


  )
}

