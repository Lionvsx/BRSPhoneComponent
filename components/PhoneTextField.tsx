import React = require('react')
import { ITextFieldStyleProps, ITextFieldStyles, TextField } from '@fluentui/react/lib/TextField'
import { CountryCode, E164Number, PhoneNumber, parsePhoneNumberWithError } from 'libphonenumber-js'
import { useEffect, useState } from 'react'
import { IInputs } from '../generated/ManifestTypes'
import { STATUS_ICON } from './App'

export interface IPhoneInput {
  context: ComponentFramework.Context<IInputs>
  phoneNumber: E164Number | undefined | null
  setPhoneNumber:  React.Dispatch<React.SetStateAction<E164Number>>
  onChange: any
  countryCode: CountryCode | undefined
  setStatus: React.Dispatch<React.SetStateAction<string>>
}

const textFieldStyle = (props: ITextFieldStyleProps): Partial<ITextFieldStyles> => ({
  ...(props.disabled
    ? {
      fieldGroup: {
        border: 'none',
      },
      field: {
        fontWeight: 400,
        color: 'rgb(51, 51, 51)',
        backgroundColor: 'transparent',
        ':hover': {
          backgroundColor: 'rgb(226, 226, 226)',
        },
      },
    }
    : props.focused
      ? {
        fieldGroup: {
          border: 'none',
          ':after': {
            border: 'none',
          },
        },
        field: {
          border: '1px solid rgb(102, 102, 102)',
        },
      }
      : {
        fieldGroup: {
          borderColor: 'transparent',
          ':after': {
            border: 'none',
          },
          ':hover': {
            borderColor: 'rgb(102, 102, 102)',
          },
        },
        field: {
          fontWeight: 400,
          ':hover': {
            fontWeight: 400,
            border: '1px solid rgb(102, 102, 102)',
          },
        },
      }),
})

const PhoneTextField = ({ context, phoneNumber, setPhoneNumber, onChange, countryCode, setStatus }: IPhoneInput) => {
  useEffect(() => {
    validate(context, phoneNumber ?? '', countryCode, setPhoneNumber, onChange, setStatus)
  }, [countryCode])

  return (
    <TextField
      placeholder="---"
      value={phoneNumber as string}
      borderless
      autoComplete="off"
      onChange={(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string | undefined) => validate(context, newValue ?? '', countryCode, setPhoneNumber, onChange, setStatus)}
      styles={textFieldStyle}
    />
  )
}

const validate = (context: ComponentFramework.Context<IInputs>, newValue: string, countryCode: CountryCode | undefined, setPhoneNumber:  React.Dispatch<React.SetStateAction<E164Number>>, onChange: any, setStatus:  React.Dispatch<React.SetStateAction<string>>) => {
  if(newValue == "") {
    setStatus(STATUS_ICON.Error)
    setPhoneNumber(newValue)
    onChange({ PhoneNumber: newValue, IsValid: true })
  }

  let parsedPhoneNumber
  try {
    parsedPhoneNumber = parsePhoneNumberWithError(newValue, countryCode)
  } catch (error) {
    setPhoneNumber(newValue)
    setStatus(STATUS_ICON.Error)
    return
  }

  if (parsedPhoneNumber.country == countryCode && parsedPhoneNumber.isValid()) {
    setStatus(STATUS_ICON.Valid)
    if (context.parameters.PhoneNumber.raw != parsedPhoneNumber.formatInternational()) {
      setPhoneNumber(parsedPhoneNumber.formatInternational())
      onChange({ PhoneNumber: parsedPhoneNumber.formatInternational(), IsValid: true })
    }
  } else {
    setStatus(STATUS_ICON.Error)
    setPhoneNumber(newValue)
    onChange({ PhoneNumber: newValue, IsValid: false })
  }
}

export default PhoneTextField
