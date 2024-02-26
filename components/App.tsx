import * as React from 'react'
import { useEffect, useState } from 'react'
import { IInputs } from '../generated/ManifestTypes'


import { CountryCode, E164Number, parsePhoneNumberWithError } from 'libphonenumber-js'
import { FontIcon, Stack, mergeStyleSets, mergeStyles, IconButton, IIconProps } from '@fluentui/react'

import PhoneTextField from './PhoneTextField'
import ReactCountryFlag from 'react-country-flag'
import CountrySelector from "./CountrySelector";
import LookupValue = ComponentFramework.LookupValue;

export interface IPCFContext {
  context: ComponentFramework.Context<IInputs>
  onChange(outputs: any): void
}

const iconClass = mergeStyles({
  fontSize: 14,
  height: 14,
  width: 14,
  margin: '0 14px',
})

const classNames = mergeStyleSets({
  valid: [{ color: 'green' }, iconClass],
  invalid: [{ color: 'red' }, iconClass],
})

export const STATUS_ICON = { Valid: 'CompletedSolid', Error: 'DRM' }

export const App = ({ context, onChange }: IPCFContext) => {
  if (!context) return <></>

  const [status, setStatus] = useState<string>(STATUS_ICON.Valid)
  const [phoneNumber, setPhoneNumber] = useState(context.parameters.PhoneNumber.raw as E164Number)
  const [countryCode, setCountryCode] = useState<CountryCode | undefined>(undefined)
    const [selectedCountry, setSelectedCountry] = useState<CountryCode>('FR');


    const callIcon: IIconProps = { iconName: "Phone" };
    const phoneRef: string = "tel:" + phoneNumber;

  useEffect(() => {
    const getCountryCode = async (webAPI: ComponentFramework.WebApi, countryLookup: ComponentFramework.LookupValue[]) => {
      if (countryLookup?.length < 1) setCountryCode(undefined)
      const result: ComponentFramework.WebApi.Entity = await webAPI.retrieveRecord(countryLookup[0].entityType, countryLookup[0].id)
      setCountryCode(result.brs_countrycode as CountryCode)
        setSelectedCountry(result.brs_countrycode as CountryCode)
    }

    getCountryCode(context.webAPI, context.parameters.Country?.raw).then(() =>
        parsePhoneNumberWithError(phoneNumber, countryCode).isValid() || phoneNumber == null ? onChange({ IsValid: true }) : onChange({ IsValid: false })
    )

  }, [context.parameters.Country])

    const handleCountryChange = (newCountryCode: CountryCode) => {
        setSelectedCountry(newCountryCode);
        // You may need to re-validate the phone number here with the new country code
    };

  return (
    <div style={{ width: '100%' }}>
      <Stack
        verticalAlign="center"
        tokens={{
          childrenGap: 0,
        }}
      >
        <Stack
          horizontal
          verticalAlign="center"
          horizontalAlign="start"
          tokens={{
            childrenGap: 10,
            padding: 10,
          }}
        >
            {/* Country Selector Dropdown */}
            <CountrySelector selectedCountry={selectedCountry} onCountryChange={handleCountryChange} />
          {countryCode && (
            <>
              <ReactCountryFlag countryCode={countryCode as string} svg />
              <FontIcon aria-label={status} iconName={status} className={status == STATUS_ICON.Valid ? classNames.valid : classNames.invalid} />
            </>
          )}
        </Stack>
        <Stack
            horizontal
            verticalAlign="center"
            horizontalAlign="start"
            tokens={{
              childrenGap: 10,
              padding: 10,
            }}
        >
        <Stack.Item>
            <PhoneTextField context={context} phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber} onChange={onChange} setStatus={setStatus} countryCode={countryCode} />
        </Stack.Item>
        <IconButton
                  iconProps={callIcon}
                  title="Click To Call"
                  aria-label="ClickToCall"
                  href={`tel:${phoneNumber}`}
                ></IconButton>
        </Stack>
      </Stack>
    </div>
  )
}
