<template>
    <form>
        <slot
            :data="data"
            :errors="errorsByField"
            :fields="fields"
            :isSubmitting="isSubmitting"
            :postSizeError="postSizeError"
            :submitError="submitError"
            :supportsDates="supportsDates"
        ></slot>
    </form>
</template>

<script>
    import axios from 'axios';
    import defaultsDeep from 'lodash/defaultsDeep';
    import isPlainObject from 'lodash/isPlainObject';
    import scrollIntoView from 'scroll-into-view';

    export default {
        props: {
            /**
             * The URI that will recieve the data.
             */
            action: {
                type: String,
                required: true
            },

            /**
             * Passed properties or methods that can be accessed from the form.
             */
            data: {
                type: Object,
                required: false
            },

            /**
             * Define if form events should be emitted to parent component.
             */
            emitEvents: {
                type: Boolean,
                required: false,
                default: false
            },

            /**
             * Define if form should scroll to first error if validation fails.
             */
            enableErrorScrolling: {
                type: Boolean,
                required: false,
                default: true
            },

            /**
             * Define initial values for fields.
             */
            initial: {
                type: Object,
                required: false,
                default: () => { return {}; }
            },

            /**
             * Language for some component's help text. The default being
             * the value specified in the html `lang` attribute.
             */
            lang: {
                type: String,
                required: false
            },

            /**
             * HTTP method used to submit the form.
             */
            method: {
                type: String,
                required: false,
                default: 'post'
            },

            /**
             * Make POST requests with a `_method` field.
             */
            methodSpoofing: {
                type: Boolean,
                required: false,
                default: true
            },

            /**
             * Redirect to the given URI after form submit. This overrides
             * any redirection received as response. Leave empty to ignore.
             */
            redirectTo: {
                type: String,
                required: false,
                default: ''
            },

            /**
             * Settings for Axios requests.
             */
            requestConfig: {
                type: Object,
                required: false,
                default: () => { return {}; }
            },

            /**
             * Space to have as offset between the top of the vieport and the
             * first invalid field when validation fails. Unitless pixel value.
             */
            scrollOffset: {
                type: Number,
                required: false,
                default: 100
            },

            /**
             * A callback executed during errors scrolling, which conditions
             * the elements that should scroll. The callback receives the
             * current `target` HTMLElement as first parameter, and a second
             * `parentsScrolled` parameter, which indicates the number of
             * scrolled parents so far.
             */
            scrollValidTarget: {
                type: Function,
                required: false
            },

            /**
             * Define if the form must perform AJAX validation on submit
             * and display any errors if the validation fails.
             */
            validate: {
                type: Boolean,
                required: false,
                default: true
            },

            /**
             * Aliases for invalid fields received during validation.
             * A field can be internally referenced with a different name
             * than the one received to diplay its errors. Example:
             *
             * :validation-alias: {
             *     original_field_name: alias
             * }
             */
            validationAlias: {
                type: Object,
                required: false,
                default: () => { return {}; }
            }
        },

        data() {
            return this.mergeInitialData({
                errors: {},
                errorsByField: {},
                isSubmitting: false,
                language: '',
                submitError: false,
                supportsDates: null,
                postSizeError: false,
                prefersReducedMotion: window.matchMedia('(prefers-reduced-motion)').matches,
                fields: {
                    _method: this.method
                }
            });
        },

        /**
         * Group validation errors by field.
         * Useful when using array fields in form. Example:
         *
         * errors: {
         *     textfield_error: ...
         *     array_error.0: ...
         *     array_error.1: ...
         * }
         *
         * errorsByField: {
         *     textfield_error: ...
         *     array_error: [
         *         0: ...
         *         1: ...
         *     ]
         * }
         */
        watch: {
            errors: function(value) {
                const regex = new RegExp('\\..+$');
                let errorsByField = {};

                for (let errorKey in value) {
                    const matches = regex.exec(errorKey);

                    if (matches) {
                        const field = errorKey.replace(regex, '');
                        const index = matches[0].replace('.', '');

                        errorsByField[field] = errorsByField[field] || {};
                        errorsByField[field][index] = value[errorKey];
                    }
                    else {
                        errorsByField[errorKey] = value[errorKey];
                    }
                }

                this.errorsByField = errorsByField;
            }
        },

        /**
         * Set language.
         */
        created() {
            this.setLanguage();
        },

        /**
         * Add listener for the submit event.
         */
        mounted() {
            this.$el.addEventListener('submit', this.submit);

            this.emit('mounted');
        },

        methods: {
            /**
             * Set language for help text in components.
             */
            setLanguage() {
                const supported = ['en', 'es'];

                if (this.lang && supported.includes(this.lang)) {
                    return this.language = this.lang;
                }

                const siteLanguage = document.documentElement.lang;

                this.language = supported.includes(siteLanguage) ? siteLanguage : 'en';
            },

            /**
             * Submit the form via AJAX.
             */
            submit(e) {
                e.preventDefault();

                const method = this.methodSpoofing ? 'post' : this.method;

                this.isSubmitting = true;
                this.submitError = false;
                this.postSizeError = false;

                this.hook('onSubmit');

                axios[method](
                    this.action,
                    this.createFormData(),
                    defaultsDeep(this.requestConfig, {
                        headers: {'X-Requested-With': 'XMLHttpRequest'}
                    })
                )
                .then(this.onSuccess)
                .catch(this.onSubmitFail);
            },

            /**
             * Return a new FormData object with the information
             * of the `fields` property.
             *
             * If a field has an Array or Object as value, square
             * brackets "[]" are appended to the key name.
             *
             * @return {FormData}
             */
            createFormData() {
                const formData = new FormData();

                for (let key in this.fields) {
                    if (
                        Array.isArray(this.fields[key]) ||
                        isPlainObject(this.fields[key])
                    ) {
                        for (let i in this.fields[key]) {
                            formData.append(key + '[' + i + ']', this.fields[key][i]);
                        }
                    }
                    else {
                        formData.append(key, this.fields[key]);
                    }
                }

                if (this.methodSpoofing) {
                    formData.append('_method', this.method);
                }

                return formData;
            },

            /**
             * Merge internal data with all passed properties
             * and initial field values.
             *
             * @param  {Object} internalData
             * @return {Object}
             */
            mergeInitialData(internalData = {}) {
                for (let key in this.data) {
                    if (this[key] || internalData.hasOwnProperty(key)) {
                        console.warn(`BaseForm: The "${key}" data property provided to BaseForm component is being ignored as it clashes with an existing property or method.`);
                        continue;
                    }

                    internalData[key] = this.data[key];
                }

                for (let key in this.initial) {
                    internalData.fields[key] = this.initial[key];
                }

                return internalData;
            },

            /**
             * If the failed response has a status code of 422 or 429, handle the
             * display of validation errors according to user options.
             * Otherwise, treat it as a server error.
             *
             * @param {Object} error
             */
            onSubmitFail(error) {
                this.errors = {};
                this.validationCodes = [422, 429];

                this.isSubmitting = false;
                this.submitError = this.validationCodes.indexOf(error.response.status) === -1;

                this.hook('onFail', error);
                this.emit('fail', error);

                if (error.response.status === 413) {
                    this.postSizeError = true;
                }

                if (! this.validate || this.submitError) {
                    this.emit('error', error);

                    return;
                }

                this.errors = this.buildValidationErrors(error.response.data.errors);

                // Wait for `aria-invalid` attributes to be updated
                // before scrolling to the first invalid field
                Vue.nextTick(() => {
                    if (this.enableErrorScrolling) {
                        this.scrollToError();
                    }

                    this.hook('validated');
                    this.emit('validation', this.errorsByField);
                });
            },

            /**
             * Handle redirection after receiving a successful response.
             *
             * @param {Object} response
             */
            onSuccess(response) {
                if (this.redirectTo) {
                    return window.location.href = this.redirectTo;
                }

                if (response.headers['redirect-to']) {
                    return window.location.href = response.headers['redirect-to'];
                }

                this.errors = {};
                this.isSubmitting = false;

                this.hook('submitSucceeded', response);
                this.emit('success', response);
            },

            /**
             * Return the validation errors with aliased fields.
             *
             * @param  {Object} errors
             * @return {Object}
             */
            buildValidationErrors(errors) {
                const aliasKeys = Object.keys(this.validationAlias);

                for (let key in errors) {
                    if (aliasKeys.indexOf(key) !== -1) {
                        errors[this.validationAlias[key]] = errors[key];
                        delete errors[key];
                    }
                }

                return errors;
            },

            /**
             * Scroll to the first invalid field in form.
             */
            scrollToError() {
                const invalidField = this.$el.querySelector('[aria-invalid="true"]');

                if (invalidField) {
                    scrollIntoView(invalidField, {
                        time: this.prefersReducedMotion ? 0 : 400,
                        validTarget: this.scrollValidTarget || null,
                        align:{
                            top: 0,
                            topOffset: this.scrollOffset
                        },
                    }, () => invalidField.focus());
                }
            },

            /**
             * Emit the given event to the parent component.
             *
             * @param {string} name
             * @param {mixed} params
             */
            emit(name, params = null) {
                if (this.emitEvents) {
                    this.$emit(name, params);
                }
            },

            /**
             * Call a method after verifying that it exists.
             * Useful for registering hooks for use in components that might
             * extend this one.
             *
             * @param {string} method
             * @param {mixed} params
             */
            hook(method, params = null) {
                if (typeof this[method] === 'function') {
                    this[method](params);
                }
            }
        }
    };
</script>
