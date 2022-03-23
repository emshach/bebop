import * as React from 'react'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import ListItemText from '@mui/material/ListItemText'
import Select from '@mui/material/Select'
import Checkbox from '@mui/material/Checkbox'
import { styled } from '@mui/material/styles'

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

export default function DoctorSelect({
  label = 'Doctors',
  options,
  selected = [],
  theme = 'light',
  onChange
}) {
  const doctorsById = {}
  for ( const doctor of options ) {
    doctorsById[ doctor.id ] = doctor
  }
  const [ doctors, setDoctors ] = React.useState( selected )

  if ( !onChange ) {
    onChange = (e) => {}
  }

  const handleChange = (e) => {
    const value = e.target.value
    const d = typeof value === 'string' ? value.split(',') : value
    // On autofill we get a stringified value.
    setDoctors(d)
    onChange(d)
  }

  const StyledFormControl = theme !== 'dark' ? FormControl
        : styled( FormControl )(({ theme }) => ({
          color: 'white',
          borderColor: 'rgba(255,255,255,0.5)',
          'label, .MuiOutlinedInput-notchedOutline, .MuiInputBase-root, .MuiSvgIcon-root': {
            color: 'white',
            borderColor: 'rgba(255,255,255,0.5)',
            '&.Mui-focused,&:hover,&:focus': {
              color: 'white',
              borderColor: 'white',
            }
          },
          '.Mui-focused, :hover, :focus': {
            '.MuiOutlinedInput-notchedOutline, .MuiSvgIcon-root': {
              color: 'white',
              borderColor: 'white',
            }
          }
        }))

  return (
    <StyledFormControl sx={{ m: 1, width: 300 }}>
      <InputLabel id="demo-multiple-checkbox-label">{ label }</InputLabel>
      <Select
        labelId="demo-multiple-checkbox-label"
        id="demo-multiple-checkbox"
        multiple
        value={ doctors }
        onChange={ handleChange }
        input={ <OutlinedInput label={ label } /> }
        renderValue={
          ( selected ) => selected.map( id => doctorsById[ id ].title ).join(', ')
        }
        MenuProps={ MenuProps }
      >
        { options.map(( doctor ) => (
          <MenuItem key={ doctor.id } value={ doctor.id }>
            <Checkbox checked={ doctors.indexOf( doctor.id ) > -1} />
            <ListItemText primary={ doctor.title } />
          </MenuItem>
        ))}
      </Select>
    </StyledFormControl>
  )
}
