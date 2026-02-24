// Load our global styles
import './assets/main.css'

// Import Vue and Pinia (for state management)
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// Create the Vue application
const app = createApp(App)

// Add Pinia for state management (like a global data store)
app.use(createPinia())

// Mount the app to the page
app.mount('#app')
