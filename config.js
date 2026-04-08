// Global frontend config for local and deployed environments.
(function bootstrapAppConfig() {
  const localHosts = new Set(["localhost", "127.0.0.1"]);
  const isLocal = localHosts.has(window.location.hostname);
  const fallbackApiBase = isLocal
    ? "http://localhost:5000/api"
    : "https://your-backend-domain.com/api";

  const savedApiBase = window.localStorage.getItem("API_BASE");

  window.APP_CONFIG = {
    API_BASE: savedApiBase || fallbackApiBase
  };
})();
