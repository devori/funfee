import App from "./App.svelte";

if (location.pathname === '/' || location.pathname === '') {
  location.href = '/transfer/ftx';
}

const app = new App({
  target: document.getElementById("app"),
});

export default app;
