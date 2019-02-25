var credentialObject = {
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
};

async function getProfile(url) {
  var res = await fetch(url + '?tab=repositories', credentialObject);
  var text = await res.text();
  var doc = new DOMParser().parseFromString(text, 'text/html');
  var repos = doc.getElementsByClassName('col-12 d-flex width-full py-4 border-bottom public source');
  var targetRepos = Array.from(repos).map(itm => itm.getElementsByTagName('a')[0].href + '/commit/master.patch');
  return checkEmailPatch(targetRepos);
}

async function getPatches(link) {
  var res = await fetch(link, credentialObject);
  var html = await res.text();
  var email = /[\w|\.]+@\S+\.[a-zA-Z]+/.exec(html)[0];
  return email;
}

async function checkEmailPatch(repos){
  for (i = 0; i < repos.length; i++) {
    var email = await getPatches(repos[i]);
    if (email != '') {
      return email;
    }
  }
}
function loadingElm() {
  var loaD = document.createElement("div");
  loaD.setAttribute("id", "loader-elm");
  document.body.appendChild(loaD);
  loaD.style.top = '6%';
  loaD.style.left = '50%';
  loaD.style.position = "fixed";
  loaD.style.zIndex = "10001";
  loaD.innerHTML = '<svg version="1.1" id="Layer_1" x="0px" y="0px"     width="200px" height="200px" viewBox="0 0 24 30" style="enable-background:new 0 0 50 50;">    <rect x="0" y="10" width="4" height="0" fill="#333" opacity="0.2">      <animate attributeName="opacity" values="0.2; 1; .2" begin="0s" dur="555ms" repeatCount="indefinite" />      <animate attributeName="height" values="10; 20; 10" begin="0s" dur="555ms" repeatCount="indefinite" />      <animate attributeName="y"values="10; 5; 10" begin="0s" dur="555ms" repeatCount="indefinite" />    </rect>    <rect x="8" y="10" width="4" height="10" fill="#333"  opacity="0.2">      <animate attributeName="opacity" values="0.2; 1; .2" begin="0.15s" dur="555ms" repeatCount="indefinite" />      <animate attributeName="height" values="10; 20; 10" begin="0.15s" dur="555ms" repeatCount="indefinite" />      <animate attributeName="y" values="10; 5; 10" begin="0.15s" dur="555ms" repeatCount="indefinite" />    </rect>    <rect x="16" y="10" width="4" height="10" fill="#333"  opacity="0.2">      <animate attributeName="opacity" values="0.2; 1; .2" begin="0.3s" dur="555ms" repeatCount="indefinite" />      <animate attributeName="height" values="10; 20; 10" begin="0.3s" dur="555ms" repeatCount="indefinite" />      <animate attributeName="y" values="10; 5; 10" begin="0.3s" dur="555ms" repeatCount="indefinite" />    </rect>  </svg>';
}

loadingElm();

function killLoader() {
  document.body.removeChild(document.getElementById("loader-elm"));
}

var profile = /^.+?github\.c\om\/.+?(?=\/|\?|$)/.exec(window.location.href)[0];

async function showEmail() {
  var email = await getProfile(profile);
  if (document.getElementById("pop_container")) close_s();

  killLoader();

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

  if (/@/.test(email) && /users.noreply.github.com/.test(email) === false) {
    var linkBtn = document.createElement("button");
    cDiv.appendChild(linkBtn);
    linkBtn.setAttribute("id", "btn_link");
    linkBtn.innerText = "Search LinkedIn";
    linkBtn.style.width = "100%";
    linkBtn.style.transform = "translate(0%, -102%)";
    linkBtn.style.position = "absolute";
    linkBtn.style.background = "#0b868e";
    linkBtn.style.color = "white";
    linkBtn.style.display = "inline-block";
    linkBtn.style.borderRadius = ".2em";
    linkBtn.style.border = "1px solid white";
    linkBtn.addEventListener("click", checkLinkedIn);
    linkBtn.addEventListener("mouseover", hoverin);
    linkBtn.addEventListener("mouseout", hoverout);

    function checkLinkedIn() {
      window.open('https://www.linkedin.com/sales/gmail/profile/proxy/' + email);
    }
  }

  var textbox_1 = document.createElement("textarea");
  textbox_1.setAttribute("id", "textbox_code");
  textbox_1.setAttribute("placeholder", "copy/paste skills list here");
  cDiv.appendChild(textbox_1);
  textbox_1.style.width = "102%";
  textbox_1.style.height = "100%";
  textbox_1.style.padding = "6px";
  textbox_1.style.border = "1px solid #293242";
  textbox_1.style.color = "#2b3442";
  textbox_1.style.borderRadius = ".2em";
  textbox_1.value = /@/.test(email) && /users.noreply.github.com/.test(email) === false ? email : 'no email found';;

  if (/@/.test(email) && /users.noreply.github.com/.test(email) === false) {
    textbox_1.select();
    document.execCommand("copy");
  }

}
function hoverin() {
  this.style.transform = "scale(1.05, 1.05) translate(0%, -102%)";
  this.style.background = '#2896a0';
  this.style.transition = 'all 193ms';
}

function hoverout() {
  this.style.transform = "scale(1, 1) translate(0%, -102%)";
  this.style.background = '#0b868e';
  this.style.transition = 'all 193ms';
}

function close_s() {
  document.body.removeChild(document.getElementById("pop_container"));
}

showEmail();
