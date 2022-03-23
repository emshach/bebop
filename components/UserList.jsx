import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import RefreshIcon from '@mui/icons-material/Refresh'
import EditIcon from '@mui/icons-material/Edit'

export default function UserList({
  actions,
  columns,
  rows,
  onRefresh,
  onEdit,
  ...props }) {

  const RowAction = ({ row }) => (
    <IconButton onClick={ e => { onEdit( row )}}>
      <EditIcon/>
    </IconButton>
  )
  const Actions = actions || RowAction

  return (
    <TableContainer component={ Paper }>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow key="header">{
            columns.map( col => (
              <TableCell key={ col.name }>{ col.label }</TableCell>
            ))}
            <TableCell align="right">
              <IconButton onClick={ onRefresh }>
                <RefreshIcon/>
              </IconButton>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{
          rows && rows.length ?
             rows.map( row =>
               (<TableRow
                  key={ row.id }
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >{
                columns.map( col => (
                  <TableCell key={ `${ col.name }:${ row.id }` }>{
                    col.render ? (
                      ('join' in col.render) ?
                         ( row[ col.name ] || col.default || []).join(
                           col.render.join )
                         : col.render.test ?
                         ( row[ col.name ] || col.default ?
                           ( col.render.test[0] === '$value' ?
                             row[ col.name ] || col.default
                             : col.render.test[0] )
                           : ( col.render.test[1] === '$value' ?
                               row[ col.name ] || col.default
                               : col.render.test[1] ))
                       : row[ col.name ] || col.default || ''
                    ) : row[ col.name ] || col.default || '' }</TableCell>
                ))}
                  <TableCell align="right">
                    <Actions row={ row }/>
                  </TableCell>
                </TableRow>))
             : <TableRow key="empty">
                 <TableCell colSpan={ actions ? ( columns.length + 1 )
                                      : columns.length }
                            align="center">
                   No users to display
                 </TableCell>
               </TableRow>
        }</TableBody>
      </Table>
    </TableContainer>
  )
}
