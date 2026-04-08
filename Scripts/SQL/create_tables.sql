-- Creates tables for excel files --
-- orders, payment, order_item, order_menu --

DROP TABLE IF EXISTS orders CASCADE;
CREATE TABLE IF NOT EXISTS orders (
    order_id INTEGER PRIMARY KEY,
    employee_id INTEGER,
    customer_id INTEGER,
    order_time TIMESTAMP,
    total_price DECIMAL(10, 2),
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE SET NULL
);

DROP TABLE IF EXISTS payment CASCADE;
CREATE TABLE IF NOT EXISTS payment (
    payment_id INTEGER PRIMARY KEY,
    order_id INTEGER,
    total_price DECIMAL(10, 2),
    payment_type VARCHAR(255),
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

DROP TABLE IF EXISTS order_item CASCADE;
CREATE TABLE IF NOT EXISTS order_item (
    order_item_id INTEGER PRIMARY KEY,
    order_id INTEGER,
    item_id INTEGER,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (item_id) REFERENCES item(item_id)
);

DROP TABLE IF EXISTS order_menu CASCADE;
    CREATE TABLE IF NOT EXISTS order_menu (
    order_menu_id INTEGER PRIMARY KEY,
    order_id INTEGER,
    meal_id INTEGER,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (meal_id) REFERENCES menu(meal_id)
);