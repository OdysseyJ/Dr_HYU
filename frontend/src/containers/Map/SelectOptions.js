import React from 'react'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import CheckBoxIcon from '@material-ui/icons/CheckBox'

export default function SelectOptions () {
  const [state, setState] = React.useState({
    checkedA: true,
    checkedB: true,
    checkedF: true,
    checkedG: true
  })

  const handleChange = name => event => {
    setState({ ...state, [name]: event.target.checked })
  }

  return (
    <FormGroup row>
      <FormControlLabel
        control={
          <Checkbox
            checked={state.checkedB}
            onChange={handleChange('checkedB')}
            value='checkedB'
            color='primary'
          />
        }
        label='Primary'
      />
      <FormControlLabel
        control={
          <Checkbox
            icon={<CheckBoxOutlineBlankIcon fontSize='small' />}
            checkedIcon={<CheckBoxIcon fontSize='small' />}
            value='checkedI'
          />
        }
        label='Custom size'
      />
    </FormGroup>
  )
}
