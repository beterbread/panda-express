
    DROP TABLE IF EXISTS ingredient CASCADE;
    CREATE TABLE IF NOT EXISTS ingredient (
        ingredient_id INTEGER PRIMARY KEY,
        ingredient_name VARCHAR(255),
        quantity DECIMAL(10, 2),
        unit_of_measure VARCHAR(50),
        reorder_level INT,
        unit_price DECIMAL(10, 2)
    );
    


        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (1, 'cabbage', 5, 
        'lbs', 10, 1.5);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (2, 'enriched wheat flour', 80, 
        'lbs', 20, 1.0);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (3, 'water', 100, 
        'gallons', 10, 0.01);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (4, 'onion', 30, 
        'lbs', 10, 0.6);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (5, 'soybean oil', 25, 
        'liters', 5, 3.5);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (6, 'celery', 20, 
        'lbs', 5, 1.5);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (7, 'cooked white rice', 60, 
        'lbs', 15, 2.0);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (8, 'liquid eggs', 20, 
        'quarts', 5, 4.5);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (9, 'peas', 30, 
        'lbs', 10, 1.8);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (10, 'carrots', 50, 
        'lbs', 15, 0.7);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (11, 'green onions', 25, 
        'bunches', 5, 1.0);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (12, 'broccoli', 30, 
        'lbs', 30, 2.0);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (13, 'kale', 20, 
        'lbs', 5, 1.5);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (14, 'beef', 40, 
        'lbs', 15, 6.0);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (15, 'sugar', 60, 
        'lbs', 20, 0.5);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (16, 'red bell pepper', 20, 
        'lbs', 5, 1.8);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (17, 'modified food starch', 25, 
        'lbs', 5, 1.5);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (18, 'distilled vinegar', 10, 
        'liters', 5, 1.0);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (19, 'angus steak', 10, 
        'lbs', 5, 12.0);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (20, 'mushrooms', 25, 
        'lbs', 5, 3.0);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (21, 'bell pepper', 15, 
        'lbs', 5, 1.5);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (22, 'tomato paste', 15, 
        'cans', 5, 1.0);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (23, 'miso paste', 10, 
        'lbs', 3, 4.0);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (24, 'soy sauce powder', 20, 
        'lbs', 5, 3.0);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (25, 'modified corn starch', 15, 
        'lbs', 5, 1.5);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (26, 'black pepper powder', 10, 
        'lbs', 5, 3.0);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (27, 'dark meat chicken', 30, 
        'lbs', 10, 5.0);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (28, 'salt', 10, 
        'lbs', 10, 0.2);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (29, 'modified starch', 20, 
        'lbs', 5, 2.0);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (30, 'spices', 30, 
        'lbs', 10, 2.5);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (31, 'toasted sesame oil', 10, 
        'liters', 2, 6.0);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (32, 'soy sauce', 10, 
        'liters', 3, 3.0);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (33, 'chicken breast strips', 40, 
        'lbs', 10, 6.0);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (34, 'green beans', 30, 
        'lbs', 10, 1.2);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (35, 'yellow bell pepper', 20, 
        'lbs', 5, 1.5);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (36, 'corn starch', 20, 
        'lbs', 5, 2.0);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (37, 'shrimp', 5, 
        'lbs', 10, 8.0);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (38, 'rice', 60, 
        'lbs', 20, 1.5);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (39, 'rice flour', 80, 
        'lbs', 20, 0.5);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (40, 'glazed walnuts', 15, 
        'lbs', 5, 10.0);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (41, 'potato dextrin', 15, 
        'lbs', 5, 3.0);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (42, 'zucchini', 20, 
        'lbs', 5, 1.2);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (43, 'roasted peanuts', 25, 
        'lbs', 5, 2.5);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (44, 'potato starch', 20, 
        'lbs', 5, 2.0);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (45, 'chicken breast', 40, 
        'lbs', 15, 6.0);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (46, 'chicken breast bites', 30, 
        'lbs', 10, 5.0);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (47, 'pineapple chunks', 20, 
        'cans', 5, 1.5);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (48, 'bleached wheat flour', 10, 
        'lbs', 20, 1.0);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (49, 'red jalapenos', 1, 
        'lbs', 3, 1.5);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (50, 'bleached enriched flour', 80, 
        'lbs', 20, 1.0);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (51, 'napa cabbage', 20, 
        'lbs', 5, 1.5);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (52, 'mung bean vermicelli', 10, 
        'lbs', 5, 2.5);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (53, 'durum flour', 30, 
        'lbs', 10, 1.0);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (54, 'cream cheese', 10, 
        'lbs', 3, 4.0);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (55, 'egg', 60, 
        'count', 20, 0.1);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (56, 'wheat flour', 80, 
        'lbs', 20, 1.0);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (57, 'apple', 40, 
        'lbs', 10, 1.0);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (58, 'wheat gluten', 15, 
        'lbs', 5, 3.0);
        

        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES (59, 'cinnamon', 3, 
        'lbs', 5, 4.0);
        
