console.log("Service Worker start")

self.addEventListener("push", function(event) {
    const data = event?.data?.json()
    if (data) {
        self.registration.showNotification(data.title, data)
    }
})
