// SF6コンボメーカー Service Worker
// stale-while-revalidate: まずキャッシュを即返し、裏で最新を取得して次回に備える。
// バージョンを上げるとキャッシュ名が変わり、古いキャッシュは自動破棄される。
const CACHE_VERSION = "sf6cm-v1.26.3"; // index.htmlのバージョンと合わせて更新する
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./app.js",
  "./data.js",
  "./glossary.js",
  "./guide.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
];

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(CORE_ASSETS)).catch(() => {})
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // 外部CDN画像等はブラウザ標準に任せる

  e.respondWith(
    caches.match(e.request).then((cached) => {
      const network = fetch(e.request).then((res) => {
        if (res && res.ok) {
          caches.open(CACHE_VERSION).then((cache) => cache.put(e.request, res.clone()));
        }
        return res;
      }).catch(() => cached);
      return cached || network;
    })
  );
});
