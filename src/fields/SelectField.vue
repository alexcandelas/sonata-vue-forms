<template>
    <select
        :id="computedId"
        :name="computedName"
        class="form-field"
        :class="{'form-field--invalid': hasErrors}"
        :aria-invalid="hasErrors ? 'true' : null"
        :aria-describedBy="describedBy || null"
        v-model="internalValue"
        @change="$emit('change', internalValue)"
    >
        <option value="" disabled>
            <slot>{{ translate('defaultOption') }}</slot>
        </option>

        <slot name="before"></slot>

        <slot name="options">
            <template v-for="option in orderedOptions">
                <optgroup
                    v-if="option.optgroup"
                    :key="option.value"
                    :label="option.value"
                >
                    <option
                        v-for="groupedOption in option.text"
                        :key="groupedOption.value"
                        :value="groupedOption.value"
                        v-text="groupedOption.text"
                    ></option>
                </optgroup>

                <option
                    v-else
                    :key="option.value"
                    :value="option.value"
                    v-text="option.text"
                ></option>
            </template>
        </slot>

        <slot name="after"></slot>
    </select>
</template>

<script>
    import isPlainObject from 'lodash/isPlainObject';
    import FormField from '../mixins/FormFieldMixin.js';
    import Localization from '../mixins/LocalizationMixin.js';

    export default {
        mixins: [FormField, Localization],

        model: {
            event: 'change'
        },

        componentName: 'SelectField',

        props: {
            /**
             * An object of values and descriptions to populate
             * the options inside the select field.
             */
            options: {
                type: [Array, Object],
                required: true
            }
        },

        data() {
            return {
                internalValue: this.value || '',
                localization: {
                    en: {
                        defaultOption: '- Select an option -'
                    },
                    es: {
                        defaultOption: '- Selecciona una opción -'
                    }
                }
            }
        },

        computed: {
            /**
             * Prepare options tree to be used in template.
             */
            orderedOptions: function() {
                let options = [];

                if (Array.isArray(this.options)) {
                    this.options.forEach((item, key) => {
                        options.push(this.parseOption(item, key));
                    })

                    return options;
                }

                for (const i in this.options) {
                    options.push(this.parseOption(this.options[i], i));
                }

                return options;
            },

            /**
             * Check if form element has a `multiple` property.
             */
            multiple: function() {
                return this.$attrs.multiple !== undefined;
            }
        },

        watch: {
            value: function(value) {
                this.internalValue = value;
            }
        },

        /**
         * Prepare the `internalValue` as array when accepting
         * multiple selections.
         */
        created() {
            if (this.multiple && ! this.internalValue) {
                this.internalValue = [];
            }
        },

        methods: {
            /**
             * Return an object with `key` and `value` properties.
             *
             * @param  {item} mixed
             * @param  {string|number} mixed
             * @return {Object}
             */
            parseOption(item, key) {
                if (isPlainObject(item)) {
                    const firstKey = Object.keys(item)[0];

                    if (Array.isArray(item[firstKey])) {
                        let group = [];

                        item[firstKey].forEach((i, k) => {
                            group.push(this.parseOption(i, k));
                        })

                        return {
                            text: group,
                            value: firstKey,
                            optgroup: true
                        };
                    }

                    return {
                        text: item[firstKey],
                        value: firstKey,
                        optgroup: false
                    };
                }

                return {
                    text: item,
                    value: key,
                    optgroup: false
                };
            }
        }
    };
</script>
