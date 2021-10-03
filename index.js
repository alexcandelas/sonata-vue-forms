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
    install (Vue, options = {}) {
        Vue.component('base-form', Vue.extend({
            extends: BaseForm,
            props: {
                requestConfig: {
                    type: Object,
                    required: false,
                    default: () => { return options; }
                }
            }
        }));

        Vue.component('checkbox-field', CheckboxField);
        Vue.component('date-field', DateField);
        Vue.component('field-errors', FieldErrors);
        Vue.component('file-field', FileField);
        Vue.component('form-button', FormButton);
        Vue.component('form-control', FormControl);
        Vue.component('radio-field', RadioField);
        Vue.component('select-field', SelectField);
        Vue.component('switch-field', SwitchField);
        Vue.component('text-area', TextArea);
        Vue.component('text-field', TextField);
    }
}

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
