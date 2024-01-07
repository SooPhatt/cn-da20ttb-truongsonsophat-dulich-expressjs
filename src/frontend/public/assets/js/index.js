$(document).ready(function(){
    loadPage("trangChu");
});

// Xu ly su kien khi nguoi bam Tab Menu
document.querySelectorAll("#tabIndex .nav-item").forEach(function(el) {
    el.addEventListener("click", function() {
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
    let pannelPage = document.querySelector(".page .tab-pane[data-page='" + page + "']");
    if(pannelPage.getAttribute("data-loaded") + "" != "true") {
        apiGetData("loadPage", { pageName: page }, function(data) {
            // Map du lieu vao the "page"
            document.querySelectorAll(".page .tab-pane").forEach(function(el) { el.classList.remove("active"); });
            let pannelPage = document.querySelector(".page .tab-pane[data-page='" + page + "']");
            pannelPage.classList.add("active");
            // pannelPage.innerHTML = data.data;
            $(".page .tab-pane[data-page='" + page + "']").html(data.data);
            // setInnerHTML(pannelPage, data.data);
            pannelPage.setAttribute("data-loaded", true);
            afterLoadPage(page);
        });
    } else {
        document.querySelectorAll(".page .tab-pane").forEach(function(el) { el.classList.remove("active"); });
        let pannelPage = document.querySelector(".page .tab-pane[data-page='" + page + "']");
        pannelPage.classList.add("active");
        afterLoadPage(page);
    }
}

// Xu ly sau khi load page thanh cong
function afterLoadPage(page) {
    switch(page) {
        case "tinTuc":
            // Khoi tao du lieu tin tuc
            khoiTaoTinTuc();
            break;
        case "hinhAnh":
            // Khoi tao hinh anh
            khoiTaoHinhAnh();
            break;
        case "videos":
            // Khoi tao video
            khoiTaoVideo();
            break;
        case "qlUser":
            // Khoi tao QL User
            khoiTaoQlUser();
            break;
    }
}
