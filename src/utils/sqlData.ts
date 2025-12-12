import alasql from 'alasql';

export const initDatabase = () => {
    // Create tables
    alasql('CREATE TABLE IF NOT EXISTS experience (id INT, company STRING, role STRING, year_start INT, year_end STRING, description STRING)');
    alasql('CREATE TABLE IF NOT EXISTS skills (id INT, category STRING, name STRING)');
    alasql('CREATE TABLE IF NOT EXISTS projects (id INT, name STRING, description STRING, stack STRING, status STRING)');
    alasql('CREATE TABLE IF NOT EXISTS education (id INT, degree STRING, school STRING, year INT)');

    // Clear existing data to avoid duplicates on hot reload
    alasql('DELETE FROM experience');
    alasql('DELETE FROM skills');
    alasql('DELETE FROM projects');
    alasql('DELETE FROM education');

    // Insert Experience
    alasql(`INSERT INTO experience VALUES 
        (1, 'SICOOB', 'AI Engineer', 2024, 'Present', 'Developed end-to-end solution for banking data classification in Databricks. Designed/implemented robust PySpark pipelines (Bronze/Silver/Gold layers). Trained logistic regression models for transaction classification. Automated workflows to MongoDB.'),
        (2, 'GlobalWeb', 'Full Stack Developer', 2022, 2024, 'Maintained legacy systems (JSF/PrimeFaces, JSP, Angular, Spring, JBoss). Optimized APIs/web apps. Contributed to frontend architecture/components and design system. Executed JUnit/Mockito tests. Mentored interns through workshops.')
    `);

    // Insert Skills
    alasql(`INSERT INTO skills VALUES 
        (1, 'Languages', 'Python'), (2, 'Languages', 'Java'), (3, 'Languages', 'TypeScript'), (4, 'Languages', 'SQL'),
        (5, 'Data', 'PySpark'), (6, 'Data', 'Databricks'), (7, 'Data', 'MongoDB'), (8, 'Data', 'Data Governance'),
        (9, 'AI', 'Machine Learning'), (10, 'AI', 'Logistic Regression'), (11, 'AI', 'Predictive Models'),
        (12, 'Web', 'Angular'), (13, 'Web', 'Spring Boot'), (14, 'Web', 'JSF (PrimeFaces)'), (15, 'Web', 'JBoss'),
        (16, 'Testing', 'JUnit'), (17, 'Testing', 'Mockito')
    `);

    // Insert Projects
    alasql(`INSERT INTO projects VALUES 
        (1, 'X Tweet Mental Analyser', 'Analyzes mental health indicators in Tweets using NLP/AI. Features interactive dashboard.', 'Python, NLP, Streamlit', 'Public on GitHub'),
        (2, 'Vocacional', 'Vocational assessment platform based on RIASEC model and CBO database.', 'React, Node.js, RIASEC Model', 'Public on GitHub'),
        (3, 'Simple Compiler', 'Web-based IDE for a custom programming language. Real-time execution, AST visualization, and debugging.', 'Python (FastAPI), JavaScript (WebSocket), Docker', 'Public on GitHub')
    `);

    // Insert Education
    alasql(`INSERT INTO education VALUES 
        (1, 'Bachelor in Computer Science', 'IESB', '2021-2025'),
        (2, 'Technician Degree - Software Development', 'IFB', '2018-2021')
    `);
};

export const runQuery = (query: string): any => {
    try {
        return alasql(query);
    } catch (e: any) {
        return { error: e.message };
    }
};
