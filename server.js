const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: { origin: "*" }
});

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('Dispositivo conectado: ' + socket.id);

    // Recebe o comando do seu painel e repassa para a plateia
    socket.on('comando_admin', (data) => {
        io.emit('comando_publico', data); 
    });

    socket.on('disconnect', () => {
        console.log('Dispositivo desconectado');
    });
});

const PORT = 3000;
http.listen(PORT, () => {
    console.log(`Servidor de Luzes rodando na porta ${PORT}`);
});
