// O endereço do seu app.py conforme informado
const API_BASE_URL = 'http://10.129.224.164:5000';

const showToast = (msg) => {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = msg;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
};

// Buscar todas as ordens
async function carregarOrdens() {
    const loader = document.getElementById('loader');
    const tbody = document.querySelector('#tabelaOrdens tbody');
    
    loader.classList.remove('hidden');
    tbody.innerHTML = '';

    try {
        const response = await fetch(`${API_BASE_URL}/ordens`);
        const ordens = await response.json();
        
        document.getElementById('contador').innerText = `${ordens.length} Ordens ativas`;

        ordens.forEach(o => {
            const tr = document.createElement('tr');
            // Formata o status para CSS
            const statusClass = o.status.toLowerCase().replace(' ', '-');
            
            tr.innerHTML = `
                <td>#${o.id}</td>
                <td style="font-weight:600">${o.produto}</td>
                <td>${o.quantidade}</td>
                <td><span class="status-tag ${statusClass}">${o.status}</span></td>
                <td style="color:#64748b; font-size:12px">${o.criado_em}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) {
        showToast('Erro ao conectar com o servidor!');
        console.error(err);
    } finally {
        loader.classList.add('hidden');
    }
}

// Criar nova ordem
document.getElementById('formOrdem').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const dados = {
        produto: document.getElementById('produto').value,
        quantidade: document.getElementById('quantidade').value,
        status: 'Pendente'
    };

    try {
        const response = await fetch(`${API_BASE_URL}/ordens`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (response.ok) {
            showToast('Ordem criada com sucesso!');
            document.getElementById('formOrdem').reset();
            carregarOrdens();
        } else {
            showToast('Erro ao validar dados.');
        }
    } catch (err) {
        showToast('Erro de conexão!');
    }
});

// Inicialização
window.onload = carregarOrdens;