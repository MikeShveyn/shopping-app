import { Sequelize } from 'sequelize-typescript';
import { databaseConfig } from './configs/db.config';

//USE THIS TO CLEAR TABLES  npx ts-node src/clear-db.ts

async function clearDatabase() {
  const sequelize = new Sequelize(databaseConfig);

  console.log('Clearing all tables.');
  await sequelize.query(`TRUNCATE TABLE "orders", "products", "users" RESTART IDENTITY CASCADE`);
  console.log('Tables cleared successfully.');

  await sequelize.close();
}

// Execute the function
clearDatabase().catch(error => {
  console.error('Error clearing database:', error);
});
