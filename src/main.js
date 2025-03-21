import { createApp } from 'vue'
import { Quasar, Dialog, Notify } from 'quasar'

// Import Quasar css
import 'quasar/src/css/index.sass'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(Quasar, {
  plugins: { Dialog, Notify },
})
app.use(router)

app.mount('#app')
