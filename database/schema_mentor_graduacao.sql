CREATE DATABASE IF NOT EXISTS MentorGraducao;
USE MentorGraducao;

-- =========================
-- COURSE
-- =========================
CREATE TABLE Course (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    instituicao VARCHAR(255) NOT NULL
);

-- =========================
-- USER
-- =========================
CREATE TABLE User (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    curso_id INT NOT NULL,

    CONSTRAINT fk_user_course
        FOREIGN KEY (curso_id)
        REFERENCES Course(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

-- =========================
-- SUBJECT
-- =========================
CREATE TABLE Subject (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    codigo VARCHAR(50) NOT NULL,
    ementa TEXT,
    bibliografia TEXT,
    resumo TEXT,
    periodo_recomendado INT
);

-- =========================
-- COURSE SUBJECTS
-- =========================
CREATE TABLE CourseSubjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT NOT NULL,
    subject_id INT NOT NULL,

    CONSTRAINT fk_cs_course
        FOREIGN KEY (course_id)
        REFERENCES Course(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_cs_subject
        FOREIGN KEY (subject_id)
        REFERENCES Subject(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT uq_course_subject
        UNIQUE(course_id, subject_id)
);

-- =========================
-- PREREQUISITE
-- =========================
CREATE TABLE Prerequisite (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject_id INT NOT NULL,
    prerequisite_subject_id INT NOT NULL,

    CONSTRAINT fk_prereq_subject
        FOREIGN KEY (subject_id)
        REFERENCES Subject(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_prereq_required
        FOREIGN KEY (prerequisite_subject_id)
        REFERENCES Subject(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT uq_prerequisite
        UNIQUE(subject_id, prerequisite_subject_id)
);

-- =========================
-- FLOWCHART ITEM
-- =========================
CREATE TABLE FlowchartItem (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    subject_id INT NOT NULL,

    semester_index INT NOT NULL,

    status ENUM('planned', 'completed')
        NOT NULL DEFAULT 'planned',

    CONSTRAINT fk_flowchart_user
        FOREIGN KEY (user_id)
        REFERENCES User(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_flowchart_subject
        FOREIGN KEY (subject_id)
        REFERENCES Subject(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT uq_user_subject
        UNIQUE(user_id, subject_id)
);

-- =========================
-- REVIEW
-- =========================
CREATE TABLE Review (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,
    subject_id INT NOT NULL,

    nota DECIMAL(3,1) NOT NULL,
    resenha TEXT,
    comprovante_url VARCHAR(500),

    created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_review_user
        FOREIGN KEY (user_id)
        REFERENCES User(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_review_subject
        FOREIGN KEY (subject_id)
        REFERENCES Subject(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);