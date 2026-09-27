/**
 * VB App – felhő szinkron (Google Apps Script)
 *
 * Beállítás (egyszer, kb. 3 perc):
 *  1. Nyisd meg: https://script.google.com  →  "Új projekt"
 *  2. Töröld ki a benne lévő kódot, és másold be ezt az egész fájlt. Mentés (Ctrl+S).
 *  3. Jobb felül: "Telepítés" → "Új telepítés"
 *       - Típus (fogaskerék): "Webes alkalmazás"
 *       - Végrehajtás mint: "Én"
 *       - Hozzáférés: "Bárki"
 *     → "Telepítés", majd engedélyezd a hozzáférést a Google-fiókodhoz.
 *  4. Másold ki a kapott "Webes alkalmazás" URL-t (https://script.google.com/macros/s/.../exec).
 *  5. Az appban: ⚙️ → ☁️ Felhő szinkron → illeszd be az URL-t.
 *     Ugyanezt az URL-t add meg a többi eszközön (telefon, gép) is.
 *
 * Az adatok egy "vb-app-adatok.json" fájlba kerülnek a Google Drive-odra.
 * Az URL-t ne oszd meg senkivel: aki ismeri, látja és módosíthatja az adataidat.
 */

const FILE_NAME = 'vb-app-adatok.json';

function getFile_() {
  const it = DriveApp.getFilesByName(FILE_NAME);
  return it.hasNext() ? it.next() : DriveApp.createFile(FILE_NAME, '{"updated":0}', 'application/json');
}

function doGet() {
  return ContentService.createTextOutput(getFile_().getBlob().getDataAsString())
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const incoming = JSON.parse(e.postData.contents);
    const file = getFile_();
    const current = JSON.parse(file.getBlob().getDataAsString() || '{"updated":0}');
    // csak az újabb adat írhatja felül a régit
    if ((incoming.updated || 0) >= (current.updated || 0)) file.setContent(JSON.stringify(incoming));
    return ContentService.createTextOutput('{"ok":true}').setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
