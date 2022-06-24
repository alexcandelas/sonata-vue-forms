<template>
    <select
        :id="computedId"
        :name="name"
        class="form-field"
        :class="{'form-field--invalid': hasErrors}"
        :aria-invalid="hasErrors ? 'true' : null"
        :aria-describedBy="describedBy || null"
        v-model="internalValue"
        @change="$emit('update:modelValue', internalValue)"
    >
        <option
            value=""
            :disabled="! nullable"
        >
            <slot>{{ translate('defaultOption') }}</slot>
        </option>

        <slot name="before"></slot>

        <slot name="options">
            <template v-for="option in computedOptions">
                <optgroup
                    v-if="option.isGroup"
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

        componentName: 'SelectField',

        props: {
            /**
             * Define if a `null` option can be selected.
             */
            nullable: {
                type: Boolean,
                required: false,
                default: false
            },

            /**
             * An object of values and descriptions to populate the options.
             */
            options: {
                type: [Array, Object],
                required: false
            }
        },

        data() {
            return {
                internalValue: this.modelValue || '',
                localization: {
                    en: {
                        defaultOption: '- Select an option -'
                    },
                    es: {
                        defaultOption: '- Selecciona una opción -'
                    }
                }
            };
        },

        computed: {
            /**
             * Return a normalized options array.
             *
             * @return {Array}
             */
            computedOptions: function() {
                let options = [];

                if (Array.isArray(this.options)) {
                    this.options.forEach((item, key) => {
                        options.push(this.parseOption(item, key));
                    });

                    return options;
                }

                for (const i in this.options) {
                    options.push(this.parseOption(this.options[i], i));
                }

                return options;
            }
        },

        watch: {
            modelValue: function(value) {
                this.internalValue = value;
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
                        });

                        return {
                            text: group,
                            value: firstKey,
                            isGroup: true
                        };
                    }

                    return {
                        text: item[firstKey],
                        value: firstKey,
                        isGroup: false
                    };
                }

                return {
                    text: item,
                    value: key,
                    isGroup: false
                };
            }
        }
    };
</script>
