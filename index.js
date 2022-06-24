import BaseForm from './src/BaseForm.vue';
import CheckboxField from './src/fields/CheckboxField.vue';
import DateField from './src/fields/DateField.vue';
import FieldErrors from './src/FieldErrors.vue';
import FileField from './src/fields/FileField.vue';
import FormButton from './src/FormButton.vue';
import FormControl from './src/fields/FormControl.vue';
import RadioField from './src/fields/RadioField.vue';
import SelectField from './src/fields/SelectField.vue';
import SwitchField from './src/fields/SwitchField.vue';
import TextArea from './src/fields/TextArea.vue';
import TextField from './src/fields/TextField.vue';

export default {
    install (app, options = {}) {
        app.component('base-form', {
            extends: BaseForm,
            props: {
                requestConfig: {
                    type: Object,
                    required: false,
                    default: () => { return options; }
                }
            }
        });

        app.component('checkbox-field', CheckboxField);
        app.component('date-field', DateField);
        app.component('field-errors', FieldErrors);
        app.component('file-field', FileField);
        app.component('form-button', FormButton);
        app.component('form-control', FormControl);
        app.component('radio-field', RadioField);
        app.component('select-field', SelectField);
        app.component('switch-field', SwitchField);
        app.component('text-area', TextArea);
        app.component('text-field', TextField);
    }
};

export {
    BaseForm,
    CheckboxField,
    DateField,
    FieldErrors,
    FileField,
    FormButton,
    FormControl,
    RadioField,
    SelectField,
    SwitchField,
    TextArea,
    TextField
};
