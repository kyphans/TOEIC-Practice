-- Enable ENUM types
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('student', 'teacher', 'admin');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'media_type') THEN
        CREATE TYPE media_type AS ENUM ('audio', 'image', 'transcript');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'difficulty_level') THEN
        CREATE TYPE difficulty_level AS ENUM ('easy', 'medium', 'hard');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'exam_strategy') THEN
        CREATE TYPE exam_strategy AS ENUM ('random', 'manual');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'attempt_status') THEN
        CREATE TYPE attempt_status AS ENUM ('in_progress', 'submitted', 'reviewed');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'section_name') THEN
        CREATE TYPE section_name AS ENUM ('Listening', 'Reading');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'display_order_type') THEN
        CREATE TYPE display_order_type AS ENUM ('random', 'original');
    END IF;
END$$;

-- USERS
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    clerk_id VARCHAR(255),
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password_hash TEXT,
    role user_role NOT NULL DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- QUESTION SECTIONS
CREATE TABLE IF NOT EXISTS question_sections (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10),
    name VARCHAR(255),
    section_name section_name
);

-- QUESTION TYPES
CREATE TABLE IF NOT EXISTS question_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100)
);

-- QUESTIONS
CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    content TEXT,
    correct_answer TEXT,
    difficulty difficulty_level DEFAULT 'easy',
    topic VARCHAR(100),
    section_id INTEGER REFERENCES question_sections(id),
    question_type_id INTEGER REFERENCES question_types(id),
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- QUESTION MEDIA
CREATE TABLE IF NOT EXISTS question_media (
    id SERIAL PRIMARY KEY,
    question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
    media_type media_type NOT NULL,
    content TEXT
);

-- QUESTION CHOICES
CREATE TABLE IF NOT EXISTS question_choices (
    id SERIAL PRIMARY KEY,
    question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
    label CHAR(1),
    content TEXT
);

-- EXAMS
CREATE TABLE IF NOT EXISTS exams (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    total_questions INTEGER,
    difficulty difficulty_level,
    strategy exam_strategy NOT NULL,
    section_names TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    display_order display_order_type DEFAULT 'original',
    section_times TEXT
);

-- EXAM QUESTIONS (snapshot)
CREATE TABLE IF NOT EXISTS exam_questions (
    id SERIAL PRIMARY KEY,
    exam_id INTEGER REFERENCES exams(id) ON DELETE CASCADE,
    original_question_id INTEGER REFERENCES questions(id),
    content TEXT,
    correct_answer TEXT,
    difficulty difficulty_level,
    topic VARCHAR(100),
    question_type_id INTEGER,
    section_id INTEGER REFERENCES question_sections(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- EXAM QUESTION CHOICES
CREATE TABLE IF NOT EXISTS exam_question_choices (
    id SERIAL PRIMARY KEY,
    exam_question_id INTEGER REFERENCES exam_questions(id) ON DELETE CASCADE,
    label CHAR(1),
    content TEXT
);

-- EXAM ATTEMPTS
CREATE TABLE IF NOT EXISTS exam_attempts (
    id SERIAL PRIMARY KEY,
    exam_id INTEGER REFERENCES exams(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    started_at TIMESTAMP,
    submitted_at TIMESTAMP,
    score DECIMAL(5,2),
    status attempt_status DEFAULT 'submitted',
    reviewed_at TIMESTAMP,
    question_order TEXT
);

-- EXAM ANSWERS
CREATE TABLE IF NOT EXISTS exam_answers (
    id SERIAL PRIMARY KEY,
    exam_attempt_id INTEGER REFERENCES exam_attempts(id) ON DELETE CASCADE,
    exam_question_id INTEGER REFERENCES exam_questions(id),
    selected_answer TEXT,
    essay_content TEXT,
    is_correct BOOLEAN,
    CONSTRAINT exam_answers_attempt_question_unique UNIQUE (exam_attempt_id, exam_question_id)
);

-- REVIEW HISTORIES
CREATE TABLE IF NOT EXISTS review_histories (
    id SERIAL PRIMARY KEY,
    exam_attempt_id INTEGER REFERENCES exam_attempts(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    device_info TEXT,
    ip_address VARCHAR(45)
);

-- 📌 INDEXES
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);

CREATE INDEX IF NOT EXISTS idx_questions_section_id ON questions(section_id);
CREATE INDEX IF NOT EXISTS idx_questions_question_type_id ON questions(question_type_id);
CREATE INDEX IF NOT EXISTS idx_questions_created_by ON questions(created_by);

CREATE INDEX IF NOT EXISTS idx_question_choices_question_id ON question_choices(question_id);
CREATE INDEX IF NOT EXISTS idx_question_media_question_id ON question_media(question_id);

CREATE INDEX IF NOT EXISTS idx_question_sections_name ON question_sections(name);
CREATE INDEX IF NOT EXISTS idx_question_types_name ON question_types(name);

CREATE INDEX IF NOT EXISTS idx_exams_created_by ON exams(created_by);
CREATE INDEX IF NOT EXISTS idx_exam_questions_exam_id ON exam_questions(exam_id);
CREATE INDEX IF NOT EXISTS idx_exam_questions_original_qid ON exam_questions(original_question_id);
CREATE INDEX IF NOT EXISTS idx_exam_questions_section_id ON exam_questions(section_id);

CREATE INDEX IF NOT EXISTS idx_exam_question_choices_eqid ON exam_question_choices(exam_question_id);
CREATE INDEX IF NOT EXISTS idx_exam_attempts_user_id ON exam_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_exam_attempts_exam_id ON exam_attempts(exam_id);

CREATE INDEX IF NOT EXISTS idx_exam_answers_attempt_id ON exam_answers(exam_attempt_id);
CREATE INDEX IF NOT EXISTS idx_exam_answers_question_id ON exam_answers(exam_question_id);

CREATE INDEX IF NOT EXISTS idx_review_histories_attempt_id ON review_histories(exam_attempt_id);
CREATE INDEX IF NOT EXISTS idx_review_histories_user_id ON review_histories(user_id);
