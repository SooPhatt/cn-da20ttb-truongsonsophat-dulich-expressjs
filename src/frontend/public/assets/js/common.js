const serverPort = "8080";
const urlServer = 'http://localhost:' + serverPort + '/';

/**
 * @description Get du lieu tu server (phuong thuc GET)
 * @author SoPhat.Truong
 * @date 11/11/2023
 * @param {object} params Params truyen xuong server
 * @param {function} callback Ham tra ve
 */
function apiGetData(url, params, callback) {
    axios({
        method: 'get',
        url: urlServer + url,
        params: params
    })
        .then(function (response) {
          callback(response.data);
    });
}

/**
 * @description Get du lieu tu server (phuong thuc POST)
 * @author SoPhat.Truong
 * @date 11/11/2023
 * @param {function} callback Ham tra ve
 */
function apiPostData(url, params, callback) {
    axios({
        method: 'post',
        url: urlServer + url,
        data: params
    })
        .then(function (response) {
            callback(response.data);
    });
}


/**
 * @description Get du lieu tu server (phuong thuc POST)
 * @author SoPhat.Truong
 * @date 11/11/2023
 * @param {function} callback Ham tra ve
 */
function apiPostUploadFile(url, file, callback) {
    var bodyFormData = new FormData();
    bodyFormData.append('myFile', file);

    axios({
        method: 'post',
        url: urlServer + url,
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" },
    })
        .then(function (response) {
            callback(response.data);
    });
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
  
function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
  
function checkCookie() {
    let user = getCookie("username");
    if (user != "") {
        alert("Welcome again " + user);
    } else {
        user = prompt("Please enter your name:", "");
        if (user != "" && user != null) {
        setCookie("username", user, 365);
        }
    }
}

function setInnerHTML(elm, html) {
    elm.innerHTML = html;
    
    Array.from(elm.querySelectorAll("script"))
      .forEach( oldScriptEl => {
        const newScriptEl = document.createElement("script");
        
        Array.from(oldScriptEl.attributes).forEach( attr => {
          newScriptEl.setAttribute(attr.name, attr.value) 
        });
        
        const scriptText = document.createTextNode(oldScriptEl.innerHTML);
        newScriptEl.appendChild(scriptText);
        
        oldScriptEl.parentNode.replaceChild(newScriptEl, oldScriptEl);
    });
}