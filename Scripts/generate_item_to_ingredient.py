import pandas as pd

csv_file_path = 'Sheets/item_to_ingredient.csv'
sql_file_path = 'SQL/create_item_to_ingredient.sql'

df = pd.read_csv(csv_file_path)

with open(sql_file_path, 'w') as f:
    create_table_query = '''
    DROP TABLE IF EXISTS item_to_ingredient CASCADE;
    CREATE TABLE IF NOT EXISTS item_to_ingredient (
        item_to_ingredient_id INTEGER PRIMARY KEY,
        item_id INTEGER,
        ingredient_id INTEGER,
        serving_size DECIMAL(10, 2),
        FOREIGN KEY (item_id) REFERENCES item(item_id),
        FOREIGN KEY (ingredient_id) REFERENCES ingredient(ingredient_id)
    );
    '''
    f.write(create_table_query + '\n\n')

    for index, row in df.iterrows():
        insert_query = f'''
        INSERT INTO item_to_ingredient (item_to_ingredient_id, item_id, ingredient_id, serving_size)
        VALUES ({row['item_to_ingredient_id']}, {row['item_id']}, {row['ingredient_id']}, {row['serving_size']});
        '''
        f.write(insert_query + '\n')

print(f"SQL file '{sql_file_path}' created successfully.")
