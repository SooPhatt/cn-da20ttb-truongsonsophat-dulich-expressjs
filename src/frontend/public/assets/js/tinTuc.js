function khoiTaoTinTuc() {
    // Kiem tra dang nhap
    tinTucKiemTraDangNhap();
    // Lay danh sach tin tuc
    danhSachTinTuc();
}

// Kiem tra nguoi dung co dang nhap hay không
function tinTucKiemTraDangNhap() {
    // An/Hien nut them moi tin tuc
    if(typeof(UserInfo.tenQuyen) != "undefined") {
        document.getElementById("btnTinTucThemMoi").classList.remove("d-none");
    } else {
        document.getElementById("btnTinTucThemMoi").classList.add("d-none");
    }
}

// Add the following code if you want the name of the file appear on select
$("#txtTMTT_HinhAnh.custom-file-input").on("change", function() {
    var fileName = $(this).val().split("\\").pop();
    $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
});

// Lay danh sach tin tuc
function danhSachTinTuc() {
    apiGetData(API_CALL.DANH_SACH_TIN_TUC, {}, function(data) {
        // Xoa tat ca tin tuc cu
        let danhsachTinTuc = document.getElementById("danhsachTinTuc");
        danhsachTinTuc.innerHTML = "";
        if(data.status && data.data.length > 0) {
            const danhSachTinTuc = data.data;
            // Clone tao tin tuc
            let mauTinTuc = document.getElementById("mauTinTuc");
            for(let i = 0; i < danhSachTinTuc.length; i++) {
                let tinTuc = mauTinTuc.cloneNode(true);
                tinTuc.removeAttribute("id");
                // Bo an
                tinTuc.classList.remove("d-none");
                // Map thong tin tin tuc
                tinTuc.querySelector(".lblTenTinTuc").textContent = danhSachTinTuc[i].tenTinTuc;
                tinTuc.querySelector(".lblTomTatTinTuc").textContent = danhSachTinTuc[i].moTaNganGon;
                tinTuc.querySelector(".imgTinTicHinhAnh").src = "/uploads_tintuc/" + danhSachTinTuc[i].urlHinhAnh;
                // Hien thi nut xoa
                if(typeof(UserInfo.tenQuyen) != "undefined") {
                    // Button Xoa tin tuc
                    let btnXoaTinTuc = tinTuc.querySelector(".btnXoaTinTuc");
                    btnXoaTinTuc.classList.remove("d-none");
                    btnXoaTinTuc.setAttribute("idTinTuc", danhSachTinTuc[i].idTinTuc);
                    btnXoaTinTuc.addEventListener("click", function() {
                        bootbox.confirm({
                            title: 'Xóa Tin Tức',
                            message: 'Bạn có chắc chắn muốn xóa tin tức này?',
                            buttons: {
                                confirm: {
                                label: 'Đồng ý',
                                className: 'btn-danger'
                            },
                            cancel: {
                                label: 'Hủy',
                                className: 'btn-success'
                            }
                            },
                            callback: function (result) {
                                if(result) {
                                    xoaTinTuc(btnXoaTinTuc.getAttribute("idTinTuc"));
                                }
                            }
                        });
                    });
                    // Button Chinh sua tin tuc
                    let btnChinhSuaTinTuc = tinTuc.querySelector(".btnChinhSuaTinTuc");
                    btnChinhSuaTinTuc.classList.remove("d-none");
                    btnChinhSuaTinTuc.setAttribute("idTinTuc", danhSachTinTuc[i].idTinTuc);
                    btnChinhSuaTinTuc.addEventListener("click", function() {
                        chinhSuaTinTuc(danhSachTinTuc[i].idTinTuc);
                    });
                }
                danhsachTinTuc.append(tinTuc);
            }
        }
    });
}

// Xóa tin tức
function xoaTinTuc(idTinTuc) {
    const params = {
        "idTinTuc": idTinTuc
    }
    apiPostData(API_CALL.XOA_TIN_TUC, params, function(response) {
        if(response.status == true) {
            // Thong bao them moi thanh cong
            bootbox.alert({
                title: 'Xóa tin tức',
                message: 'Xóa thành công',
                size: 'small'
            });
            // Tải lại danh sách tin tuc
            danhSachTinTuc();
        } else {
            // Thong bao them moi thất bại
            bootbox.alert({
                title: 'Xóa tin tức',
                message: 'Xóa thất bại',
                size: 'small'
            });
        }
    });
}

//------------------------------------------------------------
// Them Moi Tin Tuc
document.getElementById("btnTinTucThemMoi").addEventListener("click", function() {
    // Xoa du lieu cu
    document.getElementById("lblTMTT_Title").textContent = "Thêm Mới Tin Tức";
    document.getElementById("txtTMTT_Ten").value = "";
    document.getElementById("txtTMTT_MoTaNganGon").value = "";
    document.querySelector("#modalThemMoiTinTuc .custom-file-label").textContent = "";
    // Hien button Them Moi
    document.getElementById("btnTMTT_Them").classList.remove("d-none");
    // An button Cap nhat
    document.getElementById("btnTMTT_CapNhat").classList.add("d-none");
});

// Xu ly them moi tin tuc
document.getElementById("btnTMTT_Them").addEventListener("click", function() {
    const tenTinTuc = document.getElementById("txtTMTT_Ten").value;
    const moTaNganGon = document.getElementById("txtTMTT_MoTaNganGon").value;
    const idNguoiDung = UserInfo.idNguoiDung;
    const txtTMTT_HinhAnh = document.getElementById("txtTMTT_HinhAnh");

    // Tải hình lên server
    apiPostUploadFile(API_CALL.UPLOAD_FILE, txtTMTT_HinhAnh.files[0], function(response) {
        const params = {
            "tenTinTuc": tenTinTuc,
            "moTaNganGon": moTaNganGon,
            "urlHinhAnh": response.filename,
            "idNguoiDung": idNguoiDung
        }
    
        apiPostData(API_CALL.THEM_MOI_TIN_TUC, params, function(response) {
            if(response.status == true) {
                // Dong modal them moi tin tuc
                $('#modalThemMoiTinTuc').modal('hide');
                // Thong bao them moi thanh cong
                bootbox.alert({
                    title: document.querySelector("#modalThemMoiTinTuc .modal-title").textContent,
                    message: 'Thêm mới thành công',
                    size: 'small'
                });
                // Tải lại danh sách tin tuc
                danhSachTinTuc();
            } else {
                // Thong bao them moi thất bại
                bootbox.alert({
                    title: document.querySelector("#modalThemMoiTinTuc .modal-title").textContent,
                    message: 'Thêm mới thất bại',
                    size: 'small'
                });
            }
        });
    });
});

//------------------------------------------------------------
// Chỉnh sửa tin tức
var tinTucUrlHinhAnh = null;
var tinTucIdNguoiDung = null;
var tinTucIdTinTuc = null;
function chinhSuaTinTuc(idTinTuc) {
    document.getElementById("lblTMTT_Title").textContent = "Chỉnh Sửa Tin Tức";
    document.getElementById("txtTMTT_Ten").value = "";
    document.getElementById("txtTMTT_MoTaNganGon").value = "";
    document.querySelector("#modalThemMoiTinTuc .custom-file-label").textContent = "";
    tinTucUrlHinhAnh = null;
    tinTucIdNguoiDung = null;
    tinTucIdTinTuc = null;
    // An button Them Moi
    document.getElementById("btnTMTT_Them").classList.add("d-none");
    // Hien button Cap nhat
    document.getElementById("btnTMTT_CapNhat").classList.remove("d-none");
    $("#modalThemMoiTinTuc").modal();

    // Lấy thông tin tin tức
    const params = {
        "idTinTuc": idTinTuc
    }
    apiGetData(API_CALL.THONG_TIN_TIN_TUC, params, function(response) {
        if(response.status == true && typeof(response.data) != "undefined") {
            // Maping thông tin tin tức
            tinTucIdTinTuc = response.data.idTinTuc;
            document.getElementById("txtTMTT_Ten").value = response.data.tenTinTuc;
            document.getElementById("txtTMTT_MoTaNganGon").value = response.data.moTaNganGon;
            tinTucUrlHinhAnh = response.data.urlHinhAnh;
            tinTucIdNguoiDung = response.data.idNguoiDung;
        } else {
            bootbox.alert({
                title: 'Lỗi',
                message: 'Không thể truy cập được tin thông tin tin tức',
                size: 'small'
            });
        }
    });
}

// Xu ly them moi tin tuc
document.getElementById("btnTMTT_CapNhat").addEventListener("click", function() {
    let idTinTuc = tinTucIdTinTuc;
    let tenTinTuc = document.getElementById("txtTMTT_Ten").value;
    let moTaNganGon = document.getElementById("txtTMTT_MoTaNganGon").value;
    let urlHinhAnh = tinTucUrlHinhAnh;
    let idNguoiDung = UserInfo.idNguoiDung;

    var capNhatTinTucFunc = function(idTinTuc, tenTinTuc, moTaNganGon, urlHinhAnh, idNguoiDung) {
        const params = {
            "idTinTuc": idTinTuc,
            "tenTinTuc": tenTinTuc,
            "moTaNganGon": moTaNganGon,
            "urlHinhAnh": urlHinhAnh,
            "idNguoiDung": idNguoiDung
        }
        apiPostData(API_CALL.CAP_NHAT_TIN_TUC, params, function(response) {
            if(response.status == true) {
                // Dong modal them moi tin tuc
                $('#modalThemMoiTinTuc').modal('hide');
                // Thong bao them moi thanh cong
                bootbox.alert({
                    title: 'Cập nhật tin tức',
                    message: 'Cập nhật tin tức thành công',
                    size: 'small'
                });
                // Tải lại danh sách tin tuc
                danhSachTinTuc();
            } else {
                // Thong bao them moi thất bại
                bootbox.alert({
                    title: 'Cập nhật tin tức',
                    message: 'Cập nhật tin tức thành công',
                    size: 'small'
                });
            }
        });
    }

    // Kiem tra anh co tải lên hay không?
    // Nếu có thì tải ảnh rồi cập nhật thông tin
    // Nếu không thì chỉ cập nhật thông tin
    const lblTenAnh = document.querySelector("#modalThemMoiTinTuc .custom-file-label").textContent;
    if(lblTenAnh != "") {
        const txtTMTT_HinhAnh = document.getElementById("txtTMTT_HinhAnh");
        // Tải hình lên server
        apiPostUploadFile(API_CALL.UPLOAD_FILE, txtTMTT_HinhAnh.files[0], function(response) {
            capNhatTinTucFunc(idTinTuc, tenTinTuc, moTaNganGon, response.filename, idNguoiDung);
        });
    } else {
        capNhatTinTucFunc(idTinTuc, tenTinTuc, moTaNganGon, urlHinhAnh, idNguoiDung);
    }
});