function khoiTaoHinhAnh() {
    // Kiem tra dang nhap
    hinhAnhKiemTraDangNhap();
    // Lay danh sach album anh
    danhSachAlbumAnh();
}

// Kiem tra nguoi dung co dang nhap hay không
function hinhAnhKiemTraDangNhap() {
    // An/Hien nut them moi tin tuc
    if(typeof(UserInfo.tenQuyen) != "undefined") {
        document.getElementById("btnAlbumAnhThemMoi").classList.remove("d-none");
        document.getElementById("btnHinhAnhThemMoi").classList.remove("d-none");
    } else {
        document.getElementById("btnAlbumAnhThemMoi").classList.add("d-none");
        document.getElementById("btnHinhAnhThemMoi").classList.add("d-none");
    }
}

// Lay danh sach album anh
function danhSachAlbumAnh() {
    // hiện pannel album ảnh
    document.getElementById("pannelAlbumAnh").classList.remove("d-none");
    // ẩn pannel hình ảnh
    document.getElementById("pannelHinhAnh").classList.add("d-none");

    apiGetData(API_CALL.DANH_SACH_ALBUM_ANH, {}, function(data) {
        // Xoa tat ca album cu
        let danhSachAlbum = document.getElementById("danhSachAlbum");
        danhSachAlbum.innerHTML = "";
        // Xoa danh sach anh trong thu vien
        let lstThuVienHinh = document.getElementById("lstThuVienHinh");
        lstThuVienHinh.innerHTML = "";
        if(data.status && data.data.length > 0) {
            const danhSach = data.data;
            // Clone tao tin tuc
            let mauAlbumAnh = document.getElementById("mauAlbumAnh");
            for(let i = 0; i < danhSach.length; i++) {
                let albumAnh = mauAlbumAnh.cloneNode(true);
                albumAnh.removeAttribute("id");
                // Bo an
                albumAnh.classList.remove("d-none");
                // Map thong tin tin tuc
                albumAnh.querySelector(".lblAlbumAnhTen").textContent = danhSach[i].tenAlbumAnh;
                albumAnh.querySelector(".imgAlbumAnh").src = "/uploads_tintuc/" + danhSach[i].urlHinhAnh;
                // Hien thi nut xoa
                if(typeof(UserInfo.tenQuyen) != "undefined") {
                    // Button Xoa tin tuc
                    let btnXoa = albumAnh.querySelector(".btnXoaAlbum");
                    btnXoa.classList.remove("d-none");
                    btnXoa.setAttribute("idAlbumAnh", danhSach[i].idAlbumAnh);
                    btnXoa.addEventListener("click", function() {
                        bootbox.confirm({
                            title: 'Xóa Album Ảnh',
                            message: 'Bạn có chắc chắn muốn xóa album ảnh này?',
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
                                    xoaAlbumAnh(btnXoa.getAttribute("idAlbumAnh"));
                                }
                            }
                        });
                    });
                    // Button Chinh sua tin tuc
                    let btnChinhSua = albumAnh.querySelector(".btnChinhSuaAlbum");
                    btnChinhSua.classList.remove("d-none");
                    btnChinhSua.setAttribute("idAlbumAnh", danhSach[i].idAlbumAnh);
                    btnChinhSua.addEventListener("click", function() {
                        chinhSuaAlbumAnh(danhSach[i].idAlbumAnh);
                    });
                }
                danhSachAlbum.append(albumAnh);
                
                // Them vao danh sach thu vien hinh anh
                var itemThuVienHinh = document.createElement('a');
                itemThuVienHinh.setAttribute("data-id", danhSach[i].idAlbumAnh);
                itemThuVienHinh.classList.add("list-group-item", "list-group-item-action");
                itemThuVienHinh.textContent = danhSach[i].tenAlbumAnh;
                itemThuVienHinh.addEventListener("click", function() {
                    danhSachHinhAnh(danhSach[i].idAlbumAnh);
                });
                lstThuVienHinh.appendChild(itemThuVienHinh);

                // Them su kien cho tag a
                albumAnh.querySelector(".lblAlbumAnhTen").addEventListener("click", function() {
                    danhSachHinhAnh(danhSach[i].idAlbumAnh);
                });
                // Them su kien cho tag img
                albumAnh.querySelector(".imgAlbumAnh").addEventListener("click", function() {
                    danhSachHinhAnh(danhSach[i].idAlbumAnh);
                });
            }
        }
    });
}

//------------------------------------------------------------
// Them Moi Album
document.getElementById("btnAlbumAnhThemMoi").addEventListener("click", function() {
    // Xoa du lieu cu
    document.getElementById("txtTMAlbum_Title").textContent = "Thêm Mới Album Ảnh";
    document.getElementById("txtTMAlbum_Ten").value = "";
    document.querySelector("#modalThemMoiAlbum .custom-file-label").textContent = "";
    // Hien button Them Moi
    document.getElementById("btnTMAlbum_Them").classList.remove("d-none");
    // An button Cap nhat
    document.getElementById("btnTMAlbum_CapNhat").classList.add("d-none");
});

// Xu ly them moi album anh
document.getElementById("btnTMAlbum_Them").addEventListener("click", function() {
    const tenAlbumAnh = document.getElementById("txtTMAlbum_Ten").value;
    const idNguoiDung = UserInfo.idNguoiDung;
    const txtTMAlbum_HinhAnh = document.getElementById("txtTMAlbum_HinhAnh");

    // Tải hình lên server
    apiPostUploadFile(API_CALL.UPLOAD_FILE, txtTMAlbum_HinhAnh.files[0], function(response) {
        const params = {
            "tenAlbumAnh": tenAlbumAnh,
            "idNguoiDung": idNguoiDung,
            "urlHinhAnh": response.filename
        }
    
        apiPostData(API_CALL.THEM_MOI_ALBUM_ANH, params, function(response) {
            if(response.status == true) {
                // Dong modal them moi album anh
                $('#modalThemMoiAlbum').modal('hide');
                // Thong bao them moi thanh cong
                bootbox.alert({
                    title: 'Thêm mới album ảnh',
                    message: 'Thêm mới thành công',
                    size: 'small'
                });
                // Tải lại danh sách album anh
                danhSachAlbumAnh();
            } else {
                // Thong bao them moi thất bại
                bootbox.alert({
                    title: 'Thêm mới album ảnh',
                    message: 'Thêm mới thất bại',
                    size: 'small'
                });
            }
        });
    });
});

// Add the following code if you want the name of the file appear on select
$("#txtTMAlbum_HinhAnh.custom-file-input").on("change", function() {
    var fileName = $(this).val().split("\\").pop();
    $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
});

//------------------------------------------------------------
// Xóa album ảnh
function xoaAlbumAnh(idAlbumAnh) {
    const params = {
        "idAlbumAnh": idAlbumAnh
    }
    apiPostData(API_CALL.XOA_ALBUM_ANH, params, function(response) {
        if(response.status == true) {
            // Thong bao them moi thanh cong
            bootbox.alert({
                title: 'Xóa album ảnh',
                message: 'Xóa thành công',
                size: 'small'
            });
            // Tải lại danh sách
            danhSachAlbumAnh();
        } else {
            // Thong bao them moi thất bại
            bootbox.alert({
                title: 'Xóa album ảnh',
                message: 'Xóa thất bại',
                size: 'small'
            });
        }
    });
}

//------------------------------------------------------------
// Chỉnh sửa album ảnh
var albumAnh_idAlbumAnh = null;
var albumAnh_urlHinhAnh = null;
function chinhSuaAlbumAnh(idAlbumAnh) {
    document.getElementById("txtTMAlbum_Title").textContent = "Chỉnh Sửa Album Ảnh";
    document.getElementById("txtTMAlbum_Ten").value = "";
    document.querySelector("#modalThemMoiAlbum .custom-file-label").textContent = "";
    albumAnh_idAlbumAnh = null;
    albumAnh_urlHinhAnh = null;
    // An button Them Moi
    document.getElementById("btnTMAlbum_Them").classList.add("d-none");
    // Hien button Cap nhat
    document.getElementById("btnTMAlbum_CapNhat").classList.remove("d-none");

    // Lấy thông tin tin tức
    const params = {
        "idAlbumAnh": idAlbumAnh
    }
    apiGetData(API_CALL.THONG_TIN_ALBUM_ANH, params, function(response) {
        if(response.status == true && typeof(response.data) != "undefined") {
            // Maping thông tin tin tức
            albumAnh_idAlbumAnh = response.data.idAlbumAnh;
            document.getElementById("txtTMAlbum_Ten").value = response.data.tenAlbumAnh;
            albumAnh_urlHinhAnh = response.data.urlHinhAnh;
            // Hien modal
            $("#modalThemMoiAlbum").modal();
        } else {
            bootbox.alert({
                title: 'Lỗi',
                message: 'Không thể truy cập được tin thông tin album ảnh',
                size: 'small'
            });
        }
    });
}

// Xu ly cập nhật album ảnh
document.getElementById("btnTMAlbum_CapNhat").addEventListener("click", function() {
    let idAlbumAnh = albumAnh_idAlbumAnh;
    let tenAlbumAnh = document.getElementById("txtTMAlbum_Ten").value;
    let urlHinhAnh = albumAnh_urlHinhAnh;
    let idNguoiDung = UserInfo.idNguoiDung;

    var capNhatAlbumAnhFunc = function(idAlbumAnh, tenAlbumAnh, urlHinhAnh, idNguoiDung) {
        const params = {
            "idAlbumAnh": idAlbumAnh,
            "tenAlbumAnh": tenAlbumAnh,
            "urlHinhAnh": urlHinhAnh,
            "idNguoiDung": idNguoiDung
        }
        apiPostData(API_CALL.CAP_NHAT_ALBUM_ANH, params, function(response) {
            if(response.status == true) {
                // Dong modal them moi tin tuc
                $('#modalThemMoiAlbum').modal('hide');
                // Thong bao them moi thanh cong
                bootbox.alert({
                    title: 'Cập nhật album ảnh',
                    message: 'Cập nhật album ảnh thành công',
                    size: 'small'
                });
                // Tải lại danh
                danhSachAlbumAnh();
            } else {
                // Thong bao them moi thất bại
                bootbox.alert({
                    title: 'Cập nhật album ảnh',
                    message: 'Cập nhật album ảnh thành công',
                    size: 'small'
                });
            }
        });
    }

    // Kiem tra anh co tải lên hay không?
    // Nếu có thì tải ảnh rồi cập nhật thông tin
    // Nếu không thì chỉ cập nhật thông tin
    const lblTenAnh = document.querySelector("#modalThemMoiAlbum .custom-file-label").textContent;
    if(lblTenAnh != "") {
        const txtTMAlbum_HinhAnh = document.getElementById("txtTMAlbum_HinhAnh");
        // Tải hình lên server
        apiPostUploadFile(API_CALL.UPLOAD_FILE, txtTMAlbum_HinhAnh.files[0], function(response) {
            capNhatAlbumAnhFunc(idAlbumAnh, tenAlbumAnh, response.filename, idNguoiDung);
        });
    } else {
        capNhatAlbumAnhFunc(idAlbumAnh, tenAlbumAnh, urlHinhAnh, idNguoiDung);
    }
});


//------------------------------------------------------------
// Xem album anh
// Xu ly khi nguoi dung xem album anh
function danhSachHinhAnh(idAlbumAnh) {
    // ẩn pannel album ảnh
    document.getElementById("pannelAlbumAnh").classList.add("d-none");
    // hiện pannel hình ảnh
    document.getElementById("pannelHinhAnh").classList.remove("d-none");
    // Select tab thu viện hình
    document.querySelectorAll("#lstThuVienHinh a").forEach(function(el) {
        if(el.getAttribute("data-id") == idAlbumAnh + "") {
            el.classList.add("active");
        } else {
            el.classList.remove("active");
        }
    });

    const params = {
        "idAlbumAnh": idAlbumAnh
    }
    apiGetData(API_CALL.DANH_SACH_HINH_ANH, params, function(data) {
        // Xoa tat ca album cu
        let danhSachHinhAnh = document.getElementById("danhSachHinhAnh");
        danhSachHinhAnh.innerHTML = "";

        if(data.status && data.data.length > 0) {
            const danhSach = data.data;
            // Clone tao tin tuc
            let mauHinhAnh = document.getElementById("mauHinhAnh");
            for(let i = 0; i < danhSach.length; i++) {
                let hinhAnh = mauHinhAnh.cloneNode(true);
                hinhAnh.removeAttribute("id");
                // Bo an
                hinhAnh.classList.remove("d-none");
                // Map thong tin tin tuc
                hinhAnh.querySelector(".lblHinhAnhTen").textContent = danhSach[i].tenHinhAnh;
                hinhAnh.querySelector(".imgHinhAnh").src = "/uploads_tintuc/" + danhSach[i].urlHinhAnh;
                // Hien thi nut xoa
                if(typeof(UserInfo.tenQuyen) != "undefined") {
                    // Button Xoa tin tuc
                    let btnXoa = hinhAnh.querySelector(".btnXoaHinhAnh");
                    btnXoa.classList.remove("d-none");
                    btnXoa.setAttribute("data-id", danhSach[i].idHinhAnh);
                    btnXoa.addEventListener("click", function() {
                        bootbox.confirm({
                            title: 'Xóa Hình Ảnh',
                            message: 'Bạn có chắc chắn muốn xóa ảnh này?',
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
                                    xoaHinhAnh(btnXoa.getAttribute("data-id"), danhSach[i].idAlbumAnh);
                                }
                            }
                        });
                    });
                }
                danhSachHinhAnh.append(hinhAnh);
            }
        }
    });
}

//------------------------------------------------------------
// Xoá hình ảnh
function xoaHinhAnh(idHinhAnh, idAlbumAnh) {
    const params = {
        "idHinhAnh": idHinhAnh
    }
    apiPostData(API_CALL.XOA_HINH_ANH, params, function(response) {
        if(response.status == true) {
            // Thong bao them moi thanh cong
            bootbox.alert({
                title: 'Xóa hình ảnh',
                message: 'Xóa thành công',
                size: 'small'
            });
            // Tải lại danh sách
            danhSachHinhAnh(idAlbumAnh);
        } else {
            // Thong bao them moi thất bại
            bootbox.alert({
                title: 'Xóa hình ảnh',
                message: 'Xóa thất bại',
                size: 'small'
            });
        }
    });
}

//------------------------------------------------------------
// Them Moi Album
document.getElementById("btnHinhAnhThemMoi").addEventListener("click", function() {
    // Xoa du lieu cu
    document.getElementById("txtTMHA_Ten").value = "";
    document.querySelector("#modalThemMoiHinhAnh .custom-file-label").textContent = "";
});

// Add the following code if you want the name of the file appear on select
$("#txtTMHA_HinhAnh.custom-file-input").on("change", function() {
    var fileName = $(this).val().split("\\").pop();
    $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
});

// Xu ly them moi album anh
document.getElementById("btnTMHA_Them").addEventListener("click", function() {
    const tenHinhAnh = document.getElementById("txtTMHA_Ten").value;
    const idNguoiDung = UserInfo.idNguoiDung;
    const txtTMHA_HinhAnh = document.getElementById("txtTMHA_HinhAnh");
    const idAlbumAnh = document.querySelector("#lstThuVienHinh a.active").getAttribute("data-id");

    // Tải hình lên server
    apiPostUploadFile(API_CALL.UPLOAD_FILE, txtTMHA_HinhAnh.files[0], function(response) {
        const params = {
            "tenHinhAnh": tenHinhAnh,
            "idNguoiDung": idNguoiDung,
            "urlHinhAnh": response.filename,
            "idAlbumAnh": idAlbumAnh
        }
    
        apiPostData(API_CALL.THEM_MOI_HINH_ANH, params, function(response) {
            if(response.status == true) {
                // Dong modal them moi album anh
                $('#modalThemMoiHinhAnh').modal('hide');
                // Thong bao them moi thanh cong
                bootbox.alert({
                    title: 'Thêm mới hình ảnh',
                    message: 'Thêm mới thành công',
                    size: 'small'
                });
                // Tải lại danh sách album anh
                danhSachHinhAnh(idAlbumAnh);
            } else {
                // Thong bao them moi thất bại
                bootbox.alert({
                    title: 'Thêm mới hình ảnh',
                    message: 'Thêm mới thất bại',
                    size: 'small'
                });
            }
        });
    });
});