// Service Worker — Medicloud SOS Push Notifications
self.addEventListener("push", (event) => {
  if (!event.data) return;

  let data = {};
  try {
    data = event.data.json();
  } catch {
    data = { title: "🚨 SOS Alert", body: event.data.text() };
  }

  const options = {
    body: data.body || "A patient has triggered an emergency SOS alert.",
    icon: "/medi-cloud-logo.png",
    badge: "/medi-cloud-logo.png",
    tag: "sos-alert",
    renotify: true,
    requireInteraction: true,
    vibrate: [300, 100, 300, 100, 300],
    data: {
      url: data.url || "/admin",
    },
    actions: [
      { action: "view", title: "View Dashboard" },
      { action: "dismiss", title: "Dismiss" },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || "🚨 SOS Alert", options)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "view" || !event.action) {
    const url = event.notification.data?.url || "/admin";
    event.waitUntil(
      clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes("/admin") && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) return clients.openWindow(url);
      })
    );
  }
});

self.addEventListener("notificationclose", () => {
  // Optional: analytics
});
