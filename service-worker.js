const CACHE_NAME = "ludochaos-v6.1";

// =========================
// ARQUIVOS ESSENCIAIS
// =========================
const FILES = [
  "./",
  "./index.html",
  "./manifest.json",

  // =========================
  // ICONS
  // =========================
  "./assets/imagem/logo192.png",
  "./assets/imagem/logo512.png",
  "./assets/imagem/logo.png",

  // =========================
  // SCREENSHOTS
  // =========================
  "./assets/imagem/screen1.png",
  "./assets/imagem/screen2.png",
  "./assets/imagem/screen3.png",
  "./assets/imagem/screen4.png",
  "./assets/imagem/screen5.png",

  // =========================
  // FONT AWESOME
  // =========================
  "./assets/fontawesome/css/all.min.css",
  "./assets/fontawesome/webfonts/fa-solid-900.woff2",
  "./assets/fontawesome/webfonts/fa-regular-400.woff2",
  "./assets/fontawesome/webfonts/fa-brands-400.woff2",

  // =========================
  // FONTES (.ttf corretos)
  // =========================
  "./assets/fontes/DMSerifDisplay-Regular.ttf",
  "./assets/fontes/Inter-Bold.ttf",
  "./assets/fontes/Inter-Medium.ttf",
  "./assets/fontes/Inter-Regular.ttf",
  "./assets/fontes/Inter-SemiBold.ttf",

  // =========================
  // SONS
  // =========================
  "./assets/musicas/fundo.mp3",
  "./assets/musicas/fundo1.mp3",
  "./assets/musicas/vitoria.mp3"
];

// =========================
// INSTALL (CACHE SEGURO)
// =========================
self.addEventListener("install", (event) => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log("📦 Cache LudoChaos v6.1");

      for (const file of FILES) {
        try {
          await cache.add(file);
        } catch (err) {
          console.warn("⚠️ Falhou cache:", file);
        }
      }
    })
  );
});

// =========================
// ACTIVATE (limpa versões antigas)
// =========================
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );

  self.clients.claim();
});

// =========================
// FETCH (OFFLINE FIRST REAL)
// =========================
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // HTML (navegação)
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).catch(() => caches.match("./index.html"))
    );
    return;
  }

  // Assets (cache-first)
  event.respondWith(
    caches.match(req).then((cached) => {
      return (
        cached ||
        fetch(req).catch(() => cached || caches.match("./index.html"))
      );
    })
  );
});

// =========================
// BACKGROUND SYNC
// =========================
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-game-data") {
    event.waitUntil(syncGameData());
  }
});

async function syncGameData() {
  console.log("🔄 Sync LudoChaos v6.1 executado");
}

// =========================
// PUSH NOTIFICATIONS
// =========================
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.text() : "Atualização no LudoChaos";

  event.waitUntil(
    self.registration.showNotification("LudoChaos", {
      body: data,
      icon: "./assets/imagem/logo192.png"
    })
  );
});
