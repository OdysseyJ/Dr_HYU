import React from 'react'
import MaskedInput from 'react-text-mask'
import { makeStyles } from '@material-ui/core/styles'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
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
        '일'
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

export default function HospitalForm (props) {
  const classes = useStyles()
  const [values, setValues] = React.useState({
    name: props.hname,
    patientName: '',
    date: '   년  월  일',
    number: '제   호',
    medicineName: '',
    amount: '',
    count: '',
    totalDay: '',
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
    console.log(values)
    if (
      values.name !== props.hname ||
      values.patientName === '' ||
      values.medicineName === '' ||
      values.amount === '' ||
      values.count === '' ||
      values.totalDay === ''
    ) {
      setValues({ ...values, showError: true })
    } else {
      setValues({ ...values, showError: true })
      const result = await prescriptionAPI.makePrescription({
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
            placeholder='환자성명'
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
      <FormControl className={classes.formControl}>
        <Input
          placeholder='처방의약품의 명칭'
          onChange={handleChange('medicineName')}
          id='formatted-text-mask-input2'
        />
      </FormControl>
      <FormControl className={classes.formControl}>
        <Input
          placeholder='1회 투약량'
          value={values.textmask}
          onChange={handleChange('amount')}
          id='formatted-text-mask-input2'
        />
      </FormControl>
      <FormControl className={classes.formControl}>
        <Input
          placeholder='1일 투여횟수'
          onChange={handleChange('count')}
          id='formatted-text-mask-input2'
        />
      </FormControl>
      <FormControl className={classes.formControl}>
        <Input
          placeholder='총 투약일수'
          onChange={handleChange('totalDay')}
          id='formatted-text-mask-input2'
        />
      </FormControl>
    </div>
  )
}

// import React from 'react'
// import { makeStyles } from '@material-ui/core/styles'
// import TextField from '@material-ui/core/TextField'

// const useStyles = makeStyles(theme => ({
//   container: {
//     display: 'flex',
//     flexWrap: 'wrap'
//   },
//   textField: {
//     marginLeft: theme.spacing(1),
//     marginRight: theme.spacing(1),
//     width: 200
//   }
// }))

// export default function HospitalForm () {
//   const classes = useStyles()
//   const [value, setValue] = React.useState('Controlled')

//   const handleChange = event => {
//     setValue(event.target.value)
//   }

//   return (
//     <form className={classes.container} noValidate autoComplete='off'>
//       <div>
//         <TextField
//           id='outlined-multiline-flexible'
//           label='성명'
//           multiline
//           rowsMax='4'
//           onChange={handleChange}
//           className={classes.textField}
//           margin='normal'
//           variant='outlined'
//         />

//         <TextField
//           id='outlined-multiline-flexible'
//           label='성명'
//           multiline
//           rowsMax='4'
//           onChange={handleChange}
//           className={classes.textField}
//           margin='normal'
//           variant='outlined'
//         />
//         <TextField
//           id='outlined-multiline-flexible'
//           label='성명'
//           multiline
//           rowsMax='4'
//           onChange={handleChange}
//           className={classes.textField}
//           margin='normal'
//           variant='outlined'
//         />
//         <TextField
//           id='outlined-textarea'
//           label='Multiline Placeholder'
//           placeholder='Placeholder'
//           multiline
//           className={classes.textField}
//           margin='normal'
//           variant='outlined'
//         />
//         <TextField
//           id='outlined-multiline-static'
//           label='Multiline'
//           multiline
//           rows='4'
//           defaultValue='Default Value'
//           className={classes.textField}
//           margin='normal'
//           variant='outlined'
//         />
//       </div>
//     </form>
//   )
// }
