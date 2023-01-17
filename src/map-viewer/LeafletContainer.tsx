import { useEffect, useState } from 'react'
import Layout from '../layout/Layout'
import {
  MapContainer,
  TileLayer,
} from 'react-leaflet'
import PixiOverlay from "react-leaflet-pixi-overlay";
import ActionModal from '../digital-twin/circularmenu/ActionModal';
import { getTrees } from './treedatasource';
import { getDevices } from './devicedatasource';

export default function LeafletContainer(){
  const [treeData,addTreeData] = useState<Array<JSX.Element>>([])
  const [deviceData,addDeviceData] = useState<Array<JSX.Element>>([])

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
    getTrees(addTreeData,onSubjectClick)
    getDevices(addDeviceData,onSubjectClick)
    },[])
//<PixiOverlay markers={deviceData as any}/>
  return(
    <Layout>
        <ActionModal open={open} handleClose={handleClose} actionEl={actionEl}></ActionModal>
        <MapContainer preferCanvas={true} center={[47.3769, 8.5417]} style={{height:"95%", width:"95%"}} zoom={13} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <PixiOverlay markers={(treeData.concat(deviceData))as any} />
          
        </MapContainer>
    </Layout>



  )
}

