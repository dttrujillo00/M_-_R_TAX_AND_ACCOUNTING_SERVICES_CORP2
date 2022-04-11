SELECT  
SUM(CASE WHEN month < 2 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS January, 
SUM(CASE WHEN month < 3 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS February, 
SUM(CASE WHEN month < 4 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS March, 
SUM(CASE WHEN month < 5 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS April, 
SUM(CASE WHEN month < 6 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS May,
SUM(CASE WHEN month < 7 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS June, 
SUM(CASE WHEN month < 8 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS July, 
SUM(CASE WHEN month < 9 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS August, 
SUM(CASE WHEN month < 10 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS September, 
SUM(CASE WHEN month < 11 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS October, 
SUM(CASE WHEN month < 12 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS November, 
SUM(CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) AS December
FROM business b INNER JOIN account a ON b.business_id = a.business_id INNER JOIN date d ON a.date_id = d.date_id INNER JOIN field f ON a.field_id = f.field_id 
WHERE b.business_name = ? AND year < ? + 1
