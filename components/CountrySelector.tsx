import React = require('react')
import { Dropdown, IDropdownOption, IDropdownStyles } from '@fluentui/react';
import ReactCountryFlag from 'react-country-flag';
import { CountryCode } from 'libphonenumber-js';

// Assuming you have a list of countries and their codes
const countries: { code: CountryCode, name: string }[] = [
    // ... populate this list with country codes and names
    { code: 'FR', name: 'France' },
    { code: 'US', name: 'United States' },
    // ... other countries
];

const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: { width: 200 }
};

interface CountrySelectorProps {
    selectedCountry: CountryCode;
    onCountryChange: (countryCode: CountryCode) => void;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({ selectedCountry, onCountryChange }) => {
    const options: IDropdownOption[] = countries.map(country => ({
        key: country.code,
        text: country.name,
        data: { icon: country.code },
    }));

    const onRenderOption = (option?: IDropdownOption): JSX.Element => {
        return (
            <div>
                {option?.data?.icon && (
                    <ReactCountryFlag countryCode={option.data.icon} svg />
    )}
        {option?.text}
        </div>
    );
    };

    return (
        <Dropdown
            selectedKey={selectedCountry}
    onChange={(event, option) => onCountryChange(option?.key as CountryCode)}
    placeholder="Select a country"
    options={options}
    onRenderOption={onRenderOption}
    styles={dropdownStyles}
    />
);
};

export default CountrySelector;
