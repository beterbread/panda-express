import pandas as pd
import random
from datetime import datetime, timedelta

# Retrieve employee_id that are cashiers
employee_id_list = []
df_employee = pd.read_csv('Sheets/employee.csv')
for index, row in df_employee.iterrows():
    if not row['is_manager']:
        employee_id_list.append(row['employee_id'])

# Retrieve customers
customer_id_list = []
df_customer = pd.read_csv('Sheets/customer.csv')
for index, row in df_customer.iterrows():
    customer_id_list.append(row['customer_id'])

# Retrieve meal_id and meal_price
meal_dict = dict()
df_menu = pd.read_csv('Sheets/menu.csv')
for index, row in df_menu.iterrows():
    meal_dict[row['meal_id']] = row['meal_price']

# Retrieve item_id and extra_charge based on categories
item_side_dict = dict()
item_entree_dict = dict()
item_appetizer_dict = dict()
item_drink_dict = dict()
df_item = pd.read_csv('Sheets/item.csv')
for index, row in df_item.iterrows():
    if row['item_category'] == 'Side':
        item_side_dict[row['item_id']] = row['extra_charge']
    elif row['item_category'] == 'Entree':
        item_entree_dict[row['item_id']] = row['extra_charge']
    elif row['item_category'] == 'Appetizers':
        item_appetizer_dict[row['item_id']] = row['extra_charge']
    elif row['item_category'] == 'Drinks':
        item_drink_dict[row['item_id']] = row['extra_charge']

# Initialize order, payment, and junction table dataframes
columns_orders = ['order_id', 'employee_id', 'date_time', 'total_price']
df_orders = pd.DataFrame(columns=columns_orders)

columns_payment = ['payment_id', 'order_id', 'total_paid', 'payment_type']
df_payment = pd.DataFrame(columns=columns_payment)

columns_order_menu = ['order_menu_id', 'order_id', 'meal_id']
df_order_menu = pd.DataFrame(columns=columns_order_menu)

columns_order_item = ['order_item_id', 'order_id', 'item_id']
df_order_item = pd.DataFrame(columns=columns_order_item)

# Set parameters for simulation
total_sales = 0
days = 364
orders_per_day = 250
peak_orders_per_day = 400
start_time = 10 # 10 am
end_time = 21 # 9 pm
payment_types = ['Credit', 'Debit', 'Cash', 'Meal Swipe', 'Gift Card']

order_id_counter = 1
payment_id_counter = 1
order_menu_id_counter = 1
order_item_id_counter = 1

# Sample peak days
peak_days = random.sample(range(days), 2)

# Prepare empty lists to accumulate data for each DataFrame
orders_data = []
payments_data = []
order_menu_data = []
order_items_data = []

# Loop through each day
for day in range(days):
    print(f'Completing day {day + 1}')
    base_date = datetime.now() - timedelta(days=(days - 1 - day))
    orders_today = peak_orders_per_day + random.randint(-50, 50) if day in peak_days else orders_per_day + random.randint(-100, 100)

    for i in range(orders_today):
        # Randomize order time
        order_time = base_date.replace(
            hour=random.randint(start_time, end_time - 1),
            minute=random.randint(0, 59),
            second=random.randint(0, 59)
        )

        # Initialize order total
        total_price = 0
        menu_items = random.randint(1, 3)  # Number of menu items per order

        for j in range(menu_items):
            # Random meal selection
            meal_id, meal_price = random.choice(list(meal_dict.items()))

            # Select individual items for this meal
            side_id = -1
            entree_one_id = -1
            entree_two_id = -1
            entree_three_id = -1
            appetizer_id = -1
            drink_id = -1
            extra_charge = 0

            if meal_id == 1:  # 1 side, 1 entrée
                side_id, side_extra = random.choice(list(item_side_dict.items()))
                entree_one_id, entree_extra = random.choice(list(item_entree_dict.items()))
                extra_charge += (side_extra + entree_extra)
            elif meal_id == 2:  # 1 side, 2 entrées
                side_id, side_extra = random.choice(list(item_side_dict.items()))
                entree_one_id, entree_extra = random.choice(list(item_entree_dict.items()))
                entree_two_id, entree_extra_2 = random.choice(list(item_entree_dict.items()))
                extra_charge += (side_extra + entree_extra + entree_extra_2)
            elif meal_id == 3:  # 1 side, 3 entrées
                side_id, side_extra = random.choice(list(item_side_dict.items()))
                entree_one_id, entree_extra = random.choice(list(item_entree_dict.items()))
                entree_two_id, entree_extra_2 = random.choice(list(item_entree_dict.items()))
                entree_three_id, entree_extra_3 = random.choice(list(item_entree_dict.items()))
                extra_charge += (side_extra + entree_extra + entree_extra_2 + entree_extra_3)
            elif 4 <= meal_id <= 8:  # 1 appetizer
                if meal_id >= 6:
                    appetizer_id, appetizer_extra = 20, 0
                else:
                    appetizer_id, appetizer_extra = random.choice(list(item_appetizer_dict.items()))
                    extra_charge += appetizer_extra
            elif 9 <= meal_id <= 16:  # 1 side or 1 entrée
                if meal_id >= 15:
                    side_id, side_extra = random.choice(list(item_side_dict.items()))
                    extra_charge += side_extra
                elif meal_id >= 12:
                    entree_one_id, entree_extra = -1, -1
                    while entree_extra <= 0:
                        entree_one_id, entree_extra = random.choice(list(item_entree_dict.items()))
                    extra_charge += entree_extra
                else:
                    entree_one_id, entree_extra = -1, -1
                    while entree_extra != 0:
                        entree_one_id, entree_extra = random.choice(list(item_entree_dict.items()))
                    extra_charge += entree_extra
            else: # Drink
                drink_id, drink_extra = random.choice(list(item_drink_dict.items()))
                extra_charge += drink_extra

            # Add items to the order
            if side_id != -1:
                order_items_data.append([order_item_id_counter, order_id_counter, side_id])
                order_item_id_counter += 1
            if entree_one_id != -1:
                order_items_data.append([order_item_id_counter, order_id_counter, entree_one_id])
                order_item_id_counter += 1
            if entree_two_id != -1:
                order_items_data.append([order_item_id_counter, order_id_counter, entree_two_id])
                order_item_id_counter += 1
            if entree_three_id != -1:
                order_items_data.append([order_item_id_counter, order_id_counter, entree_three_id])
                order_item_id_counter += 1
            if appetizer_id != -1:
                order_items_data.append([order_item_id_counter, order_id_counter, appetizer_id])
                order_item_id_counter += 1
            if drink_id != -1:
                order_items_data.append([order_item_id_counter, order_id_counter, drink_id])
                order_item_id_counter += 1

            # Add meal to order_menu
            order_menu_data.append([order_menu_id_counter, order_id_counter, meal_id])
            order_menu_id_counter += 1

            total_price += meal_price + extra_charge

        # Finalize the total price
        total_price = round(total_price, 2)
        total_sales += total_price

        # Append to orders and payment data
        orders_data.append([order_id_counter, random.choice(employee_id_list), random.choice(customer_id_list), order_time, total_price])
        payments_data.append([payment_id_counter, order_id_counter, total_price, random.choice(payment_types)])

        order_id_counter += 1
        payment_id_counter += 1

# Convert accumulated data into DataFrames
df_orders = pd.DataFrame(orders_data, columns=['order_id', 'employee_id', 'customer_id', 'order_time', 'total_price'])
df_payment = pd.DataFrame(payments_data, columns=['payment_id', 'order_id', 'total_price', 'payment_type'])
df_order_menu = pd.DataFrame(order_menu_data, columns=['order_menu_id', 'order_id', 'meal_id'])
df_order_item = pd.DataFrame(order_items_data, columns=['order_item_id', 'order_id', 'item_id'])

# Save DataFrames to CSV
df_orders.to_csv('Sheets/orders.csv', index=False)
df_payment.to_csv('Sheets/payment.csv', index=False)
df_order_menu.to_csv('Sheets/order_menu.csv', index=False)
df_order_item.to_csv('Sheets/order_item.csv', index=False)

total_sales = round(total_sales, 2)
print(f'Total sales {total_sales}')

# # GENERATE SQL FILE FOR ORDERS
# csv_file_path = 'Sheets/orders.csv'
# sql_file_path = 'SQL/create_orders.sql'
#
# df = pd.read_csv(csv_file_path)
#
# with open(sql_file_path, 'w') as f:
#     # Create table query
#     create_table_query = '''
#     DROP TABLE IF EXISTS orders;
#     CREATE TABLE IF NOT EXISTS orders (
#         order_id INTEGER PRIMARY KEY,
#         employee_id INTEGER,
#         order_time TIMESTAMP,
#         total_price DECIMAL(10, 2)
#     );
#     '''
#     f.write(create_table_query + '\n\n')
#
#     # Insert rows from the dataframe
#     for index, row in df.iterrows():
#         insert_query = f'''
#         INSERT INTO orders (order_id, employee_id, order_time, total_price)
#         VALUES ({row['order_id']}, {row['employee_id']}, '{row['order_time']}', {row['total_price']});
#         '''
#         f.write(insert_query + '\n')
#
# print(f"SQL file '{sql_file_path}' created successfully.")
#
# # GENERATE PAYMENT FILE FOR ORDERS
# csv_file_path = 'Sheets/payment.csv'
# sql_file_path = 'SQL/create_payment.sql'
#
# # Read CSV data
# df = pd.read_csv(csv_file_path)
#
# # Write SQL file
# with open(sql_file_path, 'w') as f:
#     # Create table query for Payments with a foreign key to Orders
#     create_table_query = '''
#     DROP TABLE IF EXISTS payment;
#     CREATE TABLE IF NOT EXISTS payment (
#         payment_id INTEGER PRIMARY KEY,
#         order_id INTEGER,
#         total_price DECIMAL(10, 2),
#         payment_type VARCHAR(255),
#         FOREIGN KEY (order_id) REFERENCES orders(order_id)
#     );
#     '''
#     f.write(create_table_query + '\n\n')
#
#     # Insert rows from the dataframe
#     for index, row in df.iterrows():
#         insert_query = f'''
#         INSERT INTO payments (payment_id, order_id, total_price, payment_type)
#         VALUES ({row['payment_id']}, {row['order_id']}, {row['total_price']}, '{row['payment_type']}');
#         '''
#         f.write(insert_query + '\n')
#
# print(f"SQL file '{sql_file_path}' created successfully.")
#
# # Define file paths
# csv_file_path = 'Sheets/order_item.csv'
# sql_file_path = 'SQL/create_order_item.sql'
#
# # Read CSV data
# df = pd.read_csv(csv_file_path)
#
# # Write SQL file
# with open(sql_file_path, 'w') as f:
#     # Create table query for OrderItems with foreign keys to Orders and Items
#     create_table_query = '''
#     DROP TABLE IF EXISTS order_item;
#     CREATE TABLE IF NOT EXISTS order_item (
#         order_item_id INTEGER PRIMARY KEY,
#         order_id INTEGER,
#         item_id INTEGER,
#         FOREIGN KEY (order_id) REFERENCES orders(order_id),
#         FOREIGN KEY (item_id) REFERENCES item(item_id)
#     );
#     '''
#     f.write(create_table_query + '\n\n')
#
#     # Insert rows from the dataframe
#     for index, row in df.iterrows():
#         insert_query = f'''
#         INSERT INTO order_item (order_item_id, order_id, item_id)
#         VALUES ({row['order_item_id']}, {row['order_id']}, {row['item_id']});
#         '''
#         f.write(insert_query + '\n')
#
# print(f"SQL file '{sql_file_path}' created successfully.")
#
# # Define file paths
# csv_file_path = 'Sheets/order_menu.csv'
# sql_file_path = 'SQL/create_order_menu.sql'
#
# # Read CSV data
# df = pd.read_csv(csv_file_path)
#
# # Write SQL file
# with open(sql_file_path, 'w') as f:
#     # Create table query for OrderMenu with foreign keys to Orders and Meals
#     create_table_query = '''
#     DROP TABLE IF EXISTS order_menu;
#     CREATE TABLE IF NOT EXISTS order_menu (
#         order_menu_id INTEGER PRIMARY KEY,
#         order_id INTEGER,
#         meal_id INTEGER,
#         FOREIGN KEY (order_id) REFERENCES orders(order_id),
#         FOREIGN KEY (meal_id) REFERENCES meal(meal_id)
#     );
#     '''
#     f.write(create_table_query + '\n\n')
#
#     # Insert rows from the dataframe
#     for index, row in df.iterrows():
#         insert_query = f'''
#         INSERT INTO order_menu (order_menu_id, order_id, meal_id)
#         VALUES ({row['order_menu_id']}, {row['order_id']}, {row['meal_id']});
#         '''
#         f.write(insert_query + '\n')
#
# print(f"SQL file '{sql_file_path}' created successfully.")