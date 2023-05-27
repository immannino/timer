self.addEventListener("install",function(e){e.waitUntil(caches.open("pwa").then(function(e){return e.addAll(["/"])}))}),self.addEventListener("fetch",function(e){console.log(e.request.url),e.respondWith(caches.match(e.request).then(function(t){return t||fetch(e.request)}))});
//# sourceMappingURL=serviceworker.js.map
