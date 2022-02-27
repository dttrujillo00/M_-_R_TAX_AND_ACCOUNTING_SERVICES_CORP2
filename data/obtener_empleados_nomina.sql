SELECT employee_name, payment_type, 
SUM(CASE month WHEN 1 THEN amount ELSE 0 END) AS January, 
SUM(CASE month WHEN 2 THEN amount ELSE 0 END) AS February, 
SUM(CASE month WHEN 3 THEN amount ELSE 0 END) AS March, 
SUM(CASE month WHEN 4 THEN amount ELSE 0 END) AS April, 
SUM(CASE month WHEN 5 THEN amount ELSE 0 END) AS May,
SUM(CASE month WHEN 6 THEN amount ELSE 0 END) AS June, 
SUM(CASE month WHEN 7 THEN amount ELSE 0 END) AS July, 
SUM(CASE month WHEN 8 THEN amount ELSE 0 END) AS August, 
SUM(CASE month WHEN 9 THEN amount ELSE 0 END) AS September, 
SUM(CASE month WHEN 10 THEN amount ELSE 0 END) AS October, 
SUM(CASE month WHEN 11 THEN amount ELSE 0 END) AS November, 
SUM(CASE month WHEN 12 THEN amount ELSE 0 END) AS December, 
SUM(amount)
FROM employee e 
INNER JOIN payroll p ON e.employee_id = p.employee_id 
INNER JOIN payment_type pt ON pt.payment_type_id = p.payment_type_id 
INNER JOIN date d ON p.date_id = d.date_id 
INNER JOIN business b ON b.business_id = e.business_id 
WHERE b.business_name = "Google" AND d.year = 2022
GROUP BY employee_name, payment_type 