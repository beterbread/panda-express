
    DROP TABLE IF EXISTS menu CASCADE;
    CREATE TABLE IF NOT EXISTS menu (
        meal_id INTEGER PRIMARY KEY,
        meal_name VARCHAR(50),
        meal_size VARCHAR(50),
        meal_type VARCHAR(50),
        meal_price DECIMAL(10, 2)
    );
    


        INSERT INTO menu (meal_id, meal_name, meal_size, meal_type, meal_price)
        VALUES (1, 'Bowl', 'nan', 
        'nan', 8.3);
        

        INSERT INTO menu (meal_id, meal_name, meal_size, meal_type, meal_price)
        VALUES (2, 'Plate', 'nan', 
        'nan', 9.8);
        

        INSERT INTO menu (meal_id, meal_name, meal_size, meal_type, meal_price)
        VALUES (3, 'Bigger Plate', 'nan', 
        'nan', 11.3);
        

        INSERT INTO menu (meal_id, meal_name, meal_size, meal_type, meal_price)
        VALUES (4, 'Appetizers', 'Small', 
        'nan', 2.0);
        

        INSERT INTO menu (meal_id, meal_name, meal_size, meal_type, meal_price)
        VALUES (5, 'Appetizers', 'Large', 
        'nan', 11.2);
        

        INSERT INTO menu (meal_id, meal_name, meal_size, meal_type, meal_price)
        VALUES (6, 'Appetizers', 'Small', 
        'Apple Pie Roll', 2.0);
        

        INSERT INTO menu (meal_id, meal_name, meal_size, meal_type, meal_price)
        VALUES (7, 'Appetizers', 'Medium', 
        'Apple Pie Roll', 6.2);
        

        INSERT INTO menu (meal_id, meal_name, meal_size, meal_type, meal_price)
        VALUES (8, 'Appetizers', 'Large', 
        'Apple Pie Roll', 8.0);
        

        INSERT INTO menu (meal_id, meal_name, meal_size, meal_type, meal_price)
        VALUES (9, 'A La Carte', 'Small', 
        'Entree', 5.2);
        

        INSERT INTO menu (meal_id, meal_name, meal_size, meal_type, meal_price)
        VALUES (10, 'A La Carte', 'Medium', 
        'Entree', 8.5);
        

        INSERT INTO menu (meal_id, meal_name, meal_size, meal_type, meal_price)
        VALUES (11, 'A La Carte', 'Large', 
        'Entree', 11.2);
        

        INSERT INTO menu (meal_id, meal_name, meal_size, meal_type, meal_price)
        VALUES (12, 'A La Carte', 'Small', 
        'Entree Premium', 6.7);
        

        INSERT INTO menu (meal_id, meal_name, meal_size, meal_type, meal_price)
        VALUES (13, 'A La Carte', 'Medium', 
        'Entree Premium', 11.5);
        

        INSERT INTO menu (meal_id, meal_name, meal_size, meal_type, meal_price)
        VALUES (14, 'A La Carte', 'Large', 
        'Entree Premium', 15.7);
        

        INSERT INTO menu (meal_id, meal_name, meal_size, meal_type, meal_price)
        VALUES (15, 'A La Carte', 'Medium', 
        'Side', 4.4);
        

        INSERT INTO menu (meal_id, meal_name, meal_size, meal_type, meal_price)
        VALUES (16, 'A La Carte', 'Large', 
        'Side', 5.4);
        

        INSERT INTO menu (meal_id, meal_name, meal_size, meal_type, meal_price)
        VALUES (17, 'Drinks', 'Small', 
        'nan', 2.1);
        

        INSERT INTO menu (meal_id, meal_name, meal_size, meal_type, meal_price)
        VALUES (18, 'Drinks', 'Medium', 
        'nan', 2.3);
        

        INSERT INTO menu (meal_id, meal_name, meal_size, meal_type, meal_price)
        VALUES (19, 'Drinks', 'Large', 
        'nan', 2.5);
        
