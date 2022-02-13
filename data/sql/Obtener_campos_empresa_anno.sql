SELECT field AS Field, 
SUM(CASE month WHEN 1 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS January, 
SUM(CASE month WHEN 2 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS February, 
SUM(CASE month WHEN 3 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS March, 
SUM(CASE month WHEN 4 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS April, 
SUM(CASE month WHEN 5 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS May,
SUM(CASE month WHEN 6 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS June, 
SUM(CASE month WHEN 7 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS July, 
SUM(CASE month WHEN 8 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS August, 
SUM(CASE month WHEN 9 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS September, 
SUM(CASE month WHEN 10 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS October, 
SUM(CASE month WHEN 11 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS November, 
SUM(CASE month WHEN 12 THEN (CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) ELSE 0 END) AS December,
SUM( CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) AS YDT 
FROM business b INNER JOIN account a ON b.business_id = a.business_id INNER JOIN date d ON a.date_id = d.date_id INNER JOIN field f ON a.field_id = f.field_id 
WHERE b.business_name = ? AND d.year = ? GROUP BY field

