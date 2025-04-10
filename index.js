const express = require('express');
const fs = require('fs');
const path = require('path');

const server = express();
server.use(express.json());

const filePath = path.join(__dirname, 'tarefas.json');

// Função para ler tarefas do arquivo
function readTarefas() {
    if (!fs.existsSync(filePath)) {
        return [];
    }
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
}

// Função para escrever tarefas no arquivo
function writeTarefas(tarefas) {
    fs.writeFileSync(filePath, JSON.stringify(tarefas, null, 2));
}

function checkIndexTarefa(req, res, next) {
    const tarefas = readTarefas();
    const tarefa = tarefas[req.params.index];
    if (!tarefa) {
        return res.status(400).json({ error: "A tarefa não existe!" });
    }

    req.tarefa = tarefa;
    return next();
}

function checkTarefa(req, res, next) {
    const { name, description, executionTime } = req.body;
        
    if (!name || !description || !executionTime) {
        return res.status(400).json({ error: "Está faltando um campo!" });
    }

    return next();
}

server.use((req, res, next) => {
    console.log(`URL CHAMADA: ${req.url}`);
    return next();
});

server.get('/tarefas', (req, res) => {
    const tarefas = readTarefas();
    return res.json(tarefas);
});

server.get('/tarefas/:index', checkIndexTarefa, (req, res) => {
    return res.json(req.tarefa);
});

server.post('/tarefas', checkTarefa, (req, res) => {
    const { name, description, executionTime } = req.body;
    const tarefas = readTarefas();

    const newTarefa = {
        id: tarefas.length,
        name: name,
        description: description,
        executionTime: executionTime,
        status: 1
    };

    tarefas.push(newTarefa);
    writeTarefas(tarefas);

    return res.json(tarefas);
});

server.put('/tarefas/:index', checkTarefa, checkIndexTarefa, (req, res) => {
    const { index } = req.params;
    const { name, description, executionTime } = req.body;
    const tarefas = readTarefas();

    tarefas[index].name = name;
    tarefas[index].description = description;
    tarefas[index].executionTime = executionTime;

    writeTarefas(tarefas);

    return res.json(tarefas);
});

server.delete('/tarefas/:index', checkIndexTarefa, (req, res) => {
    const { index } = req.params;
    const tarefas = readTarefas();

    tarefas.splice(index, 1);
    writeTarefas(tarefas);

    return res.json(tarefas);
});

server.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
