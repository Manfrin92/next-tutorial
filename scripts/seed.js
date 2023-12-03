// const { db } = require('@vercel/postgres');
const sql = require('mssql');
const {
  invoices,
  customers,
  revenue,
  users,
} = require('../app/lib/placeholder-data.js');
const bcrypt = require('bcrypt');

const config = {
  user: 'sa',
  password: 'yourStrong(!)Password',
  server: 'localhost',
  database: 'next-tutorial',
  options: {
    trustServerCertificate: true,
  },
};

const pool = new sql.ConnectionPool(config);
const connect = pool.connect();

async function createUsersTable(request) {
  await request.query(
    `CREATE TABLE users (
      id uniqueidentifier PRIMARY KEY DEFAULT NEWID(),
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL,
      password TEXT NOT NULL
    );`,
  );

  console.log(`Created "users" table`);
}

async function seedUsers(request) {
  try {
    users.forEach(async (user) => {
      await request.query(
        `INSERT INTO users (id, name, email, password) VALUES ('${user.id}', '${user.name}', '${user.email}', '${user.password}');`,
      );
    });

    console.log(`Seeded ${users.length} users`);
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function createInvoicesTable(request) {
  await request.query(
    `CREATE TABLE invoices (
      id uniqueidentifier PRIMARY KEY DEFAULT NEWID(),
      customer_id uniqueidentifier FOREIGN KEY REFERENCES customers(id) NOT NULL,
      amount INT NOT NULL,
      status VARCHAR(255) NOT NULL,
      date DATE NOT NULL);`,
  );

  console.log(`Created "invoices" table`);
}

async function seedInvoices(request) {
  try {
    invoices.forEach(async (invoice) => {
      await request.query(
        `INSERT INTO invoices (customer_id, amount, status, date)
        VALUES ('${invoice.customer_id}', ${invoice.amount}, '${invoice.status}', '${invoice.date}');`,
      );
    });

    console.log(`Seeded ${invoices.length} invoices`);
  } catch (error) {
    console.error('Error seeding invoices:', error);
    throw error;
  }
}

async function createCustomerTable(request) {
  try {
    await request.query(
      `CREATE TABLE customers (
        id uniqueidentifier PRIMARY KEY DEFAULT NEWID(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        image_url VARCHAR(255) NOT NULL
      );`,
    );

    console.log(`Created "customers" table`);
  } catch (error) {
    console.error('Error seeding customers:', error);
    throw error;
  }
}

async function seedCustomers(request) {
  try {
    customers.forEach(async (customer) => {
      await request.query(
        `INSERT INTO customers (id, name, email, image_url)
        VALUES ('${customer.id}', '${customer.name}', '${customer.email}', '${customer.image_url}');`,
      );
    });

    console.log(`Seeded ${insertedCustomers.length} customers`);
  } catch (error) {
    console.error('Error seeding customers:', error);
    throw error;
  }
}

async function createRevenueTable(request) {
  await request.query(
    `CREATE TABLE revenue (
      month VARCHAR(4) NOT NULL UNIQUE,
      revenue INT NOT NULL
    );`,
  );

  console.log(`Created "revenue" table`);
}

async function seedRevenue(request) {
  try {
    revenue.forEach(async (rev) => {
      await request.query(`
      INSERT INTO revenue (month, revenue)
        VALUES ('${rev.month}', '${rev.revenue}');
      `);
    });

    console.log(`Seeded ${revenue.length} revenue`);
  } catch (error) {
    console.error('Error seeding revenue:', error);
    throw error;
  }
}

async function main() {
  await connect;
  const request = pool.request();

  await createUsersTable(request);
  await seedUsers(request);
  // await createCustomerTable(request);
  // await seedCustomers(request);
  // await createInvoicesTable(request);
  // await seedInvoices(request);
  // await createRevenueTable(request);
  // await seedRevenue(request);
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
