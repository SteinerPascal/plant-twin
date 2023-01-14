import { useState } from "react"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from "@mui/material";
import SparqlHandler from "../SparqlHandler";
import { Link } from 'react-router-dom';

function TreeModal({contentObj}:{contentObj: {[key:string]:string}}) {
    const [subject,addSubject] = useState<string>()
    const [linkTarget,addTarget] = useState<any>()
    const [content,addContent] = useState< {
        [key: string]: string;
    }[]>(()=>{
        let rows = []
        for (const [k, v] of Object.entries(contentObj)) {
            const obj: {[key:string]:string}= {}
            obj[k] = v
            rows.push(obj)
            if(k === "subject"){
                addSubject(v)
                addTarget({
                    pathname: `/twin/${SparqlHandler.getNamespaceObject(v as string).value}`,
                    key: subject, // we could use Math.random, but that's not guaranteed unique.
                    state: {
                      applied: true
                    }
                })
            } 
        }
        return rows
    })

    const btnStyle = {
        marginTop: '30px',
        marginLeft: '35%'
    }
	
    return (
        <div>
            <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
                <TableRow>
                <TableCell>Information</TableCell>
                <TableCell>Value</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {content.map((row) => (
                <TableRow
                    key={Object.keys(row)[0]}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                    <TableCell component="th" scope="row">
                    {Object.keys(row)[0]}
                    </TableCell>
                    <TableCell component="th" scope="row">
                    {Object.values(row)[0]}
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </TableContainer>
            <Button component={Link} to={linkTarget} state={{ subject: subject }} variant="contained" sx={btnStyle}>Go to Digital Twin</Button>
        </div>

    );
  }
  export default TreeModal;