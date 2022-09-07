# Sonata Vue Forms

Base form components for [Vue 3](https://vuejs.org) and [Sonata CSS](https://github.com/alexcandelas/sonata).

## Instalation
```sh
npm install sonata-vue-forms --save
```

For Vue 2 use `sonata-vue-forms@0.2.2`


## Usage
```js
import BaseForm from 'sonata-vue-forms';

Vue.use(BaseForm);
```

The BaseForm component uses Axios to submit the data. You can provide [Axios configuration](https://github.com/axios/axios#request-config) for the request as the second parameter:

```js
import BaseForm from 'sonata-vue-forms';

Vue.use(BaseForm, {
    headers: {'X-CSRF-TOKEN': yourToken},
    withCredentials: true
});
```


After registering, all components will be available for use:

```html
<base-form action="/example" v-slot="{fields}">
    <div>
        <form-control
            v-model="fields.username"
            name="username"
            label="Username"
        ></form-control>

        <form-control
            v-model="fields.password"
            name="password"
            label="Password"
            type="password"
        ></form-control>

        <form-control
            v-model="fields.remember"
            name="remember"
            label="Remember me"
            type="checkbox"
        ></form-control>

        <div class="text-center">
            <form-button></form-button>
        </div>
    </div>
</base-form>
```

## Requirements
- Vue >= 3.2
- Sonata CSS >= 0.3.0

## Components
- BaseForm
- FieldErrors
- FormButton

### Field components:
- CheckboxField
- DateField
- FileField
- FormControl
- RadioField
- SelectField
- SwitchField
- TextArea
- TextField
