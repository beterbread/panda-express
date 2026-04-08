
    DROP TABLE IF EXISTS allergen CASCADE;
    CREATE TABLE IF NOT EXISTS allergen (
        allergen_id INTEGER PRIMARY KEY,
        allergen_name VARCHAR(255)
    );
    


        INSERT INTO allergen (allergen_id, allergen_name)
        VALUES (1, 'soy');
        

        INSERT INTO allergen (allergen_id, allergen_name)
        VALUES (2, 'wheat');
        

        INSERT INTO allergen (allergen_id, allergen_name)
        VALUES (3, 'sesame');
        

        INSERT INTO allergen (allergen_id, allergen_name)
        VALUES (4, 'eggs');
        

        INSERT INTO allergen (allergen_id, allergen_name)
        VALUES (5, 'milk');
        

        INSERT INTO allergen (allergen_id, allergen_name)
        VALUES (6, 'shellfish');
        

        INSERT INTO allergen (allergen_id, allergen_name)
        VALUES (7, 'tree nuts');
        

        INSERT INTO allergen (allergen_id, allergen_name)
        VALUES (8, 'peanuts');
        
