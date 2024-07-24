export default async function registerSW() {
    if (!"serviceWorker" in navigator) {
        console.log("Unsupported browser.")
        return
    }

    try {
        await navigator.serviceWorker.register("/service-worker.js")
        console.log("SW registered.")
    } catch (err) {
        console.error("Unable to register service worker.", err)
    }
}
