// Lang nghe su kien khi nguoi dung nhan "Dang nhap"
document.getElementById("btnDangNhap").addEventListener("click", function() {
    let txtDNTenDangNhap = document.getElementById("txtDNTenDangNhap");
    let txtDNMatKhau = document.getElementById("txtDNMatKhau");
    // Xoa thong tin cu
    txtDNTenDangNhap.value = "";
    txtDNMatKhau.value = "";
    // Kiem tra luu thong tin dang nhap
    const tenNguoiDung = getCookie("tenNguoiDung");
    const matKhau = getCookie("matKhau");
    if(tenNguoiDung != "" && matKhau != "") {
        txtDNTenDangNhap.value = tenNguoiDung;
        txtDNMatKhau.value = matKhau;
    }
});

// Lang nghe su kien khi nguoi dung nhan nut Dang nhap
document.getElementById("btnDNDangNhap").addEventListener("click", function() {
    const userName = document.getElementById("txtDNTenDangNhap").value;
    let passwwordOri = document.getElementById("txtDNMatKhau").value;
    // Ma hoa mat khau
    const passwword = CryptoJS.MD5(passwwordOri) + "";
    const params = {
        "tenNguoiDung": userName,
        "matKhau": passwword
    }

    apiPostData(API_CALL.DANG_NHAP, params, function(response) {
        if(response.status == true) {
            // Dang nhap thanh cong
            UserInfo = response.data;
            // Dong modal dang nhap
            $('#modalDangNhap').modal('hide');
            // Hien thi thong tin nguoi dung
            document.getElementById("pannelThongTinUser").classList.remove("d-none");
            document.getElementById("lbHoten").textContent = UserInfo.hoTen;
            // An thong tin dang nhap
            document.getElementById("pannelDangNhap").classList.add("d-none");
            // Luu thong mat khau
            let chkDNLuuMatKhau = document.getElementById("chkDNLuuMatKhau");
            if(chkDNLuuMatKhau.checked) {
                setCookie("tenNguoiDung", userName, 180);
                setCookie("matKhau", passwwordOri, 180);
            } else {
                // Xoa thong tin mat khau
                setCookie("tenNguoiDung", "", 180);
                setCookie("matKhau", "", 180);
            }
            // Trigger ve trang chu
            document.querySelector(".nav-item[data-page='trangChu']").click();
            // Hiện thị tab quản lý user
            if(UserInfo.tenNguoiDung == "Admin") {
                document.querySelector("li[data-page='qlUser']").classList.remove("d-none");
            } else {
                document.querySelector("li[data-page='qlUser']").classList.add("d-none");
            }
        } else {
            // Dang nhap that bai
            bootbox.alert({
                message: 'Sai tên đăng nhập hoặc mật khẩu!',
                size: 'small'
            });
        }
    });
});

//---------------------------------------------------------------------------
// Lang nghe su kien khi nguoi dung nhan nut "Dang xuat"
document.getElementById("btnDangXuat").addEventListener("click", function() {
    bootbox.confirm({
        title: 'Đăng Xuất',
        message: 'Bạn có chắc chắn muốn đăng xuất?',
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
                // Dang xuat
                // Xoa thong tin nguoi dung
                UserInfo = {};
                // An thi thong tin nguoi dung
                document.getElementById("pannelThongTinUser").classList.add("d-none");
                // Hien thong tin dang nhap
                document.getElementById("pannelDangNhap").classList.remove("d-none");
                // Trigger ve trang chu
                document.querySelector(".nav-item[data-page='trangChu']").click();
                // an ql user
                document.querySelector("li[data-page='qlUser']").classList.add("d-none");
            }
        }
    });
});

//---------------------------------------------------------------------------
document.getElementById("btnChinhSuaUser").addEventListener("click", function() {
    document.getElementById("modalDoiMatKhau_txtMatKhauHienTai").value = "";
    document.getElementById("modalDoiMatKhau_txtMatKhau").value = "";
    document.getElementById("modalDoiMatKhau_txtNhapLaiMatKhau").value = "";
});

document.getElementById("btnCapNhatMatKhau").addEventListener("click", function() {
    const matKhauCu = document.getElementById("modalDoiMatKhau_txtMatKhauHienTai").value;
    const matKhauMoi = document.getElementById("modalDoiMatKhau_txtMatKhau").value;

    let params = {
        "idNguoiDung": UserInfo.idNguoiDung,
        "matKhauCu": CryptoJS.MD5(matKhauCu) + '',
        "matKhauMoi": CryptoJS.MD5(matKhauMoi) + ''
    }
    apiPostData(API_CALL.DOI_MAT_KHAU, params, function(response){
        if(response.status == true) {
            // Dong modal dang ky
            $('#modalDoiMatKhau').modal('hide');
            // Thong bao them moi thanh cong
            bootbox.alert({
                title: document.querySelector("#modalDoiMatKhau .modal-title").textContent,
                message: 'Cập nhật tài khoản thành công',
                size: 'small'
            });
        } else if(response.code == "ERR02") {
            bootbox.alert({
                title: document.querySelector("#modalDoiMatKhau .modal-title").textContent,
                message: 'Sai mật khẩu',
                size: 'small'
            });
        } else {
            // Thong bao them moi thất bại
            bootbox.alert({
                title: document.querySelector("#modalDoiMatKhau .modal-title").textContent,
                message: 'Cập nhật tài khoản thất bại',
                size: 'small'
            });
        }
    });
});