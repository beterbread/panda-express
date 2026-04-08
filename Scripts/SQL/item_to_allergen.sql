
    DROP TABLE IF EXISTS item_to_allergen CASCADE;
    CREATE TABLE IF NOT EXISTS item_to_allergen (
        item_to_allergen_id INTEGER PRIMARY KEY,
        item_id INTEGER,
        allergen_id INTEGER,
        FOREIGN KEY (item_id) REFERENCES item(item_id),
        FOREIGN KEY (allergen_id) REFERENCES allergen(allergen_id)
    );
    


        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (1, 1, 1);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (2, 1, 2);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (3, 1, 3);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (4, 2, 1);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (5, 2, 2);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (6, 2, 3);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (7, 2, 4);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (8, 4, 1);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (9, 4, 2);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (10, 5, 1);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (11, 5, 2);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (12, 5, 5);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (13, 6, 1);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (14, 6, 2);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (15, 6, 3);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (16, 7, 1);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (17, 7, 2);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (18, 8, 1);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (19, 8, 2);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (20, 8, 3);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (21, 9, 1);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (22, 9, 2);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (23, 9, 3);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (24, 10, 2);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (25, 11, 1);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (26, 11, 2);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (27, 11, 4);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (28, 11, 5);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (29, 11, 6);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (30, 11, 7);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (31, 12, 1);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (32, 12, 2);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (33, 12, 3);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (34, 12, 8);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (35, 13, 1);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (36, 13, 2);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (37, 13, 3);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (38, 14, 1);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (39, 14, 2);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (40, 14, 3);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (41, 14, 4);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (42, 14, 5);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (43, 15, 1);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (44, 15, 2);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (45, 15, 3);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (46, 16, 2);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (47, 17, 1);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (48, 17, 2);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (49, 17, 3);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (50, 17, 4);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (51, 17, 5);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (52, 18, 2);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (53, 18, 4);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (54, 18, 5);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (55, 19, 1);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (56, 19, 2);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (57, 19, 3);
        

        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES (58, 20, 2);
        
