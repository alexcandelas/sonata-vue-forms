<template>
    <fieldset
        v-if="! isBooleanCheckbox && (type === 'checkbox' || type === 'radio')"
        class="form-control"
    >
        <legend :class="labelClass">{{ label }}</legend>

        <div
            v-for="option in computedOptions"
            :key="option.value"
        >
            <component
                :is="component"
                v-bind="{...$attrs, ...sharedProps}"
                :value="option.value"
            >{{ option.label }}</component>
        </div>

        <field-errors
            v-if="displayErrors"
            :name="validationName || name"
            :errors="controlErrors"
        ></field-errors>

        <ul
            v-if="helpText.length"
            :id="computedId + '-help-text'"
            class="description"
        >
            <li v-for="(line, i) in helpText" :key="i">
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
            input-class="mr-2"
            :is="component"
            v-bind="{...$attrs, ...sharedProps}"
        >{{ label }}</component>

        <template v-else>
            <label
                :class="labelClass"
                :for="computedId"
            >{{ label }}</label>

            <br v-if="type === 'switch'">

            <component
                :is="component"
                v-bind="{...$attrs, ...sharedProps}"
                :[typeProp]="type"
                :options="options"
                @date-support-check="setDateSupport"
            >
                <template
                    v-for="slotName in Object.keys($slots)"
                    v-slot:[slotName]
                >
                    <slot :name="slotName"></slot>
                </template>
            </component>
        </template>

        <field-errors
            v-if="displayErrors"
            :name="validationName || name"
            :errors="controlErrors"
        ></field-errors>

        <ul
            v-if="helpText.length"
            :id="computedId + '-help-text'"
            class="description"
        >
            <li v-for="(line, i) in helpText" :key="i">
                {{ line }}
            </li>
        </ul>
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
             * CSS class for label elements.
             */
            labelClass: {
                type: [String, Object],
                required: false
            },

            /**
             * A list of options for select, checkbox and radio components.
             */
            options: {
                type: [Array, Object],
                required: false,
                default: () => []
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
                    checkbox: 'checkbox-field',
                    date: 'date-field',
                    file: 'file-field',
                    radio: 'radio-field',
                    select: 'select-field',
                    switch: 'switch-field',
                    text: 'text-field',
                    textarea: 'text-area'
                }
            };
        },

        computed: {
            /**
             * Return the component HTML tag.
             */
            component: function() {
                return this.availableComponents[
                    this.componentExists ? this.type : 'text'
                ];
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
                if (! Array.isArray(this.options)) {
                    console.error(`FormControl.vue: The "options" prop for a "${this.type}" component must be an array.`);
                }

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
             * List of validation errors for the field.
             */
            controlErrors: function() {
                return this.errors || this.$parent.errors[this.validationName || this.name] || [];
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
             * Returns a normalized array of help text.
             */
            helpText: function() {
                if (! this.help) {
                    return [];
                }

                return Array.isArray(this.help) ? this.help : [this.help];
            },

            /**
             * Check if the component is a boolean checkbox (without options).
             */
            isBooleanCheckbox: function() {
                return this.type === 'checkbox' && ! this.options.length;
            },

            /**
             * The default language.
             */
            language: function() {
                return this.$parent.language || 'en';
            },

            /**
             * Merge all props needed by all dynamic components.
             *
             * @return {Object}
             */
            sharedProps: function() {
                return {
                    'display-errors': this.displayErrors,
                    'errors': this.controlErrors,
                    'name': this.name,
                    'model-value': this.modelValue,
                    'aria-describedby': this.describedBy || null,
                    'validation-name': this.validationName
                };
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
