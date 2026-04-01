const API_URL = 'http://localhost:5000/ordens';

// Função para carregar as ordens do banco de dados
async function carregarOrdens() {
    try {
        const response = await fetch(API_URL);
        const ordens = await response.json();
        
        const tbody = document.querySelector('#tabelaOrdens tbody');
        tbody.innerHTML = ''; // Limpa a tabela antes de carregar

        ordens.forEach(ordem => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${ordem.id}</td>
                <td>${ordem.produto}</td>
                <td>${ordem.quantidade}</td>
                <td class="status-${ordem.status.toLowerCase().replace(' ', '')}">${ordem.status}</td>
                <td>${new Date(ordem.criado_em).toLocaleString('pt-BR')}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Erro ao carregar ordens:', error);
    }
}

// Função para criar uma nova ordem
document.getElementById('formOrdem').addEventListener('submit', async (e) => {
    e.preventDefault(); // Impede a página de recarregar

    const produto = document.getElementById('produto').value;
    const quantidade = document.getElementById('quantidade').value;

    const novaOrdem = {
        produto: produto,
        quantidade: parseInt(quantidade),
        status: 'Pendente'
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novaOrdem)
        });

        if (response.ok) {
            alert('Ordem criada com sucesso!');
            document.getElementById('formOrdem').reset(); // Limpa o form
            carregarOrdens(); // Atualiza a tabela
        } else {
            const erro = await response.json();
            alert('Erro: ' + erro.erro);
        }
    } catch (error) {
        console.error('Erro ao criar ordem:', error);
    }
});

// Inicia carregando os dados quando a página abre
carregarOrdens();