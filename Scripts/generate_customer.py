import pandas as pd

csv_file_path = 'Sheets/customer.csv'
sql_file_path = 'SQL/create_customer.sql'

df = pd.read_csv(csv_file_path)

with open(sql_file_path, 'w') as f:
    create_table_query = '''
    DROP TABLE IF EXISTS customer CASCADE;
    CREATE TABLE IF NOT EXISTS customer (
        customer_id INTEGER PRIMARY KEY,
        customer_name VARCHAR(255),
        customer_email VARCHAR(255),
        customer_password VARCHAR(255)
    );
    '''
    f.write(create_table_query + '\n\n')

    for index, row in df.iterrows():
        insert_query = f'''
        INSERT INTO customer (customer_id, customer_name, customer_email, customer_password)
        VALUES ({row['customer_id']}, '{row['customer_name']}', '{row['customer_email']}', '{row['customer_password']}');
        '''
        f.write(insert_query + '\n')

print(f"SQL file '{sql_file_path}' created successfully.")