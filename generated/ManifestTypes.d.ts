/*
*This is auto generated from the ControlManifest.Input.xml file
*/

// Define IInputs and IOutputs Type. They should match with ControlManifest.
export interface IInputs {
    PhoneNumber: ComponentFramework.PropertyTypes.StringProperty;
    Country: ComponentFramework.PropertyTypes.LookupProperty;
    DefaultCountry: ComponentFramework.PropertyTypes.EnumProperty<"AR" | "PY" | "UY" | "US" | "GB" | "BR">;
    IsValid: ComponentFramework.PropertyTypes.TwoOptionsProperty;
}
export interface IOutputs {
    PhoneNumber?: string;
    Country?: ComponentFramework.LookupValue[];
    IsValid?: boolean;
}
