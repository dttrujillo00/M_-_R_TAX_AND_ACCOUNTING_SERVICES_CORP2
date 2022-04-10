Database: [data]
    File name: E:\Dany\Projects\M_-_R_TAX_AND_ACCOUNTING_SERVICES_CORP2\data\data.db
    File size: 65536 bytes
    Page size: 4096
    Encoding: UTF-8
    Auto vacuum: 0
    Tables: 10
    Views: 0
    Virtual Tables: 0
------------------------------------------------------------
Table [account]
    Fields: 6
        [account_id]: INTEGER
        [amount]: REAL
            NOT NULL ON CONFLICT FAIL
        [is_positive]: BOOL
            NOT NULL ON CONFLICT REPLACE
        [field_id]: INTEGER
            NOT NULL ON CONFLICT FAIL
        [business_id]: INTEGER
            NOT NULL ON CONFLICT FAIL
        [date_id]: INTEGER
            NOT NULL ON CONFLICT FAIL
    Indexes: 0
    Triggers: 0
    Table constraints: 
        Primary Key: 
            Fields: [account_id]
            On Conflict: 
        Foreign Keys: 3
          [] ([field_id]) REFERENCES [field]([field_id]) ON DELETE CASCADE ON UPDATE CASCADE NOT DEFERRABLE IMMEDIATE
          [] ([business_id]) REFERENCES [business]([business_id]) ON DELETE CASCADE ON UPDATE CASCADE NOT DEFERRABLE IMMEDIATE
          [] ([date_id]) REFERENCES [date]([date_id]) ON DELETE CASCADE ON UPDATE CASCADE NOT DEFERRABLE IMMEDIATE
        Unique constraints: 0
        Check constraints: 0
Table [account] end
------------------------------------------------------------
Table [business]
    Fields: 2
        [business_id]: INTEGER
        [business_name]: VARCHAR(120)
            NOT NULL ON CONFLICT FAIL
    Indexes: 0
    Triggers: 0
    Table constraints: 
        Primary Key: 
            Fields: [business_id]
            On Conflict: 
        Foreign Keys: 0
        Unique constraints: 0
        Check constraints: 0
Table [business] end
------------------------------------------------------------
Table [business_year]
    Fields: 2
        [business_id]: INT
        [year]: INT(4)
    Indexes: 0
    Triggers: 0
    Table constraints: 
        Primary Key: 
            Fields: 
            On Conflict: 
        Foreign Keys: 1
          [] ([business_id]) REFERENCES [business]([business_id]) ON DELETE CASCADE ON UPDATE CASCADE NOT DEFERRABLE
        Unique constraints: 1
            [] Fields: [business_id];[year] ON CONFLICT FAIL
        Check constraints: 0
Table [business_year] end
------------------------------------------------------------
Table [date]
    Fields: 4
        [date_id]: INTEGER
        [year]: INT(4)
            NOT NULL ON CONFLICT FAIL
        [month]: INT(2)
            NOT NULL ON CONFLICT FAIL
        [day]: INT(2)
    Indexes: 0
    Triggers: 0
    Table constraints: 
        Primary Key: 
            Fields: [date_id]
            On Conflict: 
        Foreign Keys: 0
        Unique constraints: 1
            [] Fields: [year];[month];[day] ON CONFLICT FAIL
        Check constraints: 0
Table [date] end
------------------------------------------------------------
Table [employee]
    Fields: 3
        [employee_id]: INTEGER
        [employee_name]: VARCHAR(120)
            NOT NULL ON CONFLICT FAIL
        [business_id]: INTEGER
            NOT NULL ON CONFLICT FAIL
    Indexes: 0
    Triggers: 0
    Table constraints: 
        Primary Key: 
            Fields: [employee_id]
            On Conflict: 
        Foreign Keys: 1
          [] ([business_id]) REFERENCES [business]([business_id]) ON DELETE CASCADE ON UPDATE CASCADE NOT DEFERRABLE IMMEDIATE
        Unique constraints: 0
        Check constraints: 0
Table [employee] end
------------------------------------------------------------
Table [field]
    Fields: 2
        [field_id]: INTEGER
        [field]: VARCHAR(120)
            NOT NULL ON CONFLICT FAIL
    Indexes: 0
    Triggers: 0
    Table constraints: 
        Primary Key: 
            Fields: [field_id]
            On Conflict: 
        Foreign Keys: 0
        Unique constraints: 0
        Check constraints: 0
Table [field] end
------------------------------------------------------------
Table [payment_type]
    Fields: 2
        [payment_type_id]: INTEGER
        [payment_type]: VARCHAR(60)
            UNIQUE ON CONFLICT FAIL
            NOT NULL ON CONFLICT FAIL
    Indexes: 0
    Triggers: 0
    Table constraints: 
        Primary Key: 
            Fields: [payment_type_id]
            On Conflict: 
        Foreign Keys: 0
        Unique constraints: 0
        Check constraints: 0
Table [payment_type] end
------------------------------------------------------------
Table [payroll]
    Fields: 5
        [payroll_id]: INTEGER
        [amount]: REAL
            NOT NULL ON CONFLICT FAIL
        [payment_type_id]: INTEGER
            NOT NULL ON CONFLICT FAIL
        [employee_id]: INTEGER
            NOT NULL ON CONFLICT FAIL
        [date_id]: INTEGER
            NOT NULL ON CONFLICT FAIL
    Indexes: 0
    Triggers: 0
    Table constraints: 
        Primary Key: 
            Fields: [payroll_id]
            On Conflict: 
        Foreign Keys: 3
          [] ([payment_type_id]) REFERENCES [payment_type]([payment_type_id]) ON DELETE CASCADE ON UPDATE CASCADE NOT DEFERRABLE IMMEDIATE
          [] ([employee_id]) REFERENCES [employee]([employee_id]) ON DELETE CASCADE ON UPDATE CASCADE NOT DEFERRABLE IMMEDIATE
          [] ([date_id]) REFERENCES [date]([date_id]) ON DELETE CASCADE ON UPDATE CASCADE NOT DEFERRABLE IMMEDIATE
        Unique constraints: 0
        Check constraints: 0
Table [payroll] end
------------------------------------------------------------
Table [sqlite_master]
    Fields: 5
        [type]: TEXT
        [name]: TEXT
        [tbl_name]: TEXT
        [rootpage]: INTEGER
        [sql]: TEXT
    Indexes: 0
    Triggers: 0
    Table constraints: 
        Primary Key: 
            Fields: 
            On Conflict: 
        Foreign Keys: 0
        Unique constraints: 0
        Check constraints: 0
Table [sqlite_master] end
------------------------------------------------------------
Table [sqlite_sequence]
    Fields: 2
        [name]: 
        [seq]: 
    Indexes: 0
    Triggers: 0
    Table constraints: 
        Primary Key: 
            Fields: 
            On Conflict: 
        Foreign Keys: 0
        Unique constraints: 0
        Check constraints: 0
Table [sqlite_sequence] end
------------------------------------------------------------
