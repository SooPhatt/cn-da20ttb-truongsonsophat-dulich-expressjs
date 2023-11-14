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
        url: 'http://localhost:8080/' + url,
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
function apiPostData(callback) {
    axios({
        method: 'get',
        url: 'http://localhost:8080/hello',
        data: {
            convat: "1"
        }
    })
        .then(function (response) {
          callback(response);
    });
}