import { createApp } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import { VueFire } from 'vuefire'

import App from './App.vue'
import { firebaseApp } from './firebase'

import '@vueup/vue-quill/dist/vue-quill.snow.css';

const app = createApp(App)
app.component('QuillEditor', QuillEditor)
app.use(VueFire, {
    firebaseApp,
    modules: [
    ],
})

app.mount('#app')