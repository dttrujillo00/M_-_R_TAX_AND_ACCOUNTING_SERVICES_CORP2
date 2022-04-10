SELECT  
SUM(CASE WHEN month < 1 OR year < ? THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS January, 
SUM(CASE WHEN month < 2 OR year < ? THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS February, 
SUM(CASE WHEN month < 3 OR year < ? THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS March, 
SUM(CASE WHEN month < 4 OR year < ? THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS April, 
SUM(CASE WHEN month < 5 OR year < ? THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS May,
SUM(CASE WHEN month < 6 OR year < ? THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS June, 
SUM(CASE WHEN month < 7 OR year < ? THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS July, 
SUM(CASE WHEN month < 8 OR year < ? THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS August, 
SUM(CASE WHEN month < 9 OR year < ? THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS September, 
SUM(CASE WHEN month < 10 OR year < ? THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS October, 
SUM(CASE WHEN month < 11 OR year < ? THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS November, 
SUM(CASE WHEN month < 12 OR year < ? THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS December,
SUM(CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) AS YDT 
FROM business b INNER JOIN account a ON b.business_id = a.business_id INNER JOIN date d ON a.date_id = d.date_id INNER JOIN field f ON a.field_id = f.field_id 
WHERE b.business_name = ?
