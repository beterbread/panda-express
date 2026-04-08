import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import pkg from "pg";
const { Pool } = pkg;
import { OpenAI } from "openai";
import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcrypt";

const app = express();
app.use(cors({
  origin: [
    "https://panda-express-gamma.vercel.app",
    "http://localhost:5173"
  ]
}));
app.use(express.json());

// PSQL database connection config
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false },
});

app.get("/", async (req, res) => {
  res.send("Server is running");
});

// Example query
app.get("/api/employee", async (req, res) => {
  const result = await pool.query("SELECT * FROM employee");
  res.json(result.rows);
});

// Weather query for front page
app.get("/api/weather", async (req, res) => {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=77840`
    );
    const data = await response.json();
    res.json({
      location: `${data.location.name}, ${data.location.region}`,
      temp: data.current.temp_f,
      condition: data.current.condition,
      humidity: data.current.humidity,
      wind_mph: data.current.wind_mph,
      wind_dir: data.current.wind_dir,
      is_day: data.current.is_day,
    });
  } catch (error) {
    console.error("Error fetching weather:", error);
    res.status(500).send("Error fetching weather");
  }
});

/* Open ai key */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure to set your OpenAI API key in environment variables
});

app.post("/api/chat", async (req, res) => {
  const { userMessage } = req.body; // Get the user message from the request body
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Cheapest model
      messages: [
        {
          role: "system",
          content: `
                    You are a helpful assistant for a self-ordering kiosk at Panda Express. 
                    Use the information below to answer questions:
                    Make sure to use 2 decimal points for pricing and keep text clean and professional.

                    # How to Place an Order
                    1. Register or log in to your rewards account, or continue as guest.
                    2. Select a menu item.
                    3. Select menu item options.
                    4. Add menu item with the selected options to cart.
                    5. Checkout when you have all the menu items you want.
                    6. Select a payment type and pay.

                    # Payment Options
                    1. Credit 
                    2. Debit
                    3. Meal Swipe
                    4. Gift Card

                    # When answering questions regarding menu items and items, use the information given in the tables.
                    Try to give helpful information regarding the price if necessary.

                    # Meal item table
                    meal_id	meal_name	meal_size	meal_type	meal_price
                    1	Bowl	NULL	NULL	8.3
                    2	Plate	NULL	NULL	9.8
                    3	Bigger Plate	NULL	NULL	11.3
                    4	Appetizers	Small	NULL	2
                    5	Appetizers	Large	NULL	11.2
                    6	Appetizers	Small	Apple Pie Roll	2
                    7	Appetizers	Medium	Apple Pie Roll	6.2
                    8	Appetizers	Large	Apple Pie Roll	8
                    9	A La Carte	Small	Entree	5.2
                    10	A La Carte	Medium	Entree	8.5
                    11	A La Carte	Large	Entree	11.2
                    12	A La Carte	Small	Entree Premium	6.7
                    13	A La Carte	Medium	Entree Premium	11.5
                    14	A La Carte	Large	Entree Premium	15.7
                    15	A La Carte	Medium	Side	4.4
                    16	A La Carte	Large	Side	5.4
                    17	Drinks	Small	NULL	2.1
                    18	Drinks	Medium	NULL	2.3
                    19	Drinks	Large	NULL	2.5

                    #Item table
                    item_id	item_category	item_name	extra_charge	calories	total_fat	cholesterol	sodium	total_carb	protein	serving_size
                    1	Side	Chow Mein	0	500	23	0	980	61	18	11
                    2	Side	Fried Rice	0	530	16	150	820	82	12	11
                    3	Side	Steamed Rice	0	380	0	0	0	86	7	11
                    4	Side	Super Greens	0	70	0.5	0	530	13	4	10
                    5	Entree	Beijing Beef	0	690	40	65	890	57	26	5.6
                    6	Entree	Broccoli Beef	0	130	4	15	710	13	10	5.44
                    7	Entree	Black Pepper Sirloin Steak	1.5	180	2	40	750	10	19	5.1
                    8	Entree	Black Pepper Chicken	0	250	14	120	930	12	19	6.3
                    9	Entree	Grilled Teriyaki Chicken	0	299	12.8	110	530.1	8.2	36.1	6
                    10	Entree	Honey Sesame Chicken Breast	0	420	22	45	480	40	16	5.3
                    11	Entree	Honey Walnut Shrimp	1.5	370	23	110	470	27	14	4.39
                    12	Entree	Kung Pao Chicken	0	280	18	105	800	12	18	6.74
                    13	Entree	Mushroom Chicken	0	220	13	100	760	9	17	5.7
                    14	Entree	The Original Orange Chicken	0	420	21	95	620	43	15	5.92
                    15	Entree	String Bean Chicken Breast	0	170	7	35	740	13	15	5.6
                    16	Entree	Sweet Fire Chicken Breast	0	440	18	45	370	53	17	5.8
                    17	Appetizers	Chicken Eggroll	0	200	12	20	390	16	8	2.75
                    18	Appetizers	Cream Cheese Rangoon	0	190	8	180	180	24	5	2.4
                    19	Appetizers	Vegetable Spring Roll	0	160	7	0	540	22	4	3.5
                    20	Appetizers	Apple Pie Roll	0	150	3	0	90	30	2	1.94
                    21	Drinks	Diet Pepsi	0	0	0	0	0	0	0	12
                    22	Drinks	Mountain Dew	0	160	0	0	0	44	0	12
                    23	Drinks	Lipton Brisk Raspberry Iced Tea	0	80	0	0	0	20	0	12
                    24	Drinks	Tropicana Lemonade	0	280	0	0	0	71	0	22
                    `,
        },
        { role: "user", content: userMessage },
      ],

      max_tokens: 100, // Limit the number of tokens in the response
      temperature: 0.3, // Use a lower value for more predictable, concise answers
    });

    // Send back the AI's response
    res.json({ message: response.choices[0].message.content });
  } catch (error) {
    console.error("Error from OpenAI:", error);
    res.status(500).json({ error: "Failed to get response from OpenAI" });
  }
});

// ************** CUSTOMER VIEW QUERIES ************** //
// *************************************************** //

app.get("/api/customer", async (req, res) => {
  const result = await pool.query("SELECT * FROM customer");
  res.json(result.rows);
});

app.get("/api/menu", async (req, res) => {
  const query = `
        SELECT meal_name, MIN(meal_price) AS price
        FROM menu
        GROUP BY meal_name
    `;
  const result = await pool.query(query);
  res.json(result.rows);
});

app.get("/api/allMenuInfo", async (req, res) => {
    const query = `
        SELECT meal_name, meal_size, meal_type, meal_price AS price
        FROM menu
    `;
    const result = await pool.query(query);
    res.json(result.rows);
});

// for order.jsx
app.get("/api/menu_name", async (req, res) => {
  const query = `
        SELECT meal_id, meal_name
        FROM menu
    `;
  const result = await pool.query(query);
  res.json(result.rows);
});

//gets entire item table
app.get("/api/item", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM item"); // item category to sort as well
    res.json(result.rows);
  } catch (error) {
    console.error("Error getting items: ", error);
  }
});

// gets latest order id for complete screen
app.get("/api/latest", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT MAX(order_id) AS order_id FROM orders",
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching latest order_id:", error);
    res.status(500).json({ message: "Error fetching latest order_id" });
  }
});

//  meal_id based on meal name and size
app.get("/api/meal-id", async (req, res) => {
    const { mealName, size } = req.query;
    try {
        const query = `
            SELECT meal_id
            FROM menu 
            WHERE meal_name = $1 AND meal_size = $2
        `;
    const result = await pool.query(query, [mealName, size]);

    if (result.rows.length > 0) {
      res.json({ meal_id: result.rows[0].meal_id });
    } else {
      res.status(404).json({ message: "Meal ID not found" });
    }
  } catch (error) {
    console.error("Error fetching meal_id:", error);
    res.status(500).json({ message: "Error fetching meal_id" });
  }
});

// get meal price
app.get("/api/menu/meal-price", async (req, res) => {
  const { meal_id } = req.query;
  try {
    const query = `SELECT meal_price FROM menu WHERE meal_id = $1`;
    const result = await pool.query(query, [meal_id]);

    if (result.rows.length > 0) {
      const price = parseFloat(result.rows[0].meal_price);
      res.json({ price });
    } else {
      res.status(404).json({ message: "Meal price not found" });
    }
  } catch (error) {
    console.error("Error getting base meal price:", error);
    res.status(500).json({ message: "Error getting base meal price" });
  }
});


// get nutrition info
app.get("/api/item/nutrition", async (req, res) => {
  const { item_id } = req.query;
  try {
    const query = `
            SELECT calories, total_fat, cholesterol, sodium, total_carb, protein, serving_size 
            FROM item 
            WHERE item_id = $1
        `;
    const result = await pool.query(query, [item_id]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]); // firsdt row
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (error) {
    console.error("Error fetching nutrition info:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// get allergens info
app.get("/api/item/allergen", async (req, res) => {
  const { item_id } = req.query;
  try {
    const query = `
           SELECT a.allergen_name
            FROM allergen a
            JOIN item_to_allergen ita ON a.allergen_id = ita.allergen_id
            WHERE ita.item_id = $1;

        `;
    const result = await pool.query(query, [item_id]);
    if (result.rows.length > 0) {
      res.json(result.rows);
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (error) {
    console.error("Error fetching allergen info:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// get extra charge info
app.get("/api/item/extra", async (req, res) => {
    const { item_id } = req.query; 
    try {
        const query = `
            SELECT extra_charge
            FROM item
            WHERE item_id = $1;`;
        const result = await pool.query(query, [item_id]);
        if (result.rows.length > 0) {
            res.json({ extra_charge: result.rows[0].extra_charge });

        } else {
            res.status(404).json({ message: "Item not found" });
        }
    } catch (error) {
        console.error("Error fetching extra charge info:", error);
        res.status(500).json({ message: "Internal server error" });
    }});

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// POST endpoint to handle Google Sign-In
app.post("/api/customer/google-signin", async (req, res) => {
  const { token } = req.body;
  try {
    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const googleEmail = payload.email;

    // Check if the user already exists in the database by their Google email
    const result = await pool.query(
      "SELECT * FROM customer WHERE customer_email = $1",
      [googleEmail],
    );

    if (result.rows.length === 0) {
      return res.status(403).json({ message: "No account found with this Google email. Please register first." });
    }

    return res.json({ customer_id: result.rows[0].customer_id });
  } catch (error) {
    res.status(500).json({ message: "Error verifying Google token", error });
  }
});

// POST endpoint to handle customer login
app.post("/api/customer/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if there is an existing customer with email
    const result = await pool.query(
      "SELECT * FROM customer WHERE customer_email = $1",
      [email],
    );

    if (result.rows.length === 0) {
      return res.json({ message: "Invalid email or password" });
    }

    const customer = result.rows[0];
    const match = await bcrypt.compare(password, customer.customer_password);
    if (!match) {
      return res.json({ message: "Invalid email or password" });
    }

    res.json({ customer_id: result.rows[0].customer_id });
  } catch (error) {
    res.json({ message: "Error logging in", error });
  }
});

// POST endpoint to register a new customer
app.post("/api/customer/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    // Check if email already exists
    const existingCustomer = await pool.query(
      "SELECT * FROM customer WHERE customer_email = $1",
      [email],
    );
    if (existingCustomer.rows.length > 0) {
      return res.json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new customer into the database
    const idResult = await pool.query("SELECT MAX(customer_id) FROM customer");
    const id = idResult.rows[0].max ? idResult.rows[0].max + 1 : 1;

    await pool.query(
      "INSERT INTO customer (customer_id, customer_name, customer_email, customer_password) VALUES ($1, $2, $3, $4)",
      [id, `${firstName} ${lastName}`, email, hashedPassword],
    );
    res.json({ customer_id: id });
  } catch (error) {
    res.json({ message: "Error registering customer", error });
  }
});

app.post("/api/order/create", async (req, res) => {
  let { customer_id, cart, total_price, payment_type } = req.body;

  // // Set customer_id to 1 if it's invalid or not provided
  // if (!customer_id || customer_id <= 0) {
  //     customer_id = 1; // Default to customer_id 1
  // }

  console.log("Using customer_id:", customer_id);
  console.log("Cart items:", cart);
  console.log("Total price:", total_price);
  console.log("Payment type:", payment_type);

  try {
    // Get the next available order_id (assuming order_id is not auto-incrementing in the DB)
    const orderIdResult = await pool.query(
      "SELECT MAX(order_id) AS max_order_id FROM orders",
    );
    const newOrderId = orderIdResult.rows[0].max_order_id
      ? orderIdResult.rows[0].max_order_id + 1
      : 1;

    // Insert new order into the orders table
    const orderResult = await pool.query(
      "INSERT INTO orders (order_id, employee_id, customer_id, order_time, total_price) VALUES ($1, $2, $3, NOW(), $4) RETURNING order_id",
      [newOrderId, 1, customer_id === -1 ? null : customer_id, total_price], // IF GUEST ADD NULL
    );
    const orderId = orderResult.rows[0].order_id;

    // Manually generate the next payment_id
    const paymentIdResult = await pool.query(
      "SELECT MAX(payment_id) AS max_payment_id FROM payment",
    );
    const newPaymentId = paymentIdResult.rows[0].max_payment_id
      ? paymentIdResult.rows[0].max_payment_id + 1
      : 1;

    // Insert into payment table with manually generated payment_id
    const paymentResult = await pool.query(
      "INSERT INTO payment (payment_id, order_id, total_price, payment_type) VALUES ($1, $2, $3, $4) RETURNING payment_id",
      [newPaymentId, orderId, total_price, payment_type],
    );
    const paymentId = paymentResult.rows[0].payment_id; // Retrieve the payment_id after insertion

    // Insert into order_menu table and generate a unique order_menu_id manually
    const ingredientUsage = {}; // Object to store ingredient usage

    for (const item of cart) {
      // Manually generate the next order_menu_id
      const orderMenuIdResult = await pool.query(
        "SELECT MAX(order_menu_id) AS max_order_menu_id FROM order_menu",
      );
      const newOrderMenuId = orderMenuIdResult.rows[0].max_order_menu_id
        ? orderMenuIdResult.rows[0].max_order_menu_id + 1
        : 1;

      // Insert into order_menu table with manually generated order_menu_id
      await pool.query(
        "INSERT INTO order_menu (order_menu_id, order_id, meal_id) VALUES ($1, $2, $3)",
        [newOrderMenuId, orderId, item.meal_id],
      );

      // Insert into order_item (item_id) for sides, entrees, and single items
      const insertItems = async (ids) => {
        for (const itemId of ids) {
          // Manually generate the next order_item_id
          const orderItemIdResult = await pool.query(
            "SELECT MAX(order_item_id) AS max_order_item_id FROM order_item",
          );
          const newOrderItemId = orderItemIdResult.rows[0].max_order_item_id
            ? orderItemIdResult.rows[0].max_order_item_id + 1
            : 1;

          // Insert into order_item table with manually generated order_item_id
          await pool.query(
            "INSERT INTO order_item (order_item_id, order_id, item_id) VALUES ($1, $2, $3)",
            [newOrderItemId, orderId, itemId],
          );

          // Get ingredients for this item
          const ingredientsResult = await pool.query(
            "SELECT ingredient_id, serving_size FROM item_to_ingredient WHERE item_id = $1",
            [itemId]
          );

          // Update ingredient usage
          for (const ingredient of ingredientsResult.rows) {
            const ingredientId = ingredient.ingredient_id;
            const servingSize = ingredient.serving_size;
            
            // If ingredient is already in usage, add the serving size; otherwise, initialize it
            if (ingredientUsage[ingredientId]) {
              ingredientUsage[ingredientId] += servingSize * item.quantity;
            } else {
              ingredientUsage[ingredientId] = servingSize * item.quantity;
            }
          }
        }
      };

      if (item.side_ids) {
        await insertItems(item.side_ids);
      }
      if (item.entree_ids) {
        await insertItems(item.entree_ids);
      }
      if (item.single_item_id) {
        await insertItems([item.single_item_id]);
      }
    }

    // Now, update the inventory based on the usage of ingredients
    for (const [ingredientId, usage] of Object.entries(ingredientUsage)) {
      // Check the current inventory for this ingredient
      const ingredientResult = await pool.query(
        "SELECT quantity FROM ingredient WHERE ingredient_id = $1",
        [ingredientId]
      );
      const currentQuantity = ingredientResult.rows[0].quantity;

      // If there's enough inventory, update the quantity
      if (currentQuantity >= usage) {
        await pool.query(
          "UPDATE ingredient SET quantity = quantity - $1 WHERE ingredient_id = $2",
          [usage, ingredientId]
        );
      } else {
        console.warn(`Not enough inventory for ingredient ${ingredientId}. Current stock: ${currentQuantity}, needed: ${usage}`);
        // Handle low stock situation, maybe alert for reorder or log a warning
      }
    }

    // Return success
    res.json({ success: true });
  } catch (error) {
    console.error("Error creating order:", error);
    res.json({ success: false, error: error.message });
  }
});


// *************************************************** //
// *************************************************** //

// ************** MANAGER VIEW QUERIES *************** //
// *************************************************** //

app.get("/api/manager/statistics/x-report-sales", async (req, res) => {
  try {
    const query = `
            SELECT 
                EXTRACT(HOUR FROM order_time) AS hour_of_day, 
                COUNT(order_id) AS order_count, 
                SUM(total_price) AS total_sales 
            FROM orders 
            WHERE DATE(order_time) = CURRENT_DATE 
            GROUP BY EXTRACT(HOUR FROM order_time) 
            ORDER BY hour_of_day;
        `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching X_Report_Sales data:", error);
    res.status(500).json({ message: "Error fetching data" });
  }
});

app.get("/api/manager/statistics/x-report-payment-type", async (req, res) => {
  try {
    // First, get today's order IDs
    const orderIdsResult = await pool.query(`
            SELECT order_id FROM orders WHERE DATE(order_time) = CURRENT_DATE;
        `);
    const orderIds = orderIdsResult.rows.map((row) => row.order_id);
    if (orderIds.length === 0) {
      return res.json([]);
    }

    // Create a string of order IDs for the IN clause
    const orderIdsStr = "(" + orderIds.join(",") + ")";

    // Now, get the payment types
    const query = `
            SELECT payment_type, COUNT(payment_type) AS method_count 
            FROM payment 
            WHERE order_id IN ${orderIdsStr} 
            GROUP BY payment_type 
            ORDER BY method_count DESC;
        `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching X_Report Payment Type data:", error);
    res.status(500).json({ message: "Error fetching data" });
  }
});

app.get("/api/manager/statistics/z-report", async (req, res) => {
  try {
    const query = `
            SELECT payment.payment_type, 
                COUNT(DISTINCT orders.order_id) AS order_count, 
                SUM(orders.total_price) AS total_sales, 
                COUNT(payment.order_id) AS payment_count 
            FROM orders 
            JOIN payment ON orders.order_id = payment.order_id 
            WHERE DATE(orders.order_time) = CURRENT_DATE 
            GROUP BY payment.payment_type 
            UNION ALL 
            SELECT 'Total' AS payment_type, 
                COUNT(DISTINCT orders.order_id) AS order_count, 
                SUM(orders.total_price) AS total_sales, 
                COUNT(payment.order_id) AS payment_count 
            FROM orders 
            JOIN payment ON orders.order_id = payment.order_id 
            WHERE DATE(orders.order_time) = CURRENT_DATE;
        `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching Z_Report data:", error);
    res.status(500).json({ message: "Error fetching data" });
  }
});

// Get data for a specific statistics query
app.get("/api/manager/statistics/:queryId", async (req, res) => {
  const { queryId } = req.params;

  try {
    let query = "";
    let values = []; // Use values if you have parameterized queries

    switch (queryId) {
      case "weekly_order_statistics":
        query =
          "SELECT " +
          "EXTRACT(WEEK FROM order_time) AS week_number, " +
          "COUNT(order_id) AS order_count " +
          "FROM orders " +
          "GROUP BY EXTRACT(WEEK FROM order_time);";
        break;

      case "hourly_sales_data":
        query =
          "SELECT " +
          "EXTRACT(HOUR FROM order_time) AS hour_of_day, " +
          "COUNT(order_id) AS order_count, " +
          "SUM(total_price) AS total_sales " +
          "FROM orders " +
          "GROUP BY EXTRACT(HOUR FROM order_time) " +
          "ORDER BY hour_of_day;";
        break;

      case "top_10_highest":
        query =
          "SELECT " +
          "order_time, " +
          "SUM(total_price) AS total_sales " +
          "FROM orders " +
          "GROUP BY order_time " +
          "ORDER BY total_sales DESC " +
          "LIMIT 10;";
        break;

      case "ingredient_count_for_each_item":
        query =
          "SELECT i.item_id, i.item_name, COUNT(ii.ingredient_id) AS ingredient_count " +
          "FROM item i JOIN item_to_ingredient ii ON i.item_id = ii.item_id " +
          "GROUP BY i.item_id, i.item_name;";
        break;

      case "sales_By_Payment_Method":
        query =
          "SELECT payment_type, COUNT(*) " +
          "FROM payment " +
          "GROUP BY payment_type " +
          "ORDER BY COUNT(*) DESC;";
        break;

      case "total_Money_All_Orders":
        query =
          "SELECT SUM(total_price) AS total_sales_sum_all_time " +
          "FROM orders;";
        break;

      case "most_Expensive_Order":
        query =
          "SELECT * " +
          "FROM orders " +
          "ORDER BY total_price DESC " +
          "LIMIT 1;";
        break;

      case "employee_Num_Orders_Taken":
        query =
          " SELECT employee_id, COUNT(*) " +
          "FROM orders " +
          "GROUP BY employee_id " +
          "ORDER BY COUNT(*) DESC;";
        break;
      // Add more cases for other query IDs

      default:
        return res.status(400).json({ message: "Invalid query ID" });
    }

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching data for statistics query:", error);
    res.status(500).json({ message: "Error fetching data" });
  }
});

// Get all items
app.get("/api/manager/item/get", async (req, res) => {
  try {
    const query = `
            SELECT item_id, item_category, item_name, extra_charge, calories, total_fat, cholesterol, sodium, total_carb, protein, serving_size
            FROM item ORDER BY item_id ASC
        `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Error fetching items" });
  }
});

// Add a new item
app.post("/api/manager/item/add", async (req, res) => {
  const {
    item_category,
    item_name,
    extra_charge,
    calories,
    total_fat,
    cholesterol,
    sodium,
    total_carb,
    protein,
    serving_size,
  } = req.body;

  try {
    // Get the next available item_id
    const idResult = await pool.query("SELECT COUNT(*) AS row_count FROM item");
    const newItemId = parseInt(idResult.rows[0].row_count, 10) + 1;

    const query = `
            INSERT INTO item (item_id, item_category, item_name, extra_charge, calories, total_fat, cholesterol, sodium, total_carb, protein, serving_size)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *;
        `;
    const values = [
      newItemId,
      item_category,
      item_name,
      extra_charge,
      calories,
      total_fat,
      cholesterol,
      sodium,
      total_carb,
      protein,
      serving_size,
    ];
    const result = await pool.query(query, values);
    res.json(result.rows[0]); // Return the new item
  } catch (error) {
    console.error("Error adding item:", error);
    res.status(500).json({ message: "Error adding item" });
  }
});

// Update an existing item
app.put("/api/manager/item/update", async (req, res) => {
  const {
    item_id,
    item_category,
    item_name,
    extra_charge,
    calories,
    total_fat,
    cholesterol,
    sodium,
    total_carb,
    protein,
    serving_size,
  } = req.body;

  try {
    const query = `
            UPDATE item
            SET item_category = $1,
                item_name = $2,
                extra_charge = $3,
                calories = $4,
                total_fat = $5,
                cholesterol = $6,
                sodium = $7,
                total_carb = $8,
                protein = $9,
                serving_size = $10
            WHERE item_id = $11
            RETURNING *;
        `;
    const values = [
      item_category,
      item_name,
      extra_charge,
      calories,
      total_fat,
      cholesterol,
      sodium,
      total_carb,
      protein,
      serving_size,
      item_id,
    ];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      res.status(404).json({ message: "Item not found" });
    } else {
      res.json(result.rows[0]); // Return the updated item
    }
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ message: "Error updating item" });
  }
});

app.post("/api/manager/login", async (req, res) => {
  const { employeeId } = req.body;

  if (!employeeId) {
    return res.status(400).json({ error: "Employee ID is required." });
  }

  // Check if the employeeId is a valid number
  if (isNaN(employeeId) || employeeId <= 0) {
    return res.status(400).json({ error: "Invalid Employee ID format." });
  }

  try {
    // Query to find the manager
    const result = await pool.query(
      "SELECT * FROM employee WHERE employee_id = $1 AND is_manager = TRUE",
      [employeeId],
    );

    if (result.rows.length === 0) {
      return res
        .status(401)
        .json({ error: "Invalid manager ID or not authorized." });
    }

    const manager = result.rows[0];
    res.json({ manager_id: manager.employee_id, name: manager.employee_name });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.get("/api/manager/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT employee_name FROM employee WHERE employee_id = $1 AND is_manager = TRUE",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Manager not found." });
    }

    res.json({ name: result.rows[0].employee_name });
  } catch (error) {
    console.error("Error fetching manager data:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// ************** INVENTORY VIEW QUERIES ************** //
// *************************************************** //
// Inventory endpoint
app.get("/api/manager/inventory/get", async (req, res) => {
  try {
    const query = `
            SELECT ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price
            FROM ingredient ORDER BY ingredient_id ASC
        `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching inventory items:", error);
    res.status(500).json({ message: "Error fetching inventory items" });
  }
});

// Endpoint to add a new inventory item
app.post("/api/manager/inventory/add", async (req, res) => {
  const {
    ingredient_name,
    quantity,
    unit_of_measure,
    reorder_level,
    unit_price,
  } = req.body;

  try {
    // Get the number of rows to determine the next ingredient_id
    const countResult = await pool.query(
      "SELECT COUNT(*) AS row_count FROM ingredient",
    );
    const newIngredientId = parseInt(countResult.rows[0].row_count, 10) + 1;

    const query = `
            INSERT INTO ingredient (ingredient_id, ingredient_name, quantity, unit_of_measure, reorder_level, unit_price)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
    const result = await pool.query(query, [
      newIngredientId,
      ingredient_name,
      quantity,
      unit_of_measure,
      reorder_level,
      unit_price,
    ]);
    res.json(result.rows[0]); // Return the new row
  } catch (error) {
    console.error("Error adding inventory item:", error);
    res.status(500).json({ message: "Error adding inventory item" });
  }
});

// Update Inventory Endpoint
app.put("/api/manager/inventory/update", async (req, res) => {
  const {
    ingredient_id,
    ingredient_name,
    quantity,
    unit_of_measure,
    reorder_level,
    unit_price,
  } = req.body;

  const sql = `
        UPDATE ingredient
        SET ingredient_name = $1, quantity = $2, unit_of_measure = $3, reorder_level = $4, unit_price = $5
        WHERE ingredient_id = $6
        RETURNING *
    `;

  const values = [
    ingredient_name,
    quantity,
    unit_of_measure,
    reorder_level,
    unit_price,
    ingredient_id,
  ];

  try {
    const result = await pool.query(sql, values);
    if (result.rowCount === 0) {
      res.status(404).json({ error: "Ingredient not found" });
    } else {
      res
        .status(200)
        .json({
          message: "Ingredient updated successfully",
          ingredient: result.rows[0],
        });
    }
  } catch (error) {
    console.error("Error updating ingredient:", error);
    res.status(500).json({ error: "Failed to update ingredient" });
  }
});

// Get items linked to a specific ingredient
app.get("/api/manager/ingredient/:ingredient_id/items", async (req, res) => {
  const { ingredient_id } = req.params;
  try {
    const query = `
            SELECT item_id, serving_size
            FROM item_to_ingredient
            WHERE ingredient_id = $1
        `;
    const result = await pool.query(query, [ingredient_id]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching linked items:", error);
    res.status(500).json({ message: "Error fetching linked items" });
  }
});

// Link items to an ingredient
app.post(
  "/api/manager/ingredient/:ingredient_id/link-items",
  async (req, res) => {
    const { ingredient_id } = req.params;
    const { linkedItems } = req.body;
    try {
      // Begin a transaction
      await pool.query("BEGIN");

      // Delete existing links
      await pool.query(
        "DELETE FROM item_to_ingredient WHERE ingredient_id = $1",
        [ingredient_id],
      );

      // Insert new links
      for (const item of linkedItems) {
        // Generate item_to_ingredient_id
        const idResult = await pool.query("SELECT MAX(item_to_ingredient_id) FROM item_to_ingredient");
        const newId = idResult.rows[0].max ? idResult.rows[0].max + 1 : 1; // Handle case where there are no customers

        const { item_id, serving_size } = item;
        const insertQuery = `
                INSERT INTO item_to_ingredient (item_to_ingredient_id, item_id, ingredient_id, serving_size)
                VALUES ($1, $2, $3, $4)
            `;
        await pool.query(insertQuery, [
          newId,
          item_id,
          ingredient_id,
          serving_size,
        ]);
      }

      // Commit transaction
      await pool.query("COMMIT");
      res.json({ message: "Items linked successfully" });
    } catch (error) {
      // Rollback transaction in case of error
      await pool.query("ROLLBACK");
      console.error("Error linking items:", error);
      res.status(500).json({ message: "Error linking items" });
    }
  },
);

// get the employee table
app.get("/api/manager/employee/get", async (req, res) => {
  try {
    const query = `
            SELECT * FROM employee
        `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "Error fetching employees" });
  }
});

// Endpoint to add a new employee
app.post("/api/manager/employee/add", async (req, res) => {
  const { employee_id, employee_name, is_manager } = req.body;

  try {
    // Get the number of rows to determine the next ingredient_id

    const query = `
            INSERT INTO employee (employee_id, employee_name, is_manager)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;
    const result = await pool.query(query, [
      employee_id,
      employee_name,
      is_manager,
    ]);
    res.json(result.rows[0]); // Return the new row
  } catch (error) {
    console.error("Error adding employee:", error);
    res.status(500).json({ message: "Error adding employee" });
  }
});

// Update Employee Endpoint
app.put("/api/manager/employee/update", async (req, res) => {
  const { employee_id, employee_name, is_manager } = req.body;

  const sql = `
        UPDATE employee
        SET employee_name = $1, is_manager = $2
        WHERE employee_id = $3
        RETURNING *
    `;

  const values = [employee_name, is_manager, employee_id];

  try {
    const result = await pool.query(sql, values);
    if (result.rowCount === 0) {
      res.status(404).json({ error: "Employee not found" });
    } else {
      res
        .status(200)
        .json({
          message: "Employee updated successfully",
          employee: result.rows[0],
        });
    }
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({ error: "Failed to update employee" });
  }
});

// *************************************************** //
// *************************************************** //
// *************** CASHIER VIEW QUERIES ************** //
// *************************************************** //

app.post("/api/cashier/login", async (req, res) => {
  const { employeeId } = req.body;

  if (!employeeId) {
    return res.status(400).json({ error: "Employee ID is required." });
  }

  // Check if the employeeId is a valid number
  if (isNaN(employeeId) || employeeId <= 0) {
    return res.status(400).json({ error: "Invalid Employee ID format." });
  }

  try {
    // Query to find the manager
    const result = await pool.query(
      "SELECT * FROM employee WHERE employee_id = $1 AND is_manager = FALSE",
      [employeeId],
    );

    if (result.rows.length === 0) {
      return res
        .status(401)
        .json({ error: "Invalid cashier ID or not authorized." });
    }

    const cashier = result.rows[0];
    res.json({ cashier_id: cashier.employee_id, name: cashier.employee_name });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ error: "Internal server error." });
  }});

// get the allergens table
app.get("/api/manager/allergens/get", async (req, res) => {
    try {
        const query = `
            SELECT * FROM allergen Order by allergen_id ASC
        `;
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching allergens:", error);
        res.status(500).json({ message: "Error fetching allergens" });
    }
});

// Endpoint to add a new allergen
app.post("/api/manager/allergens/add", async (req, res) => {
    const {allergen_name} = req.body;

    try {
        // Get the number of rows to determine the next id
        const countResult = await pool.query("SELECT COUNT(*) AS row_count FROM allergen");
        const allergen_id = parseInt(countResult.rows[0].row_count, 10) + 1;

        const query = `
            INSERT INTO allergen (allergen_id, allergen_name)
            VALUES ($1, $2)
            RETURNING *;
        `;
        const result = await pool.query(query, [allergen_id, allergen_name]);
        res.json(result.rows[0]); // Return the new row
    } catch (error) {
        console.error("Error adding allergens:", error);
        res.status(500).json({ message: "Error adding allergens" });
    }
});

// Update allergen Endpoint
app.put('/api/manager/allergens/update', async (req, res) => {
    const { allergen_id, allergen_name} = req.body;

    const sql = `
        UPDATE allergen
        SET allergen_name = $1
        WHERE allergen_id = $2
        RETURNING *
    `;

    const values = [allergen_name, allergen_id];

    try {
        const result = await pool.query(sql, values);
        if (result.rowCount === 0) {
            res.status(404).json({ error: 'Allergen not found' });
        } else {
            res.status(200).json({ message: 'Allergen updated successfully', allergen: result.rows[0] });
        }
    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).json({ error: 'Failed to update employee' });
    }
});

// Get items linked to a specific allergen
app.get("/api/manager/allergen/:allergen_id/items", async (req, res) => {
    const { allergen_id } = req.params;
    try {
        const query = `
            SELECT item_id
            FROM item_to_allergen
            WHERE allergen_id = $1
        `;
        const result = await pool.query(query, [allergen_id]);
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching linked items:", error);
        res.status(500).json({ message: "Error fetching linked items" });
    }
});

app.get("/api/cashier/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "SELECT employee_name FROM employee WHERE employee_id = $1 AND is_manager = FALSE",
      [id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Cashier not found." });
    }

    res.json({ name: result.rows[0].employee_name });
  } catch (error) {
    console.error("Error fetching cashier data:", error);
    res.status(500).json({ error: "Internal server error." });
  }});
  
// Link items to an allergen
app.post("/api/manager/allergen/:allergen_id/link-items", async (req, res) => {
    const { allergen_id } = req.params;
    const { item_ids } = req.body; // Expecting an array of item IDs
    try {
        // Begin a transaction
        await pool.query('BEGIN');
        
        // Delete existing links
        await pool.query('DELETE FROM item_to_allergen WHERE allergen_id = $1', [allergen_id]);
        
        // Insert new links
        for (const item_id of item_ids) {
            // Generate item_to_allergen_id
            const idResult = await pool.query("SELECT MAX(item_to_allergen_id) FROM item_to_allergen");
            const newId = idResult.rows[0].max ? idResult.rows[0].max + 1 : 1; // Handle case where there are no customers
            
            const insertQuery = `
                INSERT INTO item_to_allergen (item_to_allergen_id, item_id, allergen_id)
                VALUES ($1, $2, $3)
            `;
            await pool.query(insertQuery, [newId, item_id, allergen_id]);
        }
        
        // Commit transaction
        await pool.query('COMMIT');
        res.json({ message: 'Items linked successfully' });
    } catch (error) {
        // Rollback transaction in case of error
        await pool.query('ROLLBACK');
        console.error("Error linking items:", error);
        res.status(500).json({ message: "Error linking items" });
    }
});

// *************************************************** //

app.listen(8080, () => {
  console.log("Server started on port 8080");
});
