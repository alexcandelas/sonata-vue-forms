<template>
    <button
        class="btn"
        :class="{'btn--loading': isLoading}"
        :disabled="isLoading"
        type="submit"
    >
        <slot>
            {{ translate('send') }}
        </slot>
    </button>
</template>

<script>
    import Localization from './mixins/LocalizationMixin.js';

    export default {
        mixins: [Localization],

        props: {
            isSubmitting: {
                type: Boolean,
                required: false,
                default: null
            }
        },

        data() {
            return {
                localization: {
                    en: {
                        send: 'Send'
                    },
                    es: {
                        send: 'Enviar'
                    }
                }
            }
        },

        computed: {
            isLoading: function() {
                return this.isSubmitting !== null ?
                    this.isSubmitting :
                    this.$parent.isSubmitting;
            }
        }
    };
</script>
