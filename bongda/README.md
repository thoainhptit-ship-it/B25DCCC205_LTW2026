# TH03B · Giải bóng đá các khoa

Ứng dụng React một trang theo đề TH03B. Mã nguồn đã được tổ chức theo các phần dữ liệu, hooks, Context, Redux Toolkit và components.

## Chạy ứng dụng

1. Cài Node.js LTS.
2. Mở terminal tại thư mục này và chạy `npm install`.
3. Chạy `npm start`, sau đó mở địa chỉ local được CRA hiển thị.

## Nội dung đã làm

- Bảng xếp hạng 6 đội, thống kê trận/bàn thắng, kết quả và hiệu số.
- Lọc lịch theo vòng, tìm tên đội sau 300 ms, phím `/` để tìm và `Esc` để xóa.
- Sửa tỉ số, xóa trận, thêm trận với kiểm tra đội và tỉ số.
- Mục tiêu điểm, Context cho giao diện sáng/tối và thông báo tự ẩn.
- Redux Toolkit cho lịch đấu và mục tiêu; lưu cài đặt và lịch trong `localStorage`.
- Khôi phục dữ liệu mẫu, phân bố kết quả, đếm lần render mỗi dòng và cập nhật tiêu đề tab.

`public/data/matches.json` chứa dữ liệu mẫu ban đầu. Nếu muốn thử lại từ đầu, xóa các khóa `ltw_bongda_matches`, `ltw_bongda_theme`, `ltw_bongda_round` trong Local Storage hoặc dùng nút đặt lại dữ liệu mẫu.
