import React from 'react'
import MaskedInput from 'react-text-mask'
import { makeStyles } from '@material-ui/core/styles'
import Input from '@material-ui/core/Input'
import FormControl from '@material-ui/core/FormControl'
import Grid from '@material-ui/core/Grid'
import { Buttons } from 'components/Prescription'
import * as prescriptionAPI from 'lib/api/prescription'

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  formControl: {
    margin: theme.spacing(1)
  }
}))

function TextMaskDate (props) {
  const { inputRef, ...other } = props

  return (
    <MaskedInput
      {...other}
      ref={ref => {
        inputRef(ref ? ref.inputElement : null)
      }}
      mask={[
        /\d/,
        /\d/,
        /\d/,
        /\d/,
        '년',
        ' ',
        /\d/,
        /\d/,
        '월',
        ' ',
        /\d/,
        /\d/,
        '일',
        /\d/,
        /\d/,
        '시',
        /\d/,
        /\d/,
        '분'
      ]}
      placeholderChar={'\u2000'}
      showMask
    />
  )
}

function TextMaskDate2 (props) {
  const { inputRef, ...other } = props

  return (
    <MaskedInput
      {...other}
      ref={ref => {
        inputRef(ref ? ref.inputElement : null)
      }}
      mask={['제', /\d/, /\d/, /\d/, /\d/, '호']}
      placeholderChar={'\u2000'}
      showMask
    />
  )
}

export default function GlassHospitalForm (props) {
  const classes = useStyles()
  const [values, setValues] = React.useState({
    name: props.hname,
    patientName: '',
    date: '   년  월  일  시  분',
    number: '제   호',
    nakedlefteye: '',
    nakedrighteye: '',
    lefteye: '',
    righteye: '',
    showError: false,
    showComplete: false
  })

  const handleChange = name => event => {
    setValues({
      ...values,
      [name]: event.target.value
    })
  }

  const handleComplete = async () => {
    if (
      values.name !== props.hname ||
      values.date === '   년  월  일  시  분' ||
      values.number === '제   호' ||
      values.patientName === '' ||
      values.medicineName === '' ||
      values.amount === '' ||
      values.count === '' ||
      values.totalDay === ''
    ) {
      setValues({ ...values, showError: true })
    } else {
      setValues({ ...values, showError: true })
      await prescriptionAPI.makePrescription({
        prescriptiontype: 'glasses',
        prescription: JSON.stringify(values),
        uemail: values.patientName,
        hname: props.hname,
        sname: null
      })
      setValues({ ...values, showError: false, showComplete: true })
    }
  }

  return (
    <div
      style={{ paddingLeft: 30, paddingTop: 50 }}
      className={classes.container}
    >
      <Buttons handleComplete={handleComplete} />
      {values.showError
        ? <div style={{ paddingLeft: 10 }}>처방전을 올바르게 작성해주세요</div>
        : <div />}
      {values.showComplete
        ? <div style={{ paddingLeft: 10 }}>처방완료</div>
        : <div />}
      <Grid container spacing={1}>
        <FormControl className={classes.formControl}>
          <Input
            value={values.name}
            onChange={handleChange('name')}
            id='formatted-text-mask-input1'
          />
        </FormControl>
        <FormControl className={classes.formControl}>
          <Input
            placeholder='환자이메일'
            onChange={handleChange('patientName')}
            id='formatted-text-mask-input1'
          />
        </FormControl>
      </Grid>
      <Grid container spacing={1}>
        <FormControl className={classes.formControl}>
          <Input
            value={values.date}
            onChange={handleChange('date')}
            id='formatted-text-mask-input1'
            inputComponent={TextMaskDate}
          />
        </FormControl>

        <FormControl className={classes.formControl}>
          <Input
            value={values.number}
            onChange={handleChange('number')}
            id='formatted-text-mask-input2'
            inputComponent={TextMaskDate2}
          />
        </FormControl>
      </Grid>
      <Grid container spacing={1}>
        <FormControl className={classes.formControl}>
          <Input
            placeholder='나안시력(L)'
            onChange={handleChange('nakedlefteye')}
            id='formatted-text-mask-input2'
          />
        </FormControl>
        <FormControl className={classes.formControl}>
          <Input
            placeholder='나안시력(R)'
            value={values.textmask}
            onChange={handleChange('nakedrighteye')}
            id='formatted-text-mask-input2'
          />
        </FormControl>
      </Grid>
      <FormControl className={classes.formControl}>
        <Input
          placeholder='교정시력(L)'
          onChange={handleChange('lefteye')}
          id='formatted-text-mask-input2'
        />
      </FormControl>
      <FormControl className={classes.formControl}>
        <Input
          placeholder='교정시력(R)'
          onChange={handleChange('righteye')}
          id='formatted-text-mask-input2'
        />
      </FormControl>
    </div>
  )
}
