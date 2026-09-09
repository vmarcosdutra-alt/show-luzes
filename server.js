const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: { origin: "*" }
});

app.use(express.static('public'));

let contagemDispositivos = 0;

io.on('connection', (socket) => {
    contagemDispositivos++;
    
    // Distribui o público igualmente entre Grupo A e Grupo B de forma alternada
    const grupo = (contagemDispositivos % 2 === 0) ? 'A' : 'B';
    socket.emit('definir_grupo', { grupo: grupo });
    
    console.log(`Dispositivo conectado: ${socket.id} alocado no Grupo ${grupo}`);

    // Escuta os comandos da Mesa de Controle e repassa para a plateia
    socket.on('comando_admin', (data) => {
        io.emit('comando_publico', data); 
    });

    socket.on('disconnect', () => {
        console.log('Dispositivo desconectado');
    });
});

const PORT = 3000;
http.listen(PORT, () => {
    console.log(`PFC — Servidor de Luzes ativo na porta ${PORT}`);
});
