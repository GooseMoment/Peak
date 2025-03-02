/// <reference lib="webworker" />
import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching"

declare const self: ServiceWorkerGlobalScope

cleanupOutdatedCaches()
precacheAndRoute(self.__WB_MANIFEST)

self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
        // immediately update the SW
        self.skipWaiting()
    }
})

self.addEventListener("activate", (event) => {
    event.waitUntil(self.clients.claim())
})

self.addEventListener("push", function (event) {
    const data = event.data?.json()
    if (data) {
        self.registration.showNotification(data.title, data)
    }
})

self.addEventListener("notificationclick", async function (event) {
    const url = event.notification.data?.click_url

    const matchedClients = await self.clients.matchAll({ type: "window" })
    for (const client of matchedClients) {
        if (client.url.includes("/notifications")) {
            client.navigate(url)
            client.focus()
            return
        }
    }

    self.clients.openWindow(url)
})

// https://github.com/microsoft/TypeScript/issues/14877#issuecomment-402743582
export default null
