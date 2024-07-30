const request = require('supertest');
const app = require('../app');

describe('API de entrega', () => {
    beforeEach(() => {
        app.pedidos = [];
        app.rotas = [];
    });

    test('GET /pedidos retorna a lista de pedidos corretamente', async () => {
        const response = await request(app).get('/pedidos');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    test('POST /pedidos cria um novo pedido corretamente', async () => {
        const novoPedido = {
            endereco: { rua: "Av. Exemplo", numero: 123 },
            latitude: -5.7945,
            longitude: -35.211,
            produto: "Produto Exemplo",
            quantidade: 2
        };

        const response = await request(app).post('/pedidos').send(novoPedido);
        expect(response.status).toBe(201);
        expect(response.body).toEqual(novoPedido);

        const pedidosResponse = await request(app).get('/pedidos');
        expect(pedidosResponse.body).toEqual([novoPedido]);
    });

    test('GET /rotas retorna a lista de rotas corretamente', async () => {
        const response = await request(app).get('/rotas');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    test('POST /rotas cria uma nova rota corretamente', async () => {
        const novaRota = {
            latitude: -5.7945,
            longitude: -35.211
        };

        const response = await request(app).post('/rotas').send(novaRota);
        expect(response.status).toBe(201);
        expect(response.body).toEqual({ id: 1, latitude: -5.7945, longitude: -35.211 });

        const rotasResponse = await request(app).get('/rotas');
        expect(rotasResponse.body).toEqual([{ id: 1, latitude: -5.7945, longitude: -35.211 }]);
    });

    test('GET /melhor-rota/:id retorna a melhor rota de entrega corretamente', async () => {
        const novaRota = { latitude: -5.7945, longitude: -35.211 };
        const novoPedido = {
            endereco: { rua: "Av. Exemplo", numero: 123 },
            latitude: -5.7945,
            longitude: -35.211,
            produto: "Produto Exemplo",
            quantidade: 2
        };

        await request(app).post('/rotas').send(novaRota);
        await request(app).post('/pedidos').send(novoPedido);

        const response = await request(app).get('/melhor-rota/1');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            rotaId: 1,
            entregas: [{
                endereco: { rua: "Av. Exemplo", numero: 123 },
                produto: "Produto Exemplo",
                quantidade: 2,
                latitude: -5.7945,
                longitude: -35.211
            }]
        });
    });
});
