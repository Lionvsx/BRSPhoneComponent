import { LabelKey } from '../index'
type Locale = { [key in LabelKey]: string }
// eslint-disable-next-line no-redeclare
declare const Locale: Locale
export default Locale