// Styles first: Bootstrap + our overrides (teacher's notes: custom overrides
// go in app.scss, so it replaces bootstrap.min.css), then the icon font.
// Everything a component adds in its own <style scoped> loads after these,
// so a component's rules build on the app-wide ones instead of losing to them.
import './sass/app.scss';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// Turns on Bootstrap's data-bs- attributes (dropdowns, accordions). It is the
// same copy AppModal imports with { Modal }, so a modal's ✕ and AppModal
// share one Modal object.
import 'bootstrap';

const app = createApp(App);

app.use(router);
app.mount('#app');
