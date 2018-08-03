//this is the clientside JS which is paired with goGetEmail.gs. This script needs to be edited and converted to a bookmarklet. 
//remove all of the comments before processing as a bookmarklet. comments will break your bookmarklet code.

var yourAppsScriptWebAppLink = 'https://script.google.com/macros/s/REPLACEthis-withYOUR-googleAppsWebAppID/exec';

var url = window.location.href; //get the current URL on screen

if(/github/.test(url) === true){ //if it is a github url

  var url = /^.+?github\.com\/.+?(?:\/|$)/.exec(window.location.href).toString(); //extract the user path
  xwindow.open(yourAppsScriptWebAppLink+'?out='+url);

}else{
	alert('you do not appear to be on a github profile.\ntry again by navigating to the profile for which you wish to find an email');
}
