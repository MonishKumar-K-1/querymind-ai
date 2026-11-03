-- 1. Employees with salary above the company average
SELECT employee_id, name, department, salary
FROM EMPLOYEE
WHERE salary > (SELECT AVG(salary) FROM EMPLOYEE)
ORDER BY salary DESC;

-- 2. Average salary by department
SELECT department, ROUND(AVG(salary), 2) AS average_salary
FROM EMPLOYEE
GROUP BY department
ORDER BY average_salary DESC;

-- 3. Total sales by customer (JOIN + aggregation)
SELECT c.customer_id, c.name, SUM(s.amount) AS total_sales
FROM CUSTOMER c
JOIN SALES s ON s.customer_id = c.customer_id
GROUP BY c.customer_id, c.name
ORDER BY total_sales DESC;

-- 4. Regions with total sales greater than 1,000,000 (HAVING)
SELECT c.region, SUM(s.amount) AS regional_sales
FROM CUSTOMER c
JOIN SALES s ON s.customer_id = c.customer_id
GROUP BY c.region
HAVING SUM(s.amount) > 1000000
ORDER BY regional_sales DESC;

-- 5. Customers with sales above the average sale amount
SELECT customer_id, name
FROM CUSTOMER
WHERE customer_id IN (
    SELECT customer_id
    FROM SALES
    GROUP BY customer_id
    HAVING SUM(amount) > (SELECT AVG(amount) FROM SALES)
);
