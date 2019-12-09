import React from 'react'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import * as storeAPI from '../../lib/api/store'

export default function PrescriptionPossibleButton (props) {
  let checked = false
  if (props.checked === null) {
    checked = false
  } else if (props.checked.data.prescription === '1') {
    checked = true
  } else {
    checked = false
  }

  const [state, setState] = React.useState({
    sname: props.name,
    checked: checked
  })

  React.useEffect(
    function setChecked () {
      if (checked) {
        setState({ sname: props.name, checked: checked })
        props.handleCheckedChange(checked)
      }
    },
    [checked]
  )

  const handleChange = name => async event => {
    const check = !state.checked
    setState({ ...state, [name]: check })
    props.handleCheckedChange(check)
    await storeAPI.setPrescriptionPossible({
      sname: state.sname,
      ispossible: check
    })
  }
  return (
    <div style={{ paddingTop: 20, paddingLeft: 20 }}>
      <FormGroup row>
        <FormControlLabel
          control={
            <Switch
              checked={state.checked}
              onChange={handleChange('checked')}
              value='checked'
              color='primary'
            />
          }
          label='처방가능'
        />
      </FormGroup>
    </div>
  )
}
