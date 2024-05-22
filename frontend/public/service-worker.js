console.log("Service Worker start")

self.addEventListener("push", function(event) {
    const data = event?.data?.json()
    if (data) {
        self.registration.showNotification(data.title, data)
    }
})

self.addEventListener("notificationclick", function(event) {
    const url = event?.notification?.data?.click_url

    event.waitUntil(
        self.clients.matchAll({type: "window"}).then(clients => {
            if (clients.length > 0) {
                for (let i=0; i<clients.length; i++) {
                    if (clients[i].url.includes("/notifications")) {
                        clients[i].navigate(url)
                        clients[i].focus()
                        return
                    }
                }

            }

            self.clients.openWindow(url);
        })
    )
})
