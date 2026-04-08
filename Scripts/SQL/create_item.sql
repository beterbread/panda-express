
    DROP TABLE IF EXISTS item CASCADE;
    CREATE TABLE IF NOT EXISTS item (
        item_id INTEGER PRIMARY KEY,
        item_category VARCHAR(50),
        item_name VARCHAR(255),
        extra_charge DECIMAL(10, 2),
        calories INTEGER,
        total_fat DECIMAL(10, 2),
        cholesterol DECIMAL(10, 2),
        sodium DECIMAL(10, 2),
        total_carb DECIMAL(10, 2),
        protein DECIMAL(10, 2),
        serving_size DECIMAL(10, 2)    
    );
    


        INSERT INTO item (item_id, item_category, item_name, extra_charge, 
        calories, total_fat, cholesterol, sodium, total_carb, protein, serving_size)
        VALUES (1, 'Side', 'Chow Mein', 
        0.0, 500, 23.0, 0, 
        980.0, 61.0, 18.0, 11.0);
        

        INSERT INTO item (item_id, item_category, item_name, extra_charge, 
        calories, total_fat, cholesterol, sodium, total_carb, protein, serving_size)
        VALUES (2, 'Side', 'Fried Rice', 
        0.0, 530, 16.0, 150, 
        820.0, 82.0, 12.0, 11.0);
        

        INSERT INTO item (item_id, item_category, item_name, extra_charge, 
        calories, total_fat, cholesterol, sodium, total_carb, protein, serving_size)
        VALUES (3, 'Side', 'Steamed Rice', 
        0.0, 380, 0.0, 0, 
        0.0, 86.0, 7.0, 11.0);
        

        INSERT INTO item (item_id, item_category, item_name, extra_charge, 
        calories, total_fat, cholesterol, sodium, total_carb, protein, serving_size)
        VALUES (4, 'Side', 'Super Greens', 
        0.0, 70, 0.5, 0, 
        530.0, 13.0, 4.0, 10.0);
        

        INSERT INTO item (item_id, item_category, item_name, extra_charge, 
        calories, total_fat, cholesterol, sodium, total_carb, protein, serving_size)
        VALUES (5, 'Entree', 'Beijing Beef', 
        0.0, 690, 40.0, 65, 
        890.0, 57.0, 26.0, 5.6);
        

        INSERT INTO item (item_id, item_category, item_name, extra_charge, 
        calories, total_fat, cholesterol, sodium, total_carb, protein, serving_size)
        VALUES (6, 'Entree', 'Broccoli Beef', 
        0.0, 130, 4.0, 15, 
        710.0, 13.0, 10.0, 5.44);
        

        INSERT INTO item (item_id, item_category, item_name, extra_charge, 
        calories, total_fat, cholesterol, sodium, total_carb, protein, serving_size)
        VALUES (7, 'Entree', 'Black Pepper Sirloin Steak', 
        0.0, 180, 2.0, 40, 
        750.0, 10.0, 19.0, 5.1);
        

        INSERT INTO item (item_id, item_category, item_name, extra_charge, 
        calories, total_fat, cholesterol, sodium, total_carb, protein, serving_size)
        VALUES (8, 'Entree', 'Black Pepper Chicken', 
        0.0, 250, 14.0, 120, 
        930.0, 12.0, 19.0, 6.3);
        

        INSERT INTO item (item_id, item_category, item_name, extra_charge, 
        calories, total_fat, cholesterol, sodium, total_carb, protein, serving_size)
        VALUES (9, 'Entree', 'Grilled Teriyaki Chicken', 
        0.0, 299, 12.8, 110, 
        530.1, 8.2, 36.1, 6.0);
        

        INSERT INTO item (item_id, item_category, item_name, extra_charge, 
        calories, total_fat, cholesterol, sodium, total_carb, protein, serving_size)
        VALUES (10, 'Entree', 'Honey Sesame Chicken Breast', 
        0.0, 420, 22.0, 45, 
        480.0, 40.0, 16.0, 5.3);
        

        INSERT INTO item (item_id, item_category, item_name, extra_charge, 
        calories, total_fat, cholesterol, sodium, total_carb, protein, serving_size)
        VALUES (11, 'Entree', 'Honey Walnut Shrimp', 
        1.5, 370, 23.0, 110, 
        470.0, 27.0, 14.0, 4.39);
        

        INSERT INTO item (item_id, item_category, item_name, extra_charge, 
        calories, total_fat, cholesterol, sodium, total_carb, protein, serving_size)
        VALUES (12, 'Entree', 'Kung Pao Chicken', 
        0.0, 280, 18.0, 105, 
        800.0, 12.0, 18.0, 6.74);
        

        INSERT INTO item (item_id, item_category, item_name, extra_charge, 
        calories, total_fat, cholesterol, sodium, total_carb, protein, serving_size)
        VALUES (13, 'Entree', 'Mushroom Chicken', 
        0.0, 220, 13.0, 100, 
        760.0, 9.0, 17.0, 5.7);
        

        INSERT INTO item (item_id, item_category, item_name, extra_charge, 
        calories, total_fat, cholesterol, sodium, total_carb, protein, serving_size)
        VALUES (14, 'Entree', 'The Original Orange Chicken', 
        0.0, 420, 21.0, 95, 
        620.0, 43.0, 15.0, 5.92);
        

        INSERT INTO item (item_id, item_category, item_name, extra_charge, 
        calories, total_fat, cholesterol, sodium, total_carb, protein, serving_size)
        VALUES (15, 'Entree', 'String Bean Chicken Breast', 
        0.0, 170, 7.0, 35, 
        740.0, 13.0, 15.0, 5.6);
        

        INSERT INTO item (item_id, item_category, item_name, extra_charge, 
        calories, total_fat, cholesterol, sodium, total_carb, protein, serving_size)
        VALUES (16, 'Entree', 'Sweet Fire Chicken Breast', 
        0.0, 440, 18.0, 45, 
        370.0, 53.0, 17.0, 5.8);
        

        INSERT INTO item (item_id, item_category, item_name, extra_charge, 
        calories, total_fat, cholesterol, sodium, total_carb, protein, serving_size)
        VALUES (17, 'Appetizers', 'Chicken Eggroll', 
        0.0, 200, 12.0, 20, 
        390.0, 16.0, 8.0, 2.75);
        

        INSERT INTO item (item_id, item_category, item_name, extra_charge, 
        calories, total_fat, cholesterol, sodium, total_carb, protein, serving_size)
        VALUES (18, 'Appetizers', 'Cream Cheese Rangoon', 
        0.0, 190, 8.0, 180, 
        180.0, 24.0, 5.0, 2.4);
        

        INSERT INTO item (item_id, item_category, item_name, extra_charge, 
        calories, total_fat, cholesterol, sodium, total_carb, protein, serving_size)
        VALUES (19, 'Appetizers', 'Vegetable Spring Roll', 
        0.0, 160, 7.0, 0, 
        540.0, 22.0, 4.0, 3.5);
        

        INSERT INTO item (item_id, item_category, item_name, extra_charge, 
        calories, total_fat, cholesterol, sodium, total_carb, protein, serving_size)
        VALUES (20, 'Appetizers', 'Apple Pie Roll', 
        0.0, 150, 3.0, 0, 
        90.0, 30.0, 2.0, 1.94);
        

        INSERT INTO item (item_id, item_category, item_name, extra_charge, 
        calories, total_fat, cholesterol, sodium, total_carb, protein, serving_size)
        VALUES (21, 'Drinks', 'Diet Pepsi', 
        0.0, 0, 0.0, 0, 
        0.0, 0.0, 0.0, 12.0);
        

        INSERT INTO item (item_id, item_category, item_name, extra_charge, 
        calories, total_fat, cholesterol, sodium, total_carb, protein, serving_size)
        VALUES (22, 'Drinks', 'Mountain Dew', 
        0.0, 160, 0.0, 0, 
        0.0, 44.0, 0.0, 12.0);
        

        INSERT INTO item (item_id, item_category, item_name, extra_charge, 
        calories, total_fat, cholesterol, sodium, total_carb, protein, serving_size)
        VALUES (23, 'Drinks', 'Lipton Brisk Raspberry Iced Tea', 
        0.0, 80, 0.0, 0, 
        0.0, 20.0, 0.0, 12.0);
        

        INSERT INTO item (item_id, item_category, item_name, extra_charge, 
        calories, total_fat, cholesterol, sodium, total_carb, protein, serving_size)
        VALUES (24, 'Drinks', 'Tropicana Lemonade', 
        0.0, 280, 0.0, 0, 
        0.0, 71.0, 0.0, 22.0);
        
