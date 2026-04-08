import pandas as pd

csv_file_path = 'Sheets/item.csv'
sql_file_path = 'SQL/create_item.sql'

df = pd.read_csv(csv_file_path)

with open(sql_file_path, 'w') as f:
    create_table_query = '''
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
    '''
    f.write(create_table_query + '\n\n')

    for index, row in df.iterrows():
        insert_query = f'''
        INSERT INTO item (item_id, item_category, item_name, extra_charge, 
        calories, total_fat, cholesterol, sodium, total_carb, protein, serving_size)
        VALUES ({row['item_id']}, '{row['item_category']}', '{row['item_name']}', 
        {row['extra_charge']}, {row['calories']}, {row['total_fat']}, {row['cholesterol']}, 
        {row['sodium']}, {row['total_carb']}, {row['protein']}, {row['serving_size']});
        '''
        f.write(insert_query + '\n')

print(f"SQL file '{sql_file_path}' created successfully.")
