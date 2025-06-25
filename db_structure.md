# I. Thiết kế cơ sở dữ liệu bằng Neon

## 🎯 1. Quản lý người dùng

### Bảng `users`

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    clerk_id VARCHAR(255);
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password_hash TEXT,
    role ENUM('student', 'teacher', 'admin') NOT NULL DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 📚 2. Ngân hàng câu hỏi
### Bảng `question_sections`

```sql
CREATE TABLE question_sections (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10), -- e.g. 'part1'
    name VARCHAR(255) -- e.g. 'Photographs'
);
```

### Bảng `question_types`

```sql
CREATE TABLE question_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) -- e.g. 'single_choice', 'multiple_choice', 'essay'
);
```

### Bảng `question_media`

```sql
CREATE TABLE question_media (
    id SERIAL PRIMARY KEY,
    question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
    media_type ENUM('audio', 'image', 'transcript') NOT NULL,
    content TEXT
);
```

### Bảng `questions`

```sql
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    content TEXT,
    correct_answer TEXT,
    difficulty ENUM('easy', 'medium', 'hard'),
    topic VARCHAR(100),
    section_id INTEGER REFERENCES question_sections(id), 
    question_type_id INTEGER REFERENCES question_types(id),
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Bảng `question_choices`

```sql
CREATE TABLE question_choices (
    id SERIAL PRIMARY KEY,
    question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
    label CHAR(1), -- A, B, C, D
    content TEXT
);
```

---

## 🧠 3. Tạo đề thi

### Bảng `exams`

```sql
CREATE TABLE exams (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    total_questions INTEGER,
    strategy ENUM('random', 'manual') NOT NULL,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Bảng `exam_questions` (Snapshot câu hỏi)

```sql
CREATE TABLE exam_questions (
    id SERIAL PRIMARY KEY,
    exam_id INTEGER REFERENCES exams(id) ON DELETE CASCADE,
    original_question_id INTEGER,
    content TEXT,
    correct_answer TEXT,
    difficulty VARCHAR(50),
    topic VARCHAR(100),
    question_type_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Bảng `exam_question_choices`

```sql
CREATE TABLE exam_question_choices (
    id SERIAL PRIMARY KEY,
    exam_question_id INTEGER REFERENCES exam_questions(id) ON DELETE CASCADE,
    label CHAR(1),
    content TEXT
);
```

---

## 📝 4. Làm bài và kết quả

### Bảng `exam_attempts`

```sql
CREATE TABLE exam_attempts (
    id SERIAL PRIMARY KEY,
    exam_id INTEGER REFERENCES exams(id),
    user_id INTEGER REFERENCES users(id),
    started_at TIMESTAMP,
    submitted_at TIMESTAMP,
    score DECIMAL(5,2),
    status ENUM('in_progress', 'submitted', 'reviewed') DEFAULT 'submitted',
    reviewed_at TIMESTAMP
);
```

### Bảng `exam_answers`

```sql
CREATE TABLE exam_answers (
    id SERIAL PRIMARY KEY,
    exam_attempt_id INTEGER REFERENCES exam_attempts(id) ON DELETE CASCADE,
    exam_question_id INTEGER REFERENCES exam_questions(id),
    selected_answer TEXT,
    essay_content TEXT,
    is_correct BOOLEAN
);
```

### Bảng `review_histories`

```sql
CREATE TABLE review_histories (
    id SERIAL PRIMARY KEY,
    exam_attempt_id INTEGER REFERENCES exam_attempts(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    device_info TEXT,
    ip_address VARCHAR(45)
);
```

---

## 📊 5. Tính điểm & thống kê (gợi ý xử lý)

- **Tính điểm tự động:** chấm `is_correct = selected_answer == correct_answer`
- **Các truy vấn thống kê:**
  - Điểm trung bình theo đề.
  - Số lượt thi.
  - Tỉ lệ đúng theo mức độ, chủ đề, học viên.

---

## 🛠️ 6. Khả năng mở rộng

- **Version hóa:** đã thực hiện bằng cách snapshot toàn bộ nội dung câu hỏi vào `exam_questions`.
- **Các module bổ sung có thể thêm:**
  - `exam_question_orders`: random hóa thứ tự câu.
  - Cột `anti_cheat_flags`, `browser_events` nếu cần chống gian lận.

---

Index

-- 📌 USERS
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);

-- 📌 QUESTIONS
CREATE INDEX IF NOT EXISTS idx_questions_section_id ON questions(section_id);
CREATE INDEX IF NOT EXISTS idx_questions_question_type_id ON questions(question_type_id);
CREATE INDEX IF NOT EXISTS idx_questions_created_by ON questions(created_by);

-- 📌 QUESTION_CHOICES
CREATE INDEX IF NOT EXISTS idx_question_choices_question_id ON question_choices(question_id);

-- 📌 QUESTION_MEDIA
CREATE INDEX IF NOT EXISTS idx_question_media_question_id ON question_media(question_id);

-- 📌 QUESTION_SECTIONS
CREATE INDEX IF NOT EXISTS idx_question_sections_name ON question_sections(name);

-- 📌 QUESTION_TYPES
CREATE INDEX IF NOT EXISTS idx_question_types_name ON question_types(name);

-- 📌 EXAMS
CREATE INDEX IF NOT EXISTS idx_exams_created_by ON exams(created_by);

-- 📌 EXAM_QUESTIONS
CREATE INDEX IF NOT EXISTS idx_exam_questions_exam_id ON exam_questions(exam_id);
CREATE INDEX IF NOT EXISTS idx_exam_questions_original_qid ON exam_questions(original_question_id);

-- 📌 EXAM_QUESTION_CHOICES
CREATE INDEX IF NOT EXISTS idx_exam_question_choices_eqid ON exam_question_choices(exam_question_id);

-- 📌 EXAM_ATTEMPTS
CREATE INDEX IF NOT EXISTS idx_exam_attempts_user_id ON exam_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_exam_attempts_exam_id ON exam_attempts(exam_id);

-- 📌 EXAM_ANSWERS
CREATE INDEX IF NOT EXISTS idx_exam_answers_attempt_id ON exam_answers(exam_attempt_id);
CREATE INDEX IF NOT EXISTS idx_exam_answers_question_id ON exam_answers(exam_question_id);

-- 📌 REVIEW_HISTORIES
CREATE INDEX IF NOT EXISTS idx_review_histories_attempt_id ON review_histories(exam_attempt_id);
CREATE INDEX IF NOT EXISTS idx_review_histories_user_id ON review_histories(user_id);