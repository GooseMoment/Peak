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
