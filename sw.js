const CACHE='laminador-v2';
const LOCAL=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-maskable-512.png','./clipper.js'];
const EXT=['cdnjs.cloudflare.com','cdn.jsdelivr.net','unpkg.com','fonts.googleapis.com','fonts.gstatic.com'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.all(LOCAL.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==CACHE&&n!=='laminador-user').map(n=>caches.delete(n)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(u.origin===location.origin){
    if(r.mode==='navigate'){
      e.respondWith(fetch(r).then(x=>{const c=x.clone();caches.open(CACHE).then(h=>h.put('./index.html',c));return x}).catch(()=>caches.match('./index.html').then(m=>m||caches.match('./'))));
      return;
    }
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(x=>{if(x.ok){const c=x.clone();caches.open(CACHE).then(h=>h.put(r,c))}return x})));
    return;
  }
  if(EXT.includes(u.hostname)){
    // Librerías y fuentes externas: se guardan la primera vez con internet y luego funcionan offline
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(x=>{if(x.ok||x.type==='opaque'){const c=x.clone();caches.open(CACHE).then(h=>h.put(r,c))}return x})));
  }
});
