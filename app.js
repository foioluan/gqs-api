const express = require('express');
const app = express();

app.use(express.json());

app.pedidos = [];
app.rotas = [];

// Rota para obter todos os pedidos
app.get('/pedidos', (req, res) => {
    res.json(app.pedidos);
});

// Rota para criar um novo pedido
app.post('/pedidos', (req, res) => {
    const { endereco, latitude, longitude, produto, quantidade } = req.body;
    const novoPedido = { endereco, latitude, longitude, produto, quantidade };
    app.pedidos.push(novoPedido);
    res.status(201).json(novoPedido);
});

// Rota para obter todas as rotas
app.get('/rotas', (req, res) => {
    res.json(app.rotas);
});

// Rota para criar uma nova rota
app.post('/rotas', (req, res) => {
    const { latitude, longitude } = req.body;
    const novaRota = { id: app.rotas.length + 1, latitude, longitude };
    app.rotas.push(novaRota);
    res.status(201).json(novaRota);
});

// Rota para obter a melhor rota de entrega para os pedidos
app.get('/melhor-rota/:id', (req, res) => {
    const rotaId = parseInt(req.params.id);
    const rota = app.rotas.find(r => r.id === rotaId);

    if (!rota) {
        return res.status(404).json({ error: 'Rota não encontrada' });
    }

    const melhorRota = calcularMelhorRota(rota, app.pedidos);
    res.json(melhorRota);
});

// Função para calcular a melhor rota
function calcularMelhorRota(rota, pedidos) {
    let melhorRota = {
        rotaId: rota.id,
        entregas: []
    };

    pedidos.sort((a, b) => {
        const distA = calcularDistancia(rota.latitude, rota.longitude, a.latitude, a.longitude);
        const distB = calcularDistancia(rota.latitude, rota.longitude, b.latitude, b.longitude);
        return distA - distB;
    });

    pedidos.forEach(pedido => {
        melhorRota.entregas.push({
            endereco: pedido.endereco,
            produto: pedido.produto,
            quantidade: pedido.quantidade,
            latitude: pedido.latitude,
            longitude: pedido.longitude
        });
    });

    return melhorRota;
}

// Função para calcular a distância entre duas coordenadas
function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distancia = R * c;
    return distancia;
}

module.exports = app;
