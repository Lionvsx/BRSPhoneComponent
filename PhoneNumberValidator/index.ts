import React = require('react')
import { IInputs, IOutputs } from './generated/ManifestTypes'
import { App, IPCFContext } from './components/App'
import { CountryCode } from 'libphonenumber-js/types'

export class PhoneNumberValidator implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private _props: IPCFContext
    private _outputs: any
    private notifyOutputChanged: () => void

    constructor() {}

    public onChange = (outputs: any): void => {
        this._outputs = outputs
        this.notifyOutputChanged()
    }

    public async init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): Promise<void> {
        this.notifyOutputChanged = notifyOutputChanged
        this._props = { context, onChange: this.onChange }
    }

    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        this._props.context = context

        return React.createElement(App, this._props)
    }

    public getOutputs(): IOutputs {
        return this._outputs
    }

    public destroy(): void {}
}