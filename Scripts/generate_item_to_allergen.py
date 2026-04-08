import pandas as pd

csv_file_path = 'Sheets/item_to_allergen.csv'
sql_file_path = 'SQL/item_to_allergen.sql'

df = pd.read_csv(csv_file_path)

with open(sql_file_path, 'w') as f:
    create_table_query = '''
    DROP TABLE IF EXISTS item_to_allergen CASCADE;
    CREATE TABLE IF NOT EXISTS item_to_allergen (
        item_to_allergen_id INTEGER PRIMARY KEY,
        item_id INTEGER,
        allergen_id INTEGER,
        FOREIGN KEY (item_id) REFERENCES item(item_id),
        FOREIGN KEY (allergen_id) REFERENCES allergen(allergen_id)
    );
    '''
    f.write(create_table_query + '\n\n')

    for index, row in df.iterrows():
        insert_query = f'''
        INSERT INTO item_to_allergen(item_to_allergen_id, item_id, allergen_id)
        VALUES ({row['item_to_allergen_id']}, {row['item_id']}, {row['allergen_id']});
        '''
        f.write(insert_query + '\n')

print(f"SQL file '{sql_file_path}' created successfully.")