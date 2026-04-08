import pandas as pd

csv_file_path = 'Sheets/ingredient.csv'
sql_file_path = 'SQL/create_ingredient.sql'

df = pd.read_csv(csv_file_path)

with open(sql_file_path, 'w') as f:
    create_table_query = '''
    DROP TABLE IF EXISTS ingredient CASCADE;
    CREATE TABLE IF NOT EXISTS ingredient (
        ingredient_id INTEGER PRIMARY KEY,
        ingredient_name VARCHAR(255),
        quantity DECIMAL(10, 2),
        unit_of_measure VARCHAR(50),
        reorder_level INT,
        unit_price DECIMAL(10, 2)
    );
    '''
    f.write(create_table_query + '\n\n')

    for index, row in df.iterrows():
        insert_query = f'''
        INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
        VALUES ({row['ingredient_id']}, '{row['ingredient_name'].replace("'", "''")}', {row['quantity']}, 
        '{row['unit_of_measure']}', {row['reorder_level']}, {row['unit_price']});
        '''
        f.write(insert_query + '\n')

print(f"SQL file '{sql_file_path}' created successfully.")