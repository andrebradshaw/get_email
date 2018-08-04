/*/ 

INSTALL GUIDE: https://youtu.be/_k7VIKJ9CNA

/*/

function grouped(e, n){ //this function takes two parameters, a regular expression with a group (must have a group or will fail), and a number to assign which group number to match
  if(e != null){ //if the regex gets a match
    return e[n].toString(); //return the requested group match as a string
  }else{
    return ''; //if no match, return as an empty string
  }
}

function soFetch(path){ //this function takes a URL and fetches the HTML. 
  var opt = {"method": "GET"};
  var resp = UrlFetchApp.fetch(path, opt);
  return resp.toString().replace(/\n|\r/g, ''); //we then convert that HTML object to a string and flatten it to a one-liner by removing newlines and carriage returns
}

function getEmail(path){ //this function takes a github repository URL path and merges it to the URL path we need to check commits (where the email is shown)
  var url = 'https://github.com'+path+'/commit/master.patch'; 
  var resp = soFetch(url);
  var email = /\b\w+\S*\w+@\w+\S*\w*\.[a-zA-Z]{2,3}\b/.exec(resp); //extract the email from the response
  return email;
}

//this is the main function
function doGet(a){ //this function takes JSONP data from a http request. the JSONP data is a github profile URL.
  var resp = soFetch(a.parameter.out); //here we fetch the HTML from the profile URL
  var user = grouped(/\.com\/(.+)/.exec(a.parameter.out), 1); //extract the profile path
  var repo = grouped(/pinned-repo-item-content">.+?href="(.+?)"/.exec(resp), 1); //extract the path of the first repository. We need this path because we extract the email adddress from repository commits
  
  if(repo != ''){ //if a repository exists
    var email = getEmail(repo); //fetch the email with another function
    return ContentService.createTextOutput('hey! lookie here. we found an email for '+user+'\n'+email); //and return the email to the client. 
  }else{
    return ContentService.createTextOutput('sorry. no email on this one. This person probably has no public repos'); 
  }

}


