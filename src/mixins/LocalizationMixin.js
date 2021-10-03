export default {
    props: {
        /**
         * Default language.
         */
        lang: {
            type: String,
            required: false
        },
    },

    methods: {
        /**
         * Get the translated value for the given string.
         *
         * @param  {string} string
         * @return {string}
         */
        translate: function(string) {
            const lang = this.lang || this.$parent.language || 'en';

            return this.localization[lang][string];
        }
    }
};
