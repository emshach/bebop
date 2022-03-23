import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@material-ui/core/Button'

export default function ConfirmationDialog({
  title,
  content,
  actions,
  children,
  ...props
}) {
  return (
    <Dialog { ...props }>
      <DialogTitle>{ title || 'Confirm' }</DialogTitle>
      <DialogContent>
        { content
          ? <DialogContentText>{ content }</DialogContentText>
          : null
        }
        { children }
      </DialogContent>
      <DialogActions>{
        ( actions || [] ).map( action => (
          <Button onClick={ action.handler }>{ action.label }</Button>
        ))
      }</DialogActions>
    </Dialog>
  )
}
