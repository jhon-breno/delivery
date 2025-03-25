const ct = require("../controllers/login");

// Rota de login que chama o controller de login
module.exports = (server) => {
  server.post("/login", async (req, res) => {
    const result = await ct.controller().login(req);
    res.send(result);
  });
};
