const express = require('express');

const server = express();

server.use(express.json());

const tarefas = [];

function checkIndexTarefa(req, res, next) {
    const tarefa = tarefas[req.params.index];
    if (!tarefa) {
        return res.status(400).json({ error: "A tarefa não existe!" });
    }

    req.tarefa = tarefa;

    return next();
}

function checkTarefa(req, res, next) {
    if (!req.body.name) {
        return res.status(400).json({ error: "O nome da tarefa é obrigatório!" });
    }

    return next();
}

server.use((req, res, next) => {
    console.log(`URL CHAMADA: ${req.url}`);
    return next();
});

server.get('/tarefas', (req, res) => {
    return res.json(tarefas);
});

server.get('/tarefas/:index', checkIndexTarefa, (req, res) => {
    return res.json(req.tarefa);
});

server.post('/tarefas', checkTarefa, (req, res) => {
    const { name } = req.body;

    tarefas.push({
        name: name,
        index: tarefas.length,
        status: 1
    });

    return res.json(tarefas);
});

server.put('/tarefas/:index', checkTarefa, checkIndexTarefa, (req, res) => {
    const { index } = req.params;
    const { name } = req.body;

    tarefas[index].name = name;

    return res.json(tarefas);
});

server.delete('/tarefas/:index', checkIndexTarefa, (req, res) => {
    const { index } = req.params;

    tarefas.splice(index, 1);

    return res.send();
});

server.listen(3000);
