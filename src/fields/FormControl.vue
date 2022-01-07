<template>
    <fieldset
        v-if="! isBooleanCheckbox && (type === 'checkbox' || type === 'radio')"
        class="form-control"
    >
        <legend>{{ label }}</legend>

        <div
            v-for="option in computedOptions"
            :key="option.value"
        >
            <component
                :is="component.name"
                :display-errors="displayErrors"
                :errors="controlErrors"
                :name="computedName"
                :form-value="value"
                :value="option.value"
                v-bind="$attrs"
                :aria-describedby="describedBy || null"
                v-on="inputListeners"
            >{{ option.label }}</component>
        </div>

        <field-errors
            v-if="displayErrors"
            :name="computedName"
            :errors="controlErrors"
        ></field-errors>

        <ul
            v-if="helpText.length"
            :id="computedId + '-help-text'"
            class="description"
        >
            <li v-for="line in helpText">
                {{ line }}
            </li>
        </ul>

        <slot></slot>
    </fieldset>

    <div
        v-else
        class="form-control"
    >
        <component
            v-if="isBooleanCheckbox"
            :is="component.name"
            :display-errors="displayErrors"
            :errors="controlErrors"
            :name="computedName"
            :form-value="value"
            v-bind="$attrs"
            :aria-describedby="describedBy || null"
            v-on="inputListeners"
        >{{ label }}</component>

        <template v-else>
            <label :for="computedId">{{ label }}</label>

            <br v-if="type === 'switch'">

            <component
                :is="component.name"
                :display-errors="displayErrors"
                :errors="controlErrors"
                :name="computedName"
                :value="value"
                :[typeProp]="type"
                v-bind="$attrs"
                :aria-describedby="describedBy || null"
                v-on="inputListeners"
                :options="options"
                @date-support-check="setDateSupport"
            ></component>
        </template>

        <field-errors
            v-if="displayErrors"
            :name="computedName"
            :errors="controlErrors"
        ></field-errors>

        <ul
            v-if="helpText.length"
            :id="computedId + '-help-text'"
            class="description"
        >
            <li v-for="line in helpText">
                {{ line }}
            </li>
        </ul>

        <slot></slot>
    </div>
</template>


<script>
    import FormField from '../mixins/FormFieldMixin.js';

    export default {
        mixins: [FormField],

        inheritAttrs: false,

        componentName: 'FormControl',

        props: {
            /**
             * Help text for the component.
             */
            help: {
                type: [String, Array],
                required: false
            },

            /**
             * The text used as label.
             */
            label: {
                type: String,
                required: true
            },

            /**
             * A list of options for select, checkbox and radio components.
             */
            options: {
                type: Array,
                required: false
            },

            /**
             * The type of component.
             */
            type: {
                type: String,
                required: false,
                default: 'text'
            }
        },

        data() {
            return {
                availableComponents: {
                    checkbox: {
                        name: 'checkbox-field',
                        event: 'change'
                    },
                    date: {
                        name: 'date-field',
                        event: 'input'
                    },
                    file: {
                        name: 'file-field',
                        event: 'change'
                    },
                    radio: {
                        name: 'radio-field',
                        event: 'change'
                    },
                    select: {
                        name: 'select-field',
                        event: 'change'
                    },
                    switch: {
                        name: 'switch-field',
                        event: 'change'
                    },
                    text: {
                        name: 'text-field',
                        event: 'input'
                    },
                    textarea: {
                        name: 'text-area',
                        event: 'input'
                    }
                }
            };
        },

        computed: {
            /**
             * Settings for the rendered component.
             */
            component: function() {
                return this.availableComponents[
                    this.componentExists ? this.type : 'text'
                ]
            },

            /**
             * Check if the received `type` prop matches
             * an available field component.
             */
            componentExists: function() {
                return !! this.availableComponents[this.type];
            },

            /**
             * The prepared list of options for checkbox and radio components.
             */
            computedOptions: function() {
                let result = [];

                this.options.forEach(option => {
                    const key = Object.keys(option)[0];

                    result.push({
                        label: option[key],
                        value: key
                    });
                });

                return result;
            },

            /**
             * List of validation errors for this field.
             */
            controlErrors: function() {
                return this.errors || this.$parent.errors[this.computedName] || [];
            },

            /**
             * Add the ID of the help text to the `aria-describedby` attribute.
             */
            describedBy() {
                let describedBy = this.$attrs['aria-describedby'] || '';

                if (this.helpText && this.helpText.length) {
                    describedBy += ' ' + this.computedId + '-help-text';
                }

                return describedBy.trim();
            },

            /**
             * The passed help text prepared as an array.
             */
            helpText: function() {
                if (Array.isArray(this.help)) {
                    return this.help;
                }

                return this.help ? [this.help] : [];
            },

            /**
             * Add the appropiate listeners to the component.
             */
            inputListeners: function () {
                return Object.assign({}, this.$listeners, {
                    [this.component.event]: value => {
                        this.$emit('input', value);

                        if (this.component.event !== 'input') {
                            this.$emit(this.component.event, value);
                        }
                    }
                })
            },

            /**
             * Check if the component is a boloean checkbox (without options).
             */
            isBooleanCheckbox: function() {
                return this.type === 'checkbox' && ! this.options;
            },

            /**
             * The default language.
             */
            language: function() {
                return this.$parent.language || 'en';
            },

            /**
             * Property to pass to the rendered component when receiving
             * a `type` prop that is not available as a field component.
             */
            typeProp: function() {
                return this.componentExists ? null : 'type';
            }
        },

        methods: {
            /**
             * Set the `suportsDate` property in parent component
             * when using a DateField.
             *
             * @param {boolean} value
             */
            setDateSupport(value) {
                this.$parent.supportsDates = value;
                this.$emit('date-support-check', value);
            }
        }
    };
</script>
