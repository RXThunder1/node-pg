CREATE TABLE companies (
    code VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    description TEXT
);

CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    comp_code VARCHAR REFERENCES companies(code),
    amt DECIMAL(10, 2) NOT NULL,
    paid BOOLEAN DEFAULT FALSE,
    add_date DATE DEFAULT CURRENT_DATE,
    paid_date DATE
);

-- Example data
INSERT INTO companies (code, name, description) VALUES
    ('comp1', 'Company 1', 'Description for Company 1'),
    ('comp2', 'Company 2', 'Description for Company 2');

INSERT INTO invoices (comp_code, amt) VALUES
    ('comp1', 100.00),
    ('comp1', 200.00),
    ('comp2', 150.00);