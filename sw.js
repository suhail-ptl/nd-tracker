// ════════════════════════════════════════════════════════
//  ND Habit Tracker — Service Worker
//  Handles: offline caching + daily notifications
// ════════════════════════════════════════════════════════

const CACHE_NAME = 'nd-tracker-v1';
const OFFLINE_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js'
];

// ── INSTALL: cache the app shell ──
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(OFFLINE_FILES).catch(() => {}))
  );
  self.skipWaiting();
});

// ── ACTIVATE: clean old caches ──
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ── FETCH: network-first, fallback to cache ──
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then(res => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});

// ── MESSAGES from app ──
self.addEventListener('message', event => {
  if (event.data?.type === 'SCHEDULE_NOTIF') {
    scheduleDaily(event.data.time || '09:00');
  }
});

// ── NOTIFICATION CLICK ──
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow('/');
    })
  );
});

// ── DAILY NOTIFICATION SCHEDULER ──
// Stores the scheduled time and checks every minute using a recurring alarm-like pattern.
// Full background push requires a push server; this handles foreground reminders.
let scheduledTime = '09:00';
let notifInterval = null;

function scheduleDaily(time) {
  scheduledTime = time;
  if (notifInterval) clearInterval(notifInterval);

  // Check every minute if it's time
  notifInterval = setInterval(() => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const current = `${hh}:${mm}`;

    if (current === scheduledTime) {
      const today = now.toISOString().split('T')[0];
      const lastNotif = self.__lastNotifDate;
      if (lastNotif !== today) {
        self.__lastNotifDate = today;
        fireNotification();
      }
    }
  }, 60000);
}

function fireNotification() {
  const messages = [
    { title: '🧠 Time to check in!', body: 'Your habit tracker is ready. Even one tick counts 💙' },
    { title: '✅ Daily habit check-in', body: 'Progress, not perfection. How are your tanks today? 🥄' },
    { title: '🌅 Morning check-in', body: 'Start small — one habit at a time. You\'ve got this 💪' },
    { title: '🌿 ND Tracker reminder', body: 'Be kind to yourself today. Open your tracker when ready.' },
  ];
  const msg = messages[Math.floor(Math.random() * messages.length)];
  self.registration.showNotification(msg.title, {
    body: msg.body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'daily-checkin',
    renotify: false,
    vibrate: [200, 100, 200],
    actions: [
      { action: 'open', title: '✅ Open tracker' },
      { action: 'dismiss', title: 'Later' }
    ]
  });
}

// Start scheduler on activation
scheduleDaily('09:00');
