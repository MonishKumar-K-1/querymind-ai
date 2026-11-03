PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS EMPLOYEE (
    employee_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    salary REAL NOT NULL CHECK (salary >= 0),
    joining_date TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS CUSTOMER (
    customer_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    region TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS SALES (
    sale_id INTEGER PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    amount REAL NOT NULL CHECK (amount >= 0),
    sale_date TEXT NOT NULL,
    CONSTRAINT fk_sales_customer
      FOREIGN KEY (customer_id) REFERENCES CUSTOMER(customer_id)
      ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_employee_department ON EMPLOYEE(department);
CREATE INDEX IF NOT EXISTS idx_sales_customer_id ON SALES(customer_id);
CREATE INDEX IF NOT EXISTS idx_sales_sale_date ON SALES(sale_date);

INSERT OR IGNORE INTO EMPLOYEE (employee_id, name, department, salary, joining_date) VALUES
(1, 'Aarav Sharma', 'Engineering', 72000, '2022-06-15'),
(2, 'Diya Nair', 'Engineering', 68000, '2023-01-10'),
(3, 'Rohan Iyer', 'Sales', 54000, '2021-09-20'),
(4, 'Ananya Rao', 'HR', 48000, '2023-04-05'),
(5, 'Kabir Mehta', 'Finance', 62000, '2020-11-12'),
(6, 'Meera Joshi', 'Sales', 57000, '2022-02-18'),
(7, 'Ishaan Gupta', 'Engineering', 81000, '2019-07-01'),
(8, 'Sana Khan', 'Marketing', 51000, '2024-01-08'),
(9, 'Arjun Reddy', 'Finance', 65000, '2021-03-22'),
(10, 'Nisha Menon', 'HR', 50000, '2024-05-14');

INSERT OR IGNORE INTO CUSTOMER (customer_id, name, region) VALUES
(1, 'Acme Technologies', 'South'),
(2, 'Global Systems', 'West'),
(3, 'Nexus Solutions', 'North'),
(4, 'Vertex Digital', 'East'),
(5, 'Apex Industries', 'South'),
(6, 'Bluewave Retail', 'West'),
(7, 'Crestline Foods', 'North'),
(8, 'Orion Healthcare', 'East'),
(9, 'Pioneer Logistics', 'South'),
(10, 'Summit Education', 'West');

INSERT OR IGNORE INTO SALES (sale_id, customer_id, amount, sale_date) VALUES
(1, 1, 850000, '2025-01-12'),
(2, 2, 720000, '2025-01-18'),
(3, 3, 680000, '2025-02-03'),
(4, 4, 540000, '2025-02-15'),
(5, 5, 490000, '2025-03-02'),
(6, 1, 320000, '2025-03-14'),
(7, 6, 410000, '2025-03-21'),
(8, 7, 275000, '2025-04-04'),
(9, 8, 630000, '2025-04-19'),
(10, 9, 390000, '2025-05-06'),
(11, 10, 455000, '2025-05-17'),
(12, 2, 185000, '2025-06-01'),
(13, 3, 225000, '2025-06-12'),
(14, 5, 310000, '2025-06-28'),
(15, 8, 195000, '2025-07-09');
