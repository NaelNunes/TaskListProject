const express = require('express');

const server = express();

const tarefas = [];

function checkIndexTarefa(req,res,next)
{
    const tarefa = tarefas[req.params.index];
    if(!curso)
    {
        return res.status(400).json({ error: "A tarefa não existe!" });
    }

    req.tarefa = tarefa;

    return next();
};

function checkTarefa(req,res,next)
{
    if(!req.body.name)
    {
        return res.status(400).json({ error: "O nome da tarefa é obrigatório!" });
    }

    return next();

};

function checkStatus(req,res,next)
{


};

server.get('/tarefas', (req,res) => {
    return res.json(tarefas);
});

server.get('/tarefas/:index', checkIndexTarefa, (req,res) => {
    const { index } = req.params;

    return res.json(tarefas[index]);
});

server.post('/tarefas/', checkTarefa, (req,res) => {
    
    const { name } = req.body; 

    tarefas.push({
        name: name,
        index: tarefas.length,
        status: 1
    });

    return res.json(tarefas);
});

server.put('/tarefas/:index', checkTarefa, checkIndexTarefa, (req,res) => 
{
    const { index } = req.params;
    const { name } = req.body;

    tarefas[index] = name;

    return res.json(tarefas);

});

server.delete('/tarefas/:index', checkIndexTarefa, (req,res) => {
    const { index } = req.params;

    cursos.splice(index, 1);

    return res.send();
});


server.listen(3000);