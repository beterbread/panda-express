import pandas as pd

csv_file_path = 'Sheets/menu.csv'
sql_file_path = 'SQL/create_menu.sql'

df = pd.read_csv(csv_file_path)

with open(sql_file_path, 'w') as f:
    create_table_query = '''
    DROP TABLE IF EXISTS menu CASCADE;
    CREATE TABLE IF NOT EXISTS menu (
        meal_id INTEGER PRIMARY KEY,
        meal_name VARCHAR(50),
        meal_size VARCHAR(50),
        meal_type VARCHAR(50),
        meal_price DECIMAL(10, 2)
    );
    '''
    f.write(create_table_query + '\n\n')

    for index, row in df.iterrows():
        insert_query = f'''
        INSERT INTO menu (meal_id, meal_name, meal_size, meal_type, meal_price)
        VALUES ({row['meal_id']}, '{row['meal_name']}', '{row['meal_size']}', 
        '{row['meal_type']}', {row['meal_price']});
        '''
        f.write(insert_query + '\n')

print(f"SQL file '{sql_file_path}' created successfully.")
