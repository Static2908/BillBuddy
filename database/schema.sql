-- BillBuddy Day-1 schema reference for manual database bootstrap.
-- In development you can use spring.jpa.hibernate.ddl-auto=update from JPA entities.
-- Do not repeatedly apply this script over an existing schema managed by ddl-auto.

CREATE TABLE IF NOT EXISTS users (
    id BIGINT NOT NULL AUTO_INCREMENT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL,
    CONSTRAINT pk_users PRIMARY KEY (id),
    CONSTRAINT uk_users_email UNIQUE (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS bills (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    utility_type VARCHAR(20) NOT NULL,
    provider_name VARCHAR(100) NOT NULL,
    billing_period DATE NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    usage_amount DECIMAL(12,3) NULL,
    usage_unit VARCHAR(20) NULL,
    due_date DATE NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'UNPAID',
    created_at DATETIME NOT NULL,
    CONSTRAINT pk_bills PRIMARY KEY (id),
    CONSTRAINT fk_bills_users FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_bills_user_billing_period ON bills(user_id, billing_period);

CREATE TABLE IF NOT EXISTS bill_line_items (
    id BIGINT NOT NULL AUTO_INCREMENT,
    bill_id BIGINT NOT NULL,
    description VARCHAR(100) NOT NULL,
    category VARCHAR(40) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    CONSTRAINT pk_bill_line_items PRIMARY KEY (id),
    CONSTRAINT fk_line_items_bills
        FOREIGN KEY (bill_id) REFERENCES bills(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
