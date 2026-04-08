import pandas as pd

csv_file_path = 'Sheets/allergen.csv'
sql_file_path = 'SQL/create_allergen.sql'

df = pd.read_csv(csv_file_path)

with open(sql_file_path, 'w') as f:
    create_table_query = '''
    DROP TABLE IF EXISTS allergen CASCADE;
    CREATE TABLE IF NOT EXISTS allergen (
        allergen_id INTEGER PRIMARY KEY,
        allergen_name VARCHAR(255)
    );
    '''
    f.write(create_table_query + '\n\n')

    for index, row in df.iterrows():
        insert_query = f'''
        INSERT INTO allergen (allergen_id, allergen_name)
        VALUES ({row['allergen_id']}, '{row['allergen_name'].replace("'", "''")}');
        '''
        f.write(insert_query + '\n')

print(f"SQL file '{sql_file_path}' created successfully.")
