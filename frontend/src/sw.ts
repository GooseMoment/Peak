/// <reference lib="webworker" />
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching"

declare const self: ServiceWorkerGlobalScope

cleanupOutdatedCaches()
precacheAndRoute(self.__WB_MANIFEST)

// This listener sends requests heading to the API server including
// credentials (e.g. the 'Authorization' header)
// Safari seems to send redirected requests omitting
// the Authorization header without this event listener
self.addEventListener("fetch", function (event) {
    const url = new URL(event.request.url)
    if (url.origin === import.meta.env.VITE_API_BASEURL) {
        event.respondWith(fetch(event.request, { credentials: "include" }))
    }
})

self.addEventListener("message", function (event) {
    if (event.data && event.data.type === "SKIP_WAITING") {
        // immediately update the SW
        self.skipWaiting()
    }
})

self.addEventListener("activate", function (event) {
    event.waitUntil(self.clients.claim())
})

self.addEventListener("push", function (event) {
    const data = event.data?.json()
    if (data) {
        self.registration.showNotification(data.title, data)
    }
})

self.addEventListener("notificationclick", function (event) {
    const url = event.notification.data?.click_url

    const openWindow = async () => {
        const matchedClients = await self.clients.matchAll({ type: "window" })
        for (const client of matchedClients) {
            // client.url is a full url e.g. http://localhost:8080/app/notifications?active=all
            if (client.url.includes("/app/notifications")) {
                client.navigate(url)
                client.focus()
                return
            }
        }

        await self.clients.openWindow(url)
    }

    // clients.openWindow throws InvalidAccess without waitUntil
    event.waitUntil(openWindow())
})

// https://github.com/microsoft/TypeScript/issues/14877#issuecomment-402743582
export default null
