/* Worker entry for the Card Scanner's on-device OCR. Artifacts can't serve .gz files, so the
   English model is published as eng-traineddata.wasm; this maps Tesseract's request onto it. */
var realFetch = self.fetch.bind(self);
self.fetch = function (url, opts) {
  if (typeof url === "string" && /\/eng\.traineddata(\.gz)?$/.test(url)) url = url.replace(/eng\.traineddata(\.gz)?$/, "eng-traineddata.wasm");
  return realFetch(url, opts);
};
importScripts("worker.min.js");
