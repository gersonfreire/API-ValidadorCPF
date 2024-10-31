const express = require('express');
const https = require('https');
const fs = require('fs');
const dotenv = require('dotenv');
const app = express();
const bodyParser = require('body-parser');

// Load environment variables from an alternate .env file
dotenv.config({ path: './path/to/your/alternate.env' });

// Controllers
const ControllerCPF = require('./src/controllers/ControllerCPF.js');
const ControllerCNPJ = require('./src/controllers/ControllerCNPJ.js');

const PORT = process.env.PORT || 9002;

// SSL Certificate
const privateKey = fs.readFileSync(process.env.SSL_KEY_PATH, 'utf8');
const certificate = fs.readFileSync(process.env.SSL_CERT_PATH, 'utf8');
const credentials = { key: privateKey, cert: certificate };

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.get('/validarCpf/:cpf', async (req, res) => {
    const { cpf } = req.params;
    const response = await ControllerCPF.ValidarCPF(cpf);
    res.json(response);
});

app.get('/gerarCpf', async (req, res) => {
    const response = await ControllerCPF.GerarCPF();
    res.json(response);
});

app.get('/validarCnpj/:cnpj', async (req, res) => {
    const { cnpj } = req.params;
    const response = await ControllerCNPJ.ValidarCNPJ(cnpj);
    res.json(response);
});

app.get('/gerarCnpj', async (req, res) => {
    const response = await ControllerCNPJ.GerarCNPJ();
    res.json(response);
});

// Create HTTPS server
const httpsServer = https.createServer(credentials, app);

httpsServer.listen(PORT, '0.0.0.0', () => {
    console.log(`HTTPS Server running on port ${PORT}`);
});
