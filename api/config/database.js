import { Sequelize } from 'sequelize';
import 'dotenv/config';

// Verifica se há DATABASE_URL (Supabase/Render/Vercel)
const databaseUrl = process.env.DATABASE_URL;

let sequelize;

// Ambiente de PRODUÇÃO (Render / Supabase)
if (databaseUrl) {
  sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    dialectModule: await import('pg').then(mod => mod.default)
  });

  console.log("🔗 Conectando ao banco na nuvem...");

} else {
  // Ambiente LOCAL (se você rodar no seu PC)
  sequelize = new Sequelize(
    "soccergear",   // nome do banco local
    "postgres",     // usuário local
    "sua_senha",    // senha local
    {
      host: "localhost",
      dialect: "postgres",
      logging: false
    }
  );

  console.log("💻 Conectando ao banco local...");
}

export default sequelize;
