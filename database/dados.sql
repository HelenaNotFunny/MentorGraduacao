SET NAMES 'utf8mb4';
USE MentorGraducao;

INSERT INTO Course (nome, instituicao)
VALUES
('Ciência da Computação', 'UFRN'),
('Engenharia de Software', 'UFRN');

-- =====================
-- USER
-- =====================

INSERT INTO User (nome, email, senha_hash, curso_id)
VALUES
(
    'Admin',
    'admin@test.com',
    '$2b$12$ExemploHashAdmin',
    1
),
(
    'Maria',
    'maria@test.com',
    '$2b$12$ExemploHashMaria',
    1
);

INSERT INTO Subject
(
    nome,
    codigo,
    ementa,
    bibliografia,
    resumo,
    periodo_recomendado
)
VALUES
('Introdução à Computação', 'IMD0001',
 'Ementa da disciplina Introdução à Computação.',
 'Bibliografia básica da disciplina Introdução à Computação.',
 'Resumo dos principais tópicos de Introdução à Computação.', 1),

('Programação I', 'IMD0002',
 'Ementa da disciplina Programação I.',
 'Bibliografia básica da disciplina Programação I.',
 'Resumo dos principais tópicos de Programação I.', 1),

('Matemática Discreta', 'IMD0003',
 'Ementa da disciplina Matemática Discreta.',
 'Bibliografia básica da disciplina Matemática Discreta.',
 'Resumo dos principais tópicos de Matemática Discreta.', 1),

('Cálculo I', 'IMD0004',
 'Ementa da disciplina Cálculo I.',
 'Bibliografia básica da disciplina Cálculo I.',
 'Resumo dos principais tópicos de Cálculo I.', 1),

('Álgebra Linear', 'IMD0005',
 'Ementa da disciplina Álgebra Linear.',
 'Bibliografia básica da disciplina Álgebra Linear.',
 'Resumo dos principais tópicos de Álgebra Linear.', 1),

('Programação II', 'IMD0006',
 'Ementa da disciplina Programação II.',
 'Bibliografia básica da disciplina Programação II.',
 'Resumo dos principais tópicos de Programação II.', 2),

('Estruturas de Dados', 'IMD0007',
 'Ementa da disciplina Estruturas de Dados.',
 'Bibliografia básica da disciplina Estruturas de Dados.',
 'Resumo dos principais tópicos de Estruturas de Dados.', 2),

('Cálculo II', 'IMD0008',
 'Ementa da disciplina Cálculo II.',
 'Bibliografia básica da disciplina Cálculo II.',
 'Resumo dos principais tópicos de Cálculo II.', 2),

('Lógica para Computação', 'IMD0009',
 'Ementa da disciplina Lógica para Computação.',
 'Bibliografia básica da disciplina Lógica para Computação.',
 'Resumo dos principais tópicos de Lógica para Computação.', 2),

('Banco de Dados', 'IMD0010',
 'Ementa da disciplina Banco de Dados.',
 'Bibliografia básica da disciplina Banco de Dados.',
 'Resumo dos principais tópicos de Banco de Dados.', 3),

('Engenharia de Software', 'IMD0011',
 'Ementa da disciplina Engenharia de Software.',
 'Bibliografia básica da disciplina Engenharia de Software.',
 'Resumo dos principais tópicos de Engenharia de Software.', 3),

('Redes de Computadores', 'IMD0012',
 'Ementa da disciplina Redes de Computadores.',
 'Bibliografia básica da disciplina Redes de Computadores.',
 'Resumo dos principais tópicos de Redes de Computadores.', 4),

('Inteligência Artificial', 'IMD0013',
 'Ementa da disciplina Inteligência Artificial.',
 'Bibliografia básica da disciplina Inteligência Artificial.',
 'Resumo dos principais tópicos de Inteligência Artificial.', 4);

INSERT INTO CourseSubjects (course_id, subject_id)
VALUES
(1,1),
(1,2),
(1,3),
(1,4),
(1,5),
(1,6),
(1,7),
(1,8),
(1,9),
(1,10),
(1,11),
(1,12),
(1,13);

INSERT INTO Prerequisite
(subject_id, prerequisite_subject_id)
VALUES
-- Prog II precisa de Prog I
(6,2),

-- Estruturas de Dados precisa de Prog II
(7,6),

-- Cálculo II precisa de Cálculo I
(8,4),

-- Banco de Dados precisa de Estruturas de Dados
(10,7),

-- Engenharia de Software precisa de Prog II
(11,6),

-- Redes precisa de Estruturas de Dados
(12,7),

-- IA precisa de Estruturas de Dados
(13,7),

-- IA precisa de Lógica
(13,9);