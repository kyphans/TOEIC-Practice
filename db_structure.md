# 🗂️ Cơ sở dữ liệu hệ thống thi trắc nghiệm

## 1. `users` – Quản lý người dùng

| Cột             | Kiểu dữ liệu                          | Ghi chú                                    |
| --------------- | ------------------------------------- | ------------------------------------------ |
| `id`            | `SERIAL`                              | Khóa chính tự tăng                         |
| `clerk_id`      | `VARCHAR(255)`                        | ID đồng bộ từ hệ thống đăng nhập bên ngoài |
| `name`          | `VARCHAR(255)`                        | Tên người dùng                             |
| `email`         | `VARCHAR(255)`                        | Email người dùng, duy nhất                 |
| `password_hash` | `TEXT`                                | Mật khẩu đã mã hóa                         |
| `role`          | `ENUM('student', 'teacher', 'admin')` | Vai trò người dùng, mặc định là `student`  |
| `created_at`    | `TIMESTAMP`                           | Ngày tạo người dùng                        |

---

## 2. `question_sections` – Phân loại phần thi

| Cột           | Kiểu dữ liệu                           | Ghi chú                           |
| ------------- | -------------------------------------- | --------------------------------- |
| `id`          | `SERIAL`                               | Khóa chính                        |
| `code`        | `VARCHAR(10)`                          | Mã phần thi, ví dụ `part1`        |
| `name`        | `VARCHAR(255)`                         | Tên phần thi, ví dụ `Photographs` |
| `section_name`| `ENUM('Listening', 'Reading')`        | Tên section (Listening/Reading)   |

---

## 3. `question_types` – Loại câu hỏi

| Cột    | Kiểu dữ liệu   | Ghi chú                                          |
| ------ | -------------- | ------------------------------------------------ |
| `id`   | `SERIAL`       | Khóa chính                                       |
| `name` | `VARCHAR(100)` | Tên loại câu hỏi (`single_choice`, `essay`, ...) |

---

## 4. `questions` – Câu hỏi gốc

| Cột                | Kiểu dữ liệu                   | Ghi chú                        |
| ------------------ | ------------------------------ | ------------------------------ |
| `id`               | `SERIAL`                       | Khóa chính                     |
| `content`          | `TEXT`                         | Nội dung câu hỏi               |
| `correct_answer`   | `TEXT`                         | Đáp án đúng                    |
| `difficulty`       | `ENUM('easy','medium','hard')` | Mức độ khó                     |
| `topic`            | `VARCHAR(100)`                 | Chủ đề câu hỏi                 |
| `section_id`       | `INTEGER`                      | FK đến `question_sections(id)` |
| `question_type_id` | `INTEGER`                      | FK đến `question_types(id)`    |
| `created_by`       | `INTEGER`                      | FK đến `users(id)`             |
| `created_at`       | `TIMESTAMP`                    | Ngày tạo                       |

---

## 5. `question_media` – Media cho câu hỏi

| Cột           | Kiểu dữ liệu                           | Ghi chú                              |
| ------------- | -------------------------------------- | ------------------------------------ |
| `id`          | `SERIAL`                               | Khóa chính                           |
| `question_id` | `INTEGER`                              | FK đến `questions(id)`               |
| `media_type`  | `ENUM('audio', 'image', 'transcript')` | Loại media                           |
| `content`     | `TEXT`                                 | Nội dung (base64 / URL / transcript) |

---

## 6. `question_choices` – Lựa chọn trả lời

| Cột           | Kiểu dữ liệu | Ghi chú                   |
| ------------- | ------------ | ------------------------- |
| `id`          | `SERIAL`     | Khóa chính                |
| `question_id` | `INTEGER`    | FK đến `questions(id)`    |
| `label`       | `CHAR(1)`    | Nhãn lựa chọn: A, B, C, D |
| `content`     | `TEXT`       | Nội dung lựa chọn         |

---

## 7. `exams` – Đề thi

| Cột               | Kiểu dữ liệu              | Ghi chú            |
| ----------------- | ------------------------- | ------------------ |
| `id`              | `SERIAL`                  | Khóa chính         |
| `title`           | `VARCHAR(255)`            | Tiêu đề đề thi     |
| `description`     | `TEXT`                    | Mô tả ngắn         |
| `total_questions` | `INTEGER`                 | Tổng số câu hỏi    |
| `strategy`        | `ENUM('random','manual')` | Chiến lược tạo đề (cách chọn câu hỏi khi tạo đề) |
| `section_names`   | `TEXT`                    | Danh sách section  |
| `created_by`      | `INTEGER`                 | FK đến `users(id)` |
| `created_at`      | `TIMESTAMP`               | Ngày tạo đề        |
| `display_order`   | `ENUM('random','original')` | Cách sắp xếp câu hỏi khi hiển thị đề thi cho thí sinh (random: ngẫu nhiên, original: theo thứ tự gốc) |
| `section_times`   | `TEXT`                    | Thời gian làm bài cho từng phần, lưu dạng "1500,2000" (ví dụ: Reading 1500 giây, Listening 2000 giây) |

---

## 8. `exam_questions` – Snapshot câu hỏi trong đề

| Cột                    | Kiểu dữ liệu                   | Ghi chú                   |
| ---------------------- | ------------------------------ | ------------------------- |
| `id`                   | `SERIAL`                       | Khóa chính                |
| `exam_id`              | `INTEGER`                      | FK đến `exams(id)`        |
| `original_question_id` | `INTEGER`                      | ID câu hỏi gốc (nếu có)   |
| `content`              | `TEXT`                         | Nội dung snapshot câu hỏi |
| `correct_answer`       | `TEXT`                         | Đáp án snapshot           |
| `difficulty`           | `ENUM('easy','medium','hard')` | Độ khó                    |
| `topic`                | `VARCHAR(100)`                 | Chủ đề                    |
| `question_type_id`     | `INTEGER`                      | Loại câu hỏi              |
| `section_id`           | `INTEGER`                      | FK đến `question_sections(id)` |
| `created_at`           | `TIMESTAMP`                    | Ngày snapshot             |

---

## 9. `exam_question_choices` – Lựa chọn snapshot

| Cột                | Kiểu dữ liệu | Ghi chú                     |
| ------------------ | ------------ | --------------------------- |
| `id`               | `SERIAL`     | Khóa chính                  |
| `exam_question_id` | `INTEGER`    | FK đến `exam_questions(id)` |
| `label`            | `CHAR(1)`    | A, B, C, D                  |
| `content`          | `TEXT`       | Nội dung                    |

---

## 10. `exam_attempts` – Lượt làm bài

| Cột            | Kiểu dữ liệu                                 | Ghi chú               |
| -------------- | -------------------------------------------- | --------------------- |
| `id`           | `SERIAL`                                     | Khóa chính            |
| `exam_id`      | `INTEGER`                                    | FK đến `exams(id)`    |
| `user_id`      | `INTEGER`                                    | FK đến `users(id)`    |
| `started_at`   | `TIMESTAMP`                                  | Bắt đầu làm bài       |
| `submitted_at` | `TIMESTAMP`                                  | Thời điểm nộp bài     |
| `score`        | `DECIMAL(5,2)`                               | Điểm số (nếu đã chấm) |
| `status`       | `ENUM('in_progress','submitted','reviewed')` | Trạng thái làm bài    |
| `reviewed_at`  | `TIMESTAMP`                                  | Thời gian chấm        |

---

## 11. `exam_answers` – Câu trả lời

| Cột                | Kiểu dữ liệu | Ghi chú                     |
| ------------------ | ------------ | --------------------------- |
| `id`               | `SERIAL`     | Khóa chính                  |
| `exam_attempt_id`  | `INTEGER`    | FK đến `exam_attempts(id)`  |
| `exam_question_id` | `INTEGER`    | FK đến `exam_questions(id)` |
| `selected_answer`  | `TEXT`       | Câu chọn của thí sinh       |
| `essay_content`    | `TEXT`       | Nội dung tự luận            |
| `is_correct`       | `BOOLEAN`    | Trả lời đúng hay sai        |

**UNIQUE:** (`exam_attempt_id`, `exam_question_id`)

---

## 12. `review_histories` – Lịch sử xem lại bài

| Cột               | Kiểu dữ liệu  | Ghi chú                    |
| ----------------- | ------------- | -------------------------- |
| `id`              | `SERIAL`      | Khóa chính                 |
| `exam_attempt_id` | `INTEGER`     | FK đến `exam_attempts(id)` |
| `user_id`         | `INTEGER`     | FK đến `users(id)`         |
| `viewed_at`       | `TIMESTAMP`   | Thời gian xem lại          |
| `device_info`     | `TEXT`        | Thông tin thiết bị         |
| `ip_address`      | `VARCHAR(45)` | Địa chỉ IP                 |

---

## Indexes

- `idx_exam_questions_section_id` trên `exam_questions(section_id)`

---
