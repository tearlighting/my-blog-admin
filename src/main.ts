import { createApp } from "vue"
import "./style/index.less"
import App from "./App.vue"
import { addPlugins } from "./plugins"
import { initApp } from "./init"
const app = createApp(App)

addPlugins(app)

app.mount("#app")

initApp()
