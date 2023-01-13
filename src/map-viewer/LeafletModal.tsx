import { useEffect, useState } from "react"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function LeafletModal({contentObj}:{contentObj: {[key:string]:string}}) {
    const [content,addContent] = useState< {
        [key: string]: string;
    }[]>(()=>{
        let rows = []
        for (const [k, v] of Object.entries(contentObj)) {
            const obj: {[key:string]:string}= {}
            obj[k] = v
            rows.push(obj)
        }
        console.dir(rows)
        return rows
    })
	
    return (
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Information</TableCell>
              <TableCell align="right">Value</TableCell>
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
    );
  }
  export default LeafletModal;