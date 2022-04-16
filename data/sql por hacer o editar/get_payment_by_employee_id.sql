﻿SELECT payment_type, SUM(amount) AS amount
FROM payroll p LEFT JOIN employee e ON p.employee_id = e.employee_id LEFT JOIN business b ON e.business_id = b.business_id LEFT JOIN payment_type pt ON p.payment_type_id = pt.payment_type_id LEFT JOIN date d ON p.date_id = d.date_id 
WHERE b.business_id = ? AND d.year = ? AND d.month = ? AND e.employee_id = ? GROUP BY payment_type