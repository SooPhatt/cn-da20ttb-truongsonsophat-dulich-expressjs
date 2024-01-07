function khoiTaoVideo() {
    // Kiem tra dang nhap
    videoKiemTraDangNhap();
    // Lay danh sach video
    danhSachVideos();
}

function videoKiemTraDangNhap() {
    // An/Hien nut them moi tin tuc
    if(typeof(UserInfo.tenQuyen) != "undefined") {
        document.getElementById("btnVideoThemMoi").classList.remove("d-none");
    } else {
        document.getElementById("btnVideoThemMoi").classList.add("d-none");
    }
}

function danhSachVideos() {
    apiGetData(API_CALL.DANH_SACH_VIDEO, {}, function(data) {
        // Xoa tat ca album cu
        let danhSachVideo = document.getElementById("danhSachVideo");
        danhSachVideo.innerHTML = "";

        if(data.status && data.data.length > 0) {
            const danhSach = data.data;
            // Clone tao tin tuc
            let mauVideo = document.getElementById("mauVideo");
            for(let i = 0; i < danhSach.length; i++) {
                let video = mauVideo.cloneNode(true);
                video.removeAttribute("id");
                // Bo an
                video.classList.remove("d-none");
                // Map thong tin tin tuc
                video.querySelector(".lblTenVideo").textContent = danhSach[i].tenVideo;
                // Sử dụng ảnh từ Youtube
                /**
                 * Link ảnh: https://img.youtube.com/vi/<id video youtube>/hqdefault.jpg
                 */
                const urlVideoSplit = danhSach[i].urlVideo.split("/");
                const idVideo = urlVideoSplit[3];
                video.querySelector(".imgVideoHinhAnh").src = "https://img.youtube.com/vi/" + idVideo + "/hqdefault.jpg";
                // Hien thi nut xoa
                if(typeof(UserInfo.tenQuyen) != "undefined") {
                    // Button Xoa tin tuc
                    let btnXoa = video.querySelector(".btnXoaVideo");
                    btnXoa.classList.remove("d-none");
                    btnXoa.setAttribute("data-id", danhSach[i].idVideo);
                    btnXoa.addEventListener("click", function() {
                        bootbox.confirm({
                            title: 'Xóa Video',
                            message: 'Bạn có chắc chắn muốn xóa video này?',
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
                                    xoaVideo(btnXoa.getAttribute("data-id"), danhSach[i].idVideo);
                                }
                            }
                        });
                    });
                }
                danhSachVideo.append(video);
                // Them su kien cho tag a
                video.querySelector(".lblTenVideo").addEventListener("click", function() {
                    xemVideo(danhSach[i].tenVideo, danhSach[i].urlVideo);
                });
                // Them su kien cho tag img
                video.querySelector(".imgVideoHinhAnh").addEventListener("click", function() {
                    xemVideo(danhSach[i].tenVideo, danhSach[i].urlVideo);
                });
            }
        }
    });
}

//------------------------------------------------------------
// Them Moi Video
document.getElementById("btnVideoThemMoi").addEventListener("click", function() {
    // Xoa du lieu cu
    document.getElementById("txtTMVideo_Ten").value = "";
    document.getElementById("txtTMVideo_Url").value = "";
});

// Xu ly them moi video
document.getElementById("btnTMVideo_Them").addEventListener("click", function() {
    const tenVideo = document.getElementById("txtTMVideo_Ten").value;
    const urlVideo = document.getElementById("txtTMVideo_Url").value;
    const idNguoiDung = UserInfo.idNguoiDung;

    const params = {
        "tenVideo": tenVideo,
        "urlVideo": urlVideo,
        "idNguoiDung":idNguoiDung
    }
    apiPostData(API_CALL.THEM_MOI_VIDEO, params, function(response) {
        if(response.status == true) {
            // Dong modal them moi album anh
            $('#modalThemMoiVideo').modal('hide');
            // Thong bao them moi thanh cong
            bootbox.alert({
                title: 'Thêm mới video',
                message: 'Thêm mới thành công',
                size: 'small'
            });
            // Tải lại danh sách album anh
            danhSachVideos();
        } else {
            // Thong bao them moi thất bại
            bootbox.alert({
                title: 'Thêm mới video',
                message: 'Thêm mới thất bại',
                size: 'small'
            });
        }
    });
});

//------------------------------------------------------------
// Xoá video
function xoaVideo(idVideo) {
    const params = {
        "idVideo": idVideo
    }
    apiPostData(API_CALL.XOA_VIDEO, params, function(response) {
        if(response.status == true) {
            // Thong bao them moi thanh cong
            bootbox.alert({
                title: 'Xóa video',
                message: 'Xóa thành công',
                size: 'small'
            });
            // Tải lại danh sách
            danhSachVideos();
        } else {
            // Thong bao them moi thất bại
            bootbox.alert({
                title: 'Xóa video',
                message: 'Xóa thất bại',
                size: 'small'
            });
        }
    });
}

//------------------------------------------------------------
// Xu ly xem video
function xemVideo(tenVideo, urlVideo) {
    $('#modalXemVideo').modal();
    const urlVideoSplit = urlVideo.split("/");
    const idVideo = urlVideoSplit[3];
    document.getElementById("iframeVideo").setAttribute("src", "https://www.youtube.com/embed/" + idVideo);
}