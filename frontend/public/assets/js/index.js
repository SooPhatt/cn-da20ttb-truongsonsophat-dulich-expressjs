$(document).ready(function(){
});

// Xu ly su kien khi nguoi bam Tab Menu
document.querySelectorAll("#tabIndex .nav-item").forEach(function(el) {
    el.addEventListener("click", function() {
        console.log(this);
        // Remove cac tab dang active
        document.querySelectorAll("#tabIndex .nav-item a").forEach(function(tab) {
            tab.classList.remove("active");
        });
        // Them class "active" cho tab duoc click
        this.querySelector("a").classList.add("active");
        // Xu ly load page
        const pageName = this.getAttribute("data-page");
        loadPage(pageName);
    });
});
// Load HTML page va map du lieu
function loadPage(page) {
    console.log("🚀 ~ file: index.js:22 ~ loadPage ~ page:", page)
    apiGetData("loadPage", { pageName: page }, function(data) {
        console.log("🚀 ~ file: index.js:24 ~ apiGetData ~ data:", data) 
        // Map du lieu vao the "page"
        document.querySelector(".page").innerHTML = data.data;
    });
}
