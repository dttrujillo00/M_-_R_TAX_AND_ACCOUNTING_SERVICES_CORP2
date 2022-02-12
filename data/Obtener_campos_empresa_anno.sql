SELECT field, SUM( CASE a.is_positive WHEN TRUE THEN amount ELSE -amount END) as amount FROM business b INNER JOIN account a ON b.business_id = a.business_id INNER JOIN date d ON a.date_id = d.date_id INNER JOIN field f ON a.field_id = f.field_id WHERE b.business_name = ? AND d.year = ? GROUP BY field;

