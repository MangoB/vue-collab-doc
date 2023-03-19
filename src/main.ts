import { createApp } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'

import { VueFire, VueFireAuth } from 'vuefire'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'

const vuetify = createVuetify({
  components,
  directives,
})

import App from './App.vue'
import router from './router'
import { firebaseApp } from './firebase'

import '@vueup/vue-quill/dist/vue-quill.snow.css';

const app = createApp(App)
app.component('QuillEditor', QuillEditor)
app.use(VueFire, {
    firebaseApp,
    modules: [
        VueFireAuth(),
    ],
})
app.use(router)
app.use(vuetify)

app.mount('#app')