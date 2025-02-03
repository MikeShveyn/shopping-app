import { Sequelize } from 'sequelize-typescript';
import { databaseConfig } from './configs/db.config';

//USE THIS TO POPULATE  npx ts-node src/populate-db.ts

async function populateDatabase() {
  const sequelize = new Sequelize(databaseConfig);
  await sequelize.sync({ force: false });

  console.log('Populating default data.');
  
  await sequelize.query(`
    INSERT INTO users ("userId", "firstName", "lastName", "username", "createdAt", "updatedAt")
    VALUES
    ('a1b2c3d4-e5f6-7890-1234-56789abcdef0', 'John', 'Doe', 'johnDoe', NOW(), NOW()),
    ('b2c3d4e5-f678-9012-3456-789abcdef012', 'Alice', 'Smith', 'aliceSmith', NOW(), NOW())
    ON CONFLICT ("userId") DO NOTHING;
  `);

  await sequelize.query(`
    INSERT INTO products ("productId", "productName", "price", "quantity", "soldCount", "userId", "createdAt", "updatedAt")
    VALUES
    ('c3d4e5f6-7890-1234-5678-9abcdef01234', 'Gaming Laptop', 1500, 10, 2, 'a1b2c3d4-e5f6-7890-1234-56789abcdef0', NOW(), NOW()),
    ('d4e5f678-9012-3456-789a-bcdef0123456', 'Smartphone', 800, 5, 1, 'b2c3d4e5-f678-9012-3456-789abcdef012', NOW(), NOW())
    ON CONFLICT ("productId") DO NOTHING;
  `);

  await sequelize.query(`
    INSERT INTO orders ("orderId", "userId", "productId", "quantity", "totalPrice", "createdAt", "updatedAt")
    VALUES
    ('e5f67890-1234-5678-9abc-def012345678', 'b2c3d4e5-f678-9012-3456-789abcdef012', 'c3d4e5f6-7890-1234-5678-9abcdef01234', 1, 1500, NOW(), NOW()),
    ('f6789012-3456-789a-bcde-f01234567890', 'a1b2c3d4-e5f6-7890-1234-56789abcdef0', 'd4e5f678-9012-3456-789a-bcdef0123456', 1, 800, NOW(), NOW())
    ON CONFLICT ("orderId") DO NOTHING;
  `);

  console.log('Database populated successfully.');
  await sequelize.close();
}

// Execute the function
populateDatabase().catch(error => {
  console.error('Error populating database:', error);
});
