#!/usr/bin/env python3
"""Builds web/index.html (the Firebase-hosted Card Scanner) from src/card-scanner.html.

The claude.ai page stays the single source for the scanner UI, the on-device reader and the
Excel export. This script swaps the claude.ai runtime (window.claude capabilities) for Firebase:
Google sign-in, a team join code, Firestore for the shared list, and plain browser downloads.
Run it after editing src/card-scanner.html:  python3 tools/build-web.py
"""
import pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
src = (ROOT / "src/card-scanner.html").read_text()
s = src

def rep(old, new, count=1):
    global s
    n = s.count(old)
    if n != count:
        sys.exit(f"build-web: expected {count} match(es), found {n}:\n{old[:200]}")
    s = s.replace(old, new)

# ---- page chrome: gate (sign-in / join), account chip, team panel ----
rep('<div class="wrap" id="main">', '''<div class="wrap gate" id="gate">
  <header class="top"><div class="meta"><span class="eyebrow">Vacario · trade fair contacts</span><h1>Card Scanner</h1></div></header>
  <section class="capture" id="gateBox">
    <h2 id="gateTitle">Loading…</h2>
    <p class="muted" id="gateText"></p>
    <div id="gateSignin" hidden><button class="btn primary big" id="signinBtn" type="button">Sign in with Google</button></div>
    <form id="gateJoin" hidden class="tools">
      <div class="fld"><label for="joinCode">Team code</label><input id="joinCode" autocomplete="off" autocapitalize="characters" placeholder="e.g. FAIR-7K2Q"></div>
      <div class="btnrow"><button class="btn primary" id="joinBtn" type="submit">Join the team</button><button class="btn ghost" id="gateOut" type="button">Use another account</button></div>
    </form>
    <div class="notice crit" id="gateErr" hidden></div>
  </section>
</div>

<div class="wrap" id="main" hidden>''')
rep('''    <div class="tally" aria-live="polite">''', '''    <div class="acct"><span class="small muted" id="who"></span><button class="btn ghost small" id="signOut" type="button">Sign out</button></div>
    <div class="tally" aria-live="polite">''')
rep('''    <div class="panel">
      <h2>All emails</h2>''', '''    <div class="panel" id="teamPanel" hidden>
      <h2>Team access</h2>
      <p class="small muted">Anyone who signs in with Google and enters this code can scan, edit and export cards. Change the code to stop new people joining; people already in keep access.</p>
      <div class="fld"><label for="teamCode">Team code</label><input id="teamCode" autocomplete="off" autocapitalize="characters"></div>
      <div class="btnrow"><button class="btn" id="genCode" type="button">New random code</button><button class="btn primary" id="saveCode" type="button">Save code</button><button class="btn" id="copyInvite" type="button">Copy invite message</button></div>
      <p class="small muted" id="teamNote"></p>
    </div>
    <div class="panel">
      <h2>All emails</h2>''')
rep('''.toast{position:fixed;''', '''.gate{max-width:520px}
.gate .capture{gap:14px}
.acct{display:flex; align-items:center; gap:6px; width:100%; justify-content:flex-end; order:-1}
.btn.small{min-height:32px; padding:4px 8px; font-size:13px}
.toast{position:fixed;''')

# ---- runtime: Firebase instead of window.claude ----
rep('var db = null, sample = null, user = null, downloads = null;',
    'var db = null, sample = null, auth = null, me = null, unsubCards = null;\nvar ADMIN_EMAIL = "k.shrishant@gmail.com";\nvar TS = function(){ return firebase.firestore.FieldValue.serverTimestamp(); };')
rep('''function fmtDate(iso){ if(!iso) return ""; var d=new Date(iso);''',
    '''function fmtDate(iso){ if(!iso) return ""; var d=iso.toDate ? iso.toDate() : new Date(iso);''')
rep('''  d.scannedBy=S.uid||""; d.scannedAt=new Date().toISOString(); d.updatedAt=d.scannedAt;''',
    '''  d.scannedBy=S.uid||""; d.scannedByName=(me && me.displayName) || ""; d.scannedAt=TS(); d.updatedAt=TS(); d.updatedBy=S.uid||"";''')
rep('''    if(e && e.code==="quota_exceeded") throw new Error("The contact store is full. Delete test cards or export and start a new event.");
    if(e && e.code==="invalid_argument") throw new Error("You have view-only access, so new cards can't be saved. Ask the owner to make you a Contributor.");''',
    '''    if(e && e.code==="resource-exhausted") throw new Error("Today's free database limit is used up. Try again tomorrow, or upgrade the Firebase plan.");
    if(e && e.code==="permission-denied") throw new Error("The card was refused by the server. Check the fields (very long text?) or sign in again.");''')
rep('''  db.collection(COLL).orderBy("scannedAt","desc").limit(1000).onSnapshot(function(snap){
    S.cards = snap.docs.map(function(d){ var o=Object.assign({}, d.data()); o.id=d.id; return o; });''',
    '''  if(unsubCards) unsubCards();
  unsubCards = db.collection(COLL).orderBy("scannedAt","desc").limit(1000).onSnapshot(function(snap){
    S.cards = snap.docs.map(function(d){ var o=Object.assign({}, d.data({serverTimestamps:"estimate"})); o.id=d.id; return o; });''')
rep('''    $("dbNotice").textContent = e && e.code==="revoked" ? "Your access to this contact list changed. Reload the page." : "Lost the connection to the shared contact list. Reload the page.";''',
    '''    $("dbNotice").textContent = e && e.code==="permission-denied" ? "You're not on the team for this list. Sign out and join with the team code." : "Lost the connection to the shared contact list. Reload the page.";''')
# edits merge only what the form changed, so the creation fields are never rewritten
rep('''    var d=Object.assign({}, c); delete d.id;
    Object.assign(d, v, {checked:true, unsure:[], updatedAt:new Date().toISOString()});
    if(pendingBack) d.thumbBack=pendingBack;
    var ref=db.collection(COLL).doc(S.editing);
    p=withRetry(function(){ return ref.set(d); });''',
    '''    var d=Object.assign({}, v, {checked:true, unsure:[], updatedAt:TS(), updatedBy:S.uid});
    if(pendingBack) d.thumbBack=pendingBack;
    var ref=db.collection(COLL).doc(S.editing);
    p=withRetry(function(){ return ref.update(d); });''')
rep('''function saveFile(name, blob){
  if(!downloads){ toast("Downloads are not available in this view. Open the page on claude.ai or in the Claude app."); return; }
  downloads.save({filename:name, data:blob}).then(function(r){
    toast(r && r.status==="delivered" ? name+" sent." : "Saved "+name);
  }, function(e){
    var c=e && e.code;
    toast(c==="declined" ? "Download cancelled." : c==="rate_limited" ? "A save prompt is already open." : "Could not save the file here ("+(c||"error")+").");
  });
}''', '''function saveFile(name, blob){
  try{
    var url=URL.createObjectURL(blob), a=document.createElement("a");
    a.href=url; a.download=name; a.rel="noopener"; document.body.appendChild(a); a.click();
    setTimeout(function(){ a.remove(); URL.revokeObjectURL(url); },2000);
    toast("Downloading "+name);
  }catch(e){ toast("Could not start the download in this browser."); }
}''')
rep('''    n.textContent="Cards are read on this device, because this browser doesn't offer Claude reading. Emails, phones and websites come through well; check names, titles and companies against the photo before saving. Where Claude reading is available, the page uses it automatically."; }''',
    '''    n.textContent="Cards are read on this phone. Emails, phones and websites come through well; check names, titles and companies against the photo before saving."; }''')

# names come from the card itself (scannedByName), not a profile lookup
start = s.index("var nameTick=0;\nfunction resolveNames(){")
end = s.index("render();\n\n/* ---------- capabilities ---------- */")
s = s[:start] + '''function resolveNames(){
  S.cards.forEach(function(c){ if(c.scannedBy) S.names[c.scannedBy] = (c.scannedByName || "Teammate") + (c.scannedBy===S.uid ? " (you)" : ""); });
}

''' + s[end:]

start = s.index("/* ---------- capabilities ---------- */")
end = s.index("})();\n</script>")
s = s[:start] + r'''/* ---------- Firebase: sign-in, team membership, shared list ---------- */
function gate(mode, title, text){
  $("main").hidden=true; $("gate").hidden=false;
  $("gateTitle").textContent=title; $("gateText").textContent=text||"";
  $("gateSignin").hidden = mode!=="signin"; $("gateJoin").hidden = mode!=="join"; $("gateErr").hidden=true;
}
function gateErr(t){ var e=$("gateErr"); e.hidden=!t; e.textContent=t||""; }
function isAdmin(){ return !!(me && me.emailVerified && String(me.email||"").toLowerCase()===ADMIN_EMAIL); }
function authErr(e){
  var c=e && e.code;
  if(c==="auth/unauthorized-domain") return "This web address isn't allowed to sign in yet. Add it under Authentication → Settings → Authorized domains in the Firebase console.";
  if(c==="auth/operation-not-allowed" || c==="auth/configuration-not-found") return "Google sign-in isn't switched on for this project yet. Turn it on under Authentication → Sign-in method.";
  if(c==="auth/network-request-failed") return "No connection. Check your internet and try again.";
  if(c==="auth/popup-closed-by-user" || c==="auth/cancelled-popup-request") return "";
  return "Sign-in failed"+(c?" ("+c+")":"")+". Try again.";
}
function enterApp(){
  $("gate").hidden=true; $("main").hidden=false;
  $("who").textContent=(me.displayName||me.email||"")+(isAdmin()?" · admin":"");
  $("teamPanel").hidden=!isAdmin();
  if(isAdmin()) loadTeamCode();
  startDb(); render();
}
function checkMember(){
  gate("wait","Checking your access…","");
  if(isAdmin()){ enterApp(); return; }
  db.doc("members/"+me.uid).get().then(function(snap){
    if(snap.exists) enterApp();
    else gate("join","Join the team","Signed in as "+(me.email||me.displayName)+". Enter the team code you were given with the link.");
  }, function(){ gate("join","Join the team","Enter the team code you were given with the link."); });
}
$("signinBtn").addEventListener("click",function(){
  var p=new firebase.auth.GoogleAuthProvider(); p.setCustomParameters({prompt:"select_account"});
  gateErr("");
  auth.signInWithPopup(p).catch(function(e){
    if(e && (e.code==="auth/popup-blocked" || e.code==="auth/operation-not-supported-in-this-environment")) return auth.signInWithRedirect(p);
    gateErr(authErr(e));
  });
});
$("gateJoin").addEventListener("submit",function(e){
  e.preventDefault();
  var code=str($("joinCode").value).toUpperCase(); if(!code){ gateErr("Enter the team code."); return; }
  $("joinBtn").disabled=true; gateErr("");
  db.doc("members/"+me.uid).set({code:code, email:me.email||"", name:me.displayName||"", joinedAt:TS()})
    .then(enterApp, function(err){ gateErr(err && err.code==="permission-denied" ? "That code doesn't match. Check it with the person who shared the link." : "Could not join right now. Check your connection and try again."); })
    .then(function(){ $("joinBtn").disabled=false; });
});
function signOut(){ if(unsubCards){ unsubCards(); unsubCards=null; } S.cards=[]; auth.signOut(); }
$("signOut").addEventListener("click",signOut);
$("gateOut").addEventListener("click",signOut);

function randomCode(){ var a="ABCDEFGHJKLMNPQRSTUVWXYZ23456789", s=""; var r=new Uint32Array(8); crypto.getRandomValues(r); for(var i=0;i<8;i++){ s+=a[r[i]%a.length]; if(i===3) s+="-"; } return s; }
function loadTeamCode(){
  db.doc("settings/team").get().then(function(snap){
    var c = snap.exists ? str(snap.data().code) : "";
    $("teamCode").value=c;
    $("teamNote").textContent = c ? "" : "No code set yet, so nobody else can join. Set one, then share the link and the code.";
  }, function(){ $("teamNote").textContent="Couldn't load the team code."; });
}
$("genCode").addEventListener("click",function(){ $("teamCode").value=randomCode(); $("teamNote").textContent="Not saved yet."; });
$("saveCode").addEventListener("click",function(){
  var c=str($("teamCode").value).toUpperCase();
  if(c.length<6){ $("teamNote").textContent="Use at least 6 characters, or tap New random code."; return; }
  db.doc("settings/team").set({code:c, updatedAt:TS()}).then(function(){ $("teamCode").value=c; $("teamNote").textContent="Saved. New people can join with "+c+"."; },
    function(){ $("teamNote").textContent="Couldn't save the code. Only the admin account can change it."; });
});
$("copyInvite").addEventListener("click",function(){
  var c=str($("teamCode").value).toUpperCase();
  var t="Scan trade-fair visiting cards into our shared contact list:\n"+location.origin+"\nSign in with Google, then enter team code: "+c;
  if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(function(){ toast("Invite copied."); }, function(){ toast(t); });
  else toast(t);
});

gate("wait","Loading…","");
fetch("/__/firebase/init.json").then(function(r){ if(!r.ok) throw new Error("config"); return r.json(); }).then(function(cfg){
  firebase.initializeApp(cfg);
  auth=firebase.auth(); db=firebase.firestore();
  if(location.hostname==="localhost" || location.hostname==="127.0.0.1"){
    /* local testing against the Firebase emulators (firebase emulators:start) */
    auth.useEmulator("http://"+location.hostname+":9099", {disableWarnings:true}); db.useEmulator(location.hostname, 8080);
  }
  /* keep working on patchy trade-fair wifi: cards queue on the phone and sync later */
  db.enablePersistence({synchronizeTabs:true}).catch(function(){});
  setEngine("device");
  auth.getRedirectResult().catch(function(e){ gateErr(authErr(e)); });
  auth.onAuthStateChanged(function(u){
    me=u;
    if(!u){ S.uid=null; gate("signin","Sign in to start scanning","Use your Google account. Everyone on the team sees and adds to the same contact list."); return; }
    S.uid=u.uid; checkMember();
  });
}, function(){
  gate("error","This page can't start here","Open the deployed web address (….web.app). The app reads its Firebase settings from there.");
});

''' + s[end:]

# full document: the claude.ai publish wraps the fragment; Hosting serves it as-is
head = '''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#0e5b5e">
<meta name="description" content="Scan trade-fair visiting cards into a shared contact list and export it to Excel.">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/icon-192.png">
<style>:root{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;font:14px system-ui,sans-serif}img{max-width:100%}[hidden]{display:none!important}</style>
<script src="https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.14.1/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore-compat.js"></script>
</head>
<body>
'''
s = head + s + "\n</body>\n</html>\n"
rep('function ocrBase(){ return new URL("ocr/", location.href).href; }', 'function ocrBase(){ return location.origin + "/ocr/"; }')
(ROOT / "web/index.html").write_text(s)
print("built web/index.html", len(s), "bytes")
