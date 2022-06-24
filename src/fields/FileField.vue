<template>
    <div class="form-file">
        <input
            :id="computedId"
            :name="name"
            class="form-file__upload"
            type="file"
            tabindex="0"
            :multiple="multiple"
            :aria-invalid="hasErrors ? 'true' : null"
            :aria-describedby="describedBy || null"
            v-bind="$attrs"
            ref="input"
            @change="onChange"
            @focus="hasFocus = true"
            @blur="hasFocus = false"
        >

        <input
            class="form-file__text"
            :class="{
                'form-field--invalid': hasErrors,
                'form-field--focus': hasFocus
            }"
            type="text"
            :placeholder="placeholder || translate('placeholder')"
            :value="inputText"
            tabindex="-1"
        >

        <button
            class="form-file__btn btn btn--light"
            type="button"
            @click="$refs.input.click()"
        >
            {{ translate('browse') }}
        </button>
    </div>
</template>

<script>
    import FormField from '../mixins/FormFieldMixin.js';
    import Localization from '../mixins/LocalizationMixin.js';

    export default {
        mixins: [FormField, Localization],

        inheritsAttrs: false,

        componentName: 'FileField',

        props: {
            /**
             * Define if multiple files can be uploaded.
             */
            multiple: {
                type: Boolean,
                required: false,
                default: false
            },

            /**
             * A placeholder to show in the text input when no file
             * has been selected yet.
             */
            placeholder: {
                type: String,
                required: false
            }
        },

        data() {
            return {
                attachments: [],
                hasFocus: false,
                inputText: '',
                localization: {
                    en: {
                        browse: 'Browse',
                        placeholder: 'No file chosen.',
                        filesSelected: '{count} files selected.'
                    },
                    es: {
                        browse: 'Examinar',
                        placeholder: 'Ningún archivo seleccionado.',
                        filesSelected: '{count} archivos seleccionados.'
                    }
                }
            };
        },

        watch: {
            /**
             * Update the text displayed when attachments change.
             *
             * @param {Object} value
             */
            attachments: function(value) {
                switch(value.length) {
                    case 0:
                        this.inputText = '';
                        break;
                    case 1:
                        this.inputText = value[0].name;
                        break;
                    default:
                        this.inputText = this.translate('filesSelected')
                            .replace('{count}', value.length);
                }
            }
        },

        /**
         * Set an initial text.
         */
        created() {
            if (typeof this.modelValue === 'string') {
                this.inputText = this.modelValue;
            }
        },

        methods: {
            /**
             * Update the attachments.
             *
             * @param {Object} e
             */
            onChange(e) {
                let attachments = [];

                Array.prototype.forEach.call(e.target.files, file => {
                    attachments.push(file);
                });

                this.attachments = attachments;

                this.$emit(
                    'update:modelValue',
                    this.multiple ? this.attachments : this.attachments[0]
                );
            }
        }
    };
</script>
