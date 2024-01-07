function khoiTaoQlUser() {
    // Danh sach user
    danhSachUser();
}

// Lay danh sach user
function danhSachUser() {
    apiGetData(API_CALL.DANH_SACH_USER, {}, function(data) {
        // Xoa tat ca user cu
        let danhSachUser = document.getElementById("tbodyListUser");
        danhSachUser.innerHTML = "";
        if(data.status && data.data.length > 0) {
            const list = data.data;
            let btnUserXoa = document.querySelector(".btnUserXoa");
            let btnUserChinhSua = document.querySelector(".btnUserChinhSua");
            let STT = 0;

            for(let i = 0; i < list.length; i++) {
                // Khong hien user Admin
                if(list[i].hoTen == "Admin") {
                    continue;
                }

                let rowUser = document.createElement("tr");
                // STT
                let rowSTT = document.createElement("td");
                rowSTT.textContent = STT + 1;
                rowUser.appendChild(rowSTT);
                STT++;
                // User name
                let rowUserName = document.createElement("td");
                rowUserName.textContent = list[i].tenNguoiDung;
                rowUser.appendChild(rowUserName);
                // Họ và tên
                let rowHoTen = document.createElement("td");
                rowHoTen.textContent = list[i].hoTen;
                rowUser.appendChild(rowHoTen);
                // Button Xoa tin tuc
                let rowBtnXoa = document.createElement("td");
                let btnXoa = btnUserXoa.cloneNode(true);
                btnXoa.setAttribute("id", list[i].idNguoiDung);
                btnXoa.addEventListener("click", function() {
                    bootbox.confirm({
                        title: 'Xóa Người Dùng',
                        message: 'Bạn có chắc chắn muốn xóa người dùng này?',
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
                                xoaUser(list[i].idNguoiDung);
                            }
                        }
                    });
                });
                rowBtnXoa.appendChild(btnXoa);
                rowUser.appendChild(rowBtnXoa);
                // Button Chinh sua tin tuc
                let rowBtnChinhSua = document.createElement("td");
                let btnChinhSua = btnUserChinhSua.cloneNode(true);
                btnChinhSua.classList.remove("d-none");
                btnChinhSua.setAttribute("id", list[i].idNguoiDung);
                btnChinhSua.addEventListener("click", function() {
                    chinhSuaUser(list[i].idNguoiDung);
                });
                rowBtnChinhSua.appendChild(btnChinhSua);
                rowUser.appendChild(rowBtnChinhSua);
                // Them vao danh sách
                danhSachUser.append(rowUser);
            }
        }
    });
}

//---------------------------------------------------------------------------
let qlUserIdNguoiDung = null;
function chinhSuaUser(idNguoiDung) {
    // Xoa thong tin cu
    document.querySelector("#modalDangKy .modal-title").textContent = "Cập Sửa Tài Khoản";
    document.getElementById("txtHoTen").value = "";
    document.getElementById("txtTenNguoiDung").disabled = true;
    document.getElementById("txtTenNguoiDung").value = "";
    document.getElementById("txtMatKhau").value = "";
    document.getElementById("txtNhapLaiMatKhau").value = "";
    document.getElementById("btnThemMoiUser_Them").classList.add("d-none");
    document.getElementById("btnThemMoiUser_Sua").classList.remove("d-none");

    // Lấy thông tin
    const params = {
        "idNguoiDung": idNguoiDung
    }
    apiGetData(API_CALL.THONG_TIN_USER, params, function(response) {
        if(response.status == true && typeof(response.data) != "undefined") {
            const data = response.data;
            // Maping thông tin
            document.getElementById("txtHoTen").value = data.hoTen;
            document.getElementById("txtTenNguoiDung").value = data.tenNguoiDung;
            qlUserIdNguoiDung = data.idNguoiDung;
        } else {
            bootbox.alert({
                title: 'Lỗi',
                message: 'Không thể truy cập được tin thông tin người dùng',
                size: 'small'
            });
        }
    });
}

function xoaUser(idNguoiDung) {
    const params = {
        "idNguoiDung": idNguoiDung
    }
    apiPostData(API_CALL.XOA_USER, params, function(response) {
        if(response.status == true) {
            // Thong bao them moi thanh cong
            bootbox.alert({
                title: 'Xóa tài khoản',
                message: 'Xóa thành công',
                size: 'small'
            });
            // Tải lại danh sách
            danhSachUser();
        } else {
            // Thong bao them moi thất bại
            bootbox.alert({
                title: 'Xóa tài khoản',
                message: 'Xóa thất bại',
                size: 'small'
            });
        }
    });
}

//---------------------------------------------------------------------------
document.getElementById("btnUserThemMoi").addEventListener("click", function(){
    // Xoa thong tin cu
    document.querySelector("#modalDangKy .modal-title").textContent = "Thêm Mới Tài Khoản";
    document.getElementById("txtHoTen").value = "";
    document.getElementById("txtTenNguoiDung").disabled = false;
    document.getElementById("txtTenNguoiDung").value = "";
    document.getElementById("txtMatKhau").value = "";
    document.getElementById("txtNhapLaiMatKhau").value = "";
    document.getElementById("btnThemMoiUser_Them").classList.remove("d-none");
    document.getElementById("btnThemMoiUser_Sua").classList.add("d-none");
});

// Dang ky
document.getElementById("btnThemMoiUser_Them").addEventListener("click", function(){
    const hoTen = document.getElementById("txtHoTen").value;
    const tenNguoiDung = document.getElementById("txtTenNguoiDung").value;
    const matKhau = document.getElementById("txtMatKhau").value;
    const nhapLaiMatKhau = document.getElementById("txtNhapLaiMatKhau").value;

    const params = {
       "hoTen": hoTen,
       "tenNguoiDung": tenNguoiDung,
       "matKhau": CryptoJS.MD5(matKhau) + "",
       "idQuyen": "1"
    }
    apiPostData(API_CALL.DANG_KY, params, function(response){
        if(response.status == true) {
            // Dong modal dang ky
            $('#modalDangKy').modal('hide');
            // Thong bao them moi thanh cong
            bootbox.alert({
                title: document.querySelector("#modalDangKy .modal-title").textContent,
                message: 'Thêm mới thành công',
                size: 'small'
            });
            // Tải lại danh sách tin tuc
            danhSachUser();
        } else {
            // Thong bao them moi thất bại
            bootbox.alert({
                title: document.querySelector("#modalDangKy .modal-title").textContent,
                message: 'Thêm mới thất bại',
                size: 'small'
            });
        }
    });
});

//---------------------------------------------------------------------------
document.getElementById("btnThemMoiUser_Sua").addEventListener("click", function(){
    const hoTen = document.getElementById("txtHoTen").value;
    const matKhau = document.getElementById("txtMatKhau").value;

    let params = {
        "idNguoiDung": qlUserIdNguoiDung,
        "hoTen": hoTen
    }
    if(matKhau != "") {
        params.matKhau =  CryptoJS.MD5(matKhau) + "";
    }
    apiPostData(API_CALL.CAP_NHAT_USER, params, function(response){
        if(response.status == true) {
        // Dong modal dang ky
        $('#modalDangKy').modal('hide');
        // Thong bao them moi thanh cong
        bootbox.alert({
            title: document.querySelector("#modalDangKy .modal-title").textContent,
            message: 'Cập nhật tài khoản thành công',
            size: 'small'
        });
        // Tải lại danh sách tin tuc
        danhSachUser();
        } else {
        // Thong bao them moi thất bại
        bootbox.alert({
            title: document.querySelector("#modalDangKy .modal-title").textContent,
            message: 'Cập nhật tài khoản thất bại',
            size: 'small'
        });
        }
    });
});