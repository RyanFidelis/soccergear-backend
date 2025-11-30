import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";

import sequelize from "./api/config/database.js";
import routes from "./api/routes/authRoutes.js";

const app = express();

app.use(cors()); 

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


app.get('/', (req, res) => {
    res.status(200).send('API do SoccerGear está funcionando!'); 
});


app.use("/api", routes);

const PORT = process.env.PORT || 3001;

sequelize.sync({ alter: true })
  .then(() => {
    console.log("Banco conectado!");
    app.listen(PORT, () =>
      console.log(`Servidor rodando na porta ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("Erro ao conectar no banco:", err);
  });