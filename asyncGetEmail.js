var reg = (elm, n) => elm != null ? elm[n] : '';
var cn = (ob, nm) => ob.getElementsByClassName(nm);
var tn = (ob, nm) => ob.getElementsByTagName(nm);
var nm = (ob, nm) => ob.getElementsByName(nm);

async function getMainPage(page) {
  var res = await fetch(page, {
    "credentials": "include",
    "headers": {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
      "accept-language": "en-US,en;q=0.9",
      "if-none-match": "W/\"3f81f7bbf6a2f4f4ab456135ffc7bb13\"",
      "upgrade-insecure-requests": "1"
    },
    "referrerPolicy": "no-referrer-when-downgrade",
    "body": null,
    "method": "GET",
    "mode": "cors"
  });
  var html = await res.text();
  var doc = new DOMParser().parseFromString(html, "text/html");
  var topRepos = Array.from(cn(doc, "pinned-item-list-item p-3 mb-3 border border-gray-dark rounded-1 public source")).map(itm => tn(itm, 'a')[0].href + '/commit/master.patch');
  for (i = 0; i < topRepos.length; i++) {
    var email = await getPatches(topRepos[i]);
    if (email != '') {
      return email;
    }
  }

}

async function getPatches(link) {
  var res = await fetch(link, {
    "credentials": "include",
    "headers": {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
      "accept-language": "en-US,en;q=0.9",
      "if-none-match": "W/\"3f81f7bbf6a2f4f4ab456135ffc7bb13\"",
      "upgrade-insecure-requests": "1"
    },
    "referrerPolicy": "no-referrer-when-downgrade",
    "body": null,
    "method": "GET",
    "mode": "cors"
  });
  var html = await res.text();
  var email = reg(/[\w|\.]+@\S+\.[a-zA-Z]+/.exec(html), 0);
  return email;
}
async function showEmail() {
  var url = reg(/^.+?github\.com\/.+?(?:\/|$)/.exec(window.location.href), 0);
  var email = await getMainPage(url);

  var cDiv = document.createElement("div");
  cDiv.setAttribute("id", "pop_container");
  document.body.appendChild(cDiv);
  cDiv.style.display = "inline-block";
  cDiv.style.position = "fixed";
  cDiv.style.top = "100px";
  cDiv.style.left = "50%";
  cDiv.style.width = "20%";
  cDiv.style.height = "10%";
  cDiv.style.border = "1px solid Transparent";
  cDiv.style.background = "Transparent";
  cDiv.style.padding = "3px";
  cDiv.style.zIndex = "10000";

  var clsBtn = document.createElement("button");
  cDiv.appendChild(clsBtn);
  clsBtn.setAttribute("id", "btn_close");
  document.getElementById("btn_close").innerText = "+";
  clsBtn.style.position = "absolute";
  clsBtn.style.background = "transparent";
  clsBtn.style.height = "0px";
  clsBtn.style.width = "0px";
  clsBtn.style.display = "inline-block";
  clsBtn.style.transform = "scale(3.9, 3.9) translate(0px, -15px) rotate(45deg)";
  clsBtn.style.borderRadius = "3em";
  clsBtn.style.padding = "0px";
  clsBtn.style.boxShadow = "0px";
  clsBtn.style.border = "0px";
  clsBtn.style.cursor = "pointer";
  clsBtn.style.userSelect = "none";
  clsBtn.style.fontWeight = "bold";
  clsBtn.style.color = "Crimson";
  clsBtn.addEventListener("click", close_s);

  var textbox_1 = document.createElement("textarea");
  textbox_1.setAttribute("id", "textbox_code");
  textbox_1.setAttribute("placeholder", "copy/paste skills list here");
  cDiv.appendChild(textbox_1);
  textbox_1.style.width = "100%";
  textbox_1.style.height = "100%";
  textbox_1.style.padding = "6px";
  textbox_1.style.border = "1px solid #293242";
  textbox_1.style.color = "#2b3442";
  textbox_1.value = email;
  textbox_1.select();
  document.execCommand("copy");

  function close_s() {
    document.body.removeChild(document.getElementById("pop_container"));
  }

}

showEmail()
