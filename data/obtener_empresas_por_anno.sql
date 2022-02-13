 SELECT DISTINCT b.business_id, b.business_name 
 FROM business b 
 LEFT JOIN employee e ON e.business_id = b.business_id 
 LEFT JOIN payroll p ON e.employee_id = p.employee_id 
 LEFT JOIN date de ON de.date_id = p.date_id 
 LEFT JOIN account a ON a.business_id = b.business_id 
 LEFT JOIN date da ON da.date_id = a.date_id 
 WHERE de.year = ? OR da.year = ?