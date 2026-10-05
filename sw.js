var C="bromelia-v5",A=["./","./index.html","./manifest.webmanifest","./icon.svg","./icon-192.png","./icon-512.png"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(C).then(function(c){return c.addAll(A)}).then(function(){return self.skipWaiting()}))});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==C}).map(function(x){return caches.delete(x)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener("fetch",function(e){
 if(e.request.method!=="GET")return;
 var req=e.request;
 var ehHTML=req.mode==="navigate"||(req.headers.get("accept")||"").indexOf("text/html")>-1;
 if(ehHTML){
  e.respondWith(
   fetch(req).then(function(r){
    var cp=r.clone();
    caches.open(C).then(function(c){c.put(req,cp)});
    return r;
   }).catch(function(){
    return caches.match(req).then(function(r){return r||caches.match("./index.html")});
   })
  );
  return;
 }
 e.respondWith(caches.match(req,{ignoreSearch:true}).then(function(r){return r||fetch(req).catch(function(){return caches.match("./index.html")})}));
});