import { PreferenceFieldName } from '../constants/preference-field-names.enum';

export class Preferences {
  constructor(props: Partial<Preferences>) {
    if (props) Object.assign(this, props);
  }

  fields: {
    [preferencesFieldName: PreferenceFieldName]: string | boolean | number;
  };
}
