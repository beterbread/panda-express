import pandas as pd

csv_file_path = 'Sheets/employee.csv'
sql_file_path = 'SQL/create_employee.sql'

df = pd.read_csv(csv_file_path)

with open(sql_file_path, 'w') as f:
    create_table_query = '''
    DROP TABLE IF EXISTS employee CASCADE;
    CREATE TABLE IF NOT EXISTS employee (
        employee_id INTEGER PRIMARY KEY,
        employee_name VARCHAR(255),
        is_manager BOOLEAN
    );
    '''
    f.write(create_table_query + '\n\n')

    for index, row in df.iterrows():
        insert_query = f'''
        INSERT INTO employee (employee_id, employee_name, is_manager)
        VALUES ({row['employee_id']}, '{row['employee_name'].replace("'", "''")}', {str(row['is_manager']).upper()});
        '''
        f.write(insert_query + '\n')

print(f"SQL file '{sql_file_path}' created successfully.")
