document.addEventListener('DOMContentLoaded', function() {

    // =========================================
    // 1. FORMATAR NOME DO PACIENTE
    // =========================================    
    const nomePaciente = "Maria Silva";
    const nomePlano = document.getElementById('nomePlano');

    function formatarNome(nome) {
        const partesNome = nome.split(' ');
        const primeiroNome = partesNome[0];

        if (partesNome.length > 1) {
            const sobrenome = partesNome[partesNome.length - 1];
            const inicialSobrenome = sobrenome.charAt(0);
            return `${primeiroNome} ${inicialSobrenome}`;
        } else {
            return primeiroNome;
        }
    }

    const nomeFormatado = formatarNome(nomePaciente);

    if (nomePlano) {
        nomePlano.innerHTML = `Plano semanal para <span class="nome-paciente">${nomeFormatado}.</span>`;
    }

    // =========================================
    // 2. MODAL: CRIAR NOVA ATIVIDADE
    // =========================================

    const btnSalvarAtividade = document.getElementById('btnSalvarAtividade');
    const inputNome = document.getElementById('inputNomeAtividade');
    const inputDesc = document.getElementById('inputDescAtividade');
    const containerBiblioteca = document.getElementById('listaBiblioteca'); // Usar ID é mais seguro
    const modalElement = document.getElementById('modalNovaAtividade');
    const modalBootstrap = new bootstrap.Modal(modalElement);

    if (btnSalvarAtividade) { 
        btnSalvarAtividade.addEventListener('click', function() {
            const nome = inputNome.value;
            const desc = inputDesc.value;

            if (!nome) {
                alert('Por favor, digite um nome para atividade');
                return;
            }

            const novoCard = document.createElement('li');
            novoCard.className = 'card mb-2 border-1 bg-light atividade-card';
            novoCard.setAttribute('draggable', 'true'); // Adiciona draggable para o futuro

            novoCard.innerHTML = `
                <div class="card-body p-2"> 
                    <h6 class="mb-0 nome-atividade fw-bold">${nome}</h6>
                    <small class="text-muted desc-atividade">${desc}</small>
                </div>
            `;
            
            if (containerBiblioteca) {
                containerBiblioteca.appendChild(novoCard);
            }

            inputNome.value = '';
            inputDesc.value = '';
            modalBootstrap.hide();
        });
    }


    // =========================================
    // 3. MODAL: ADICIONAR ATIVIDADE AO DIA
    // =========================================

    const modalAdicionar = document.getElementById('modalAdicionarAtividade');
    const corpoModal = document.getElementById('corpoModalBiblioteca');
    const instanciaModalAdicionar = new bootstrap.Modal(modalAdicionar);
    let diaAlvoParaAdicionar = null;

    if (modalAdicionar) {
        modalAdicionar.addEventListener('show.bs.modal', function(event) {
            const botaoClicado = event.relatedTarget;
            const targetId = botaoClicado.getAttribute('data-day-target-id');
            diaAlvoParaAdicionar = document.getElementById(targetId);
            corpoModal.innerHTML = '';

            const atividadesDaBiblioteca = document.querySelectorAll('#listaBiblioteca .atividade-card');

            atividadesDaBiblioteca.forEach(atividadeOriginal => {
                const cloneParaModal = atividadeOriginal.cloneNode(true);
                
                cloneParaModal.addEventListener('click', function() {
                    adicionarAtividadeNoDia(cloneParaModal, diaAlvoParaAdicionar);
                });

                corpoModal.appendChild(cloneParaModal);
            });
        });

        modalAdicionar.addEventListener('hidden.bs.modal', function() {
            diaAlvoParaAdicionar = null;
            corpoModal.innerHTML = ''; // Economiza memória
        });
    }

    function adicionarAtividadeNoDia(itemDoModal, diaAlvo) {
        if (!diaAlvo) return; // Segurança

        const cloneParaDia = itemDoModal.cloneNode(true);
        

        cloneParaDia.classList.remove('bg-light');
        cloneParaDia.classList.add('button-gradient'); // Você pode criar esta classe no CSS
        
        // Adiciona ao <ul> do dia
        diaAlvo.appendChild(cloneParaDia);

        // Fecha o modal
        instanciaModalAdicionar.hide();
    }


    // =========================================
    // 4. FUNÇÃO DE PESQUISA NA BIBLIOTECA
    // =========================================
    const inputPesquisa = document.getElementById('inputPesquisaBiblioteca');
    const listaBiblioteca = document.getElementById('listaBiblioteca');

    if (inputPesquisa && listaBiblioteca) {
        inputPesquisa.addEventListener('input', function() {
            const termoPesquisa = this.value.toLowerCase().trim();
            const cards = listaBiblioteca.getElementsByClassName('atividade-card');

            Array.from(cards).forEach(card => {
                const tituloCard = card.querySelector('h6')?.textContent.toLowerCase() || '';
                const descCard = card.querySelector('small')?.textContent.toLowerCase() || '';

                if (termoPesquisa === '' || tituloCard.includes(termoPesquisa) || descCard.includes(termoPesquisa)) {
                    card.style.display = ''; // Mostra o card
                } else {
                    card.style.display = 'none'; // Esconde o card
                }
            });
        });
    }

    // =========================================
    // 5. DRAG AND DROP (Arrastar e Soltar)
    // =========================================
    
    // O container 'listaBiblioteca' já foi selecionado na Seção 2 e 4. 
    // Vamos apenas reusar a variável 'containerBiblioteca' ou 'listaBiblioteca' (são o mesmo elemento)
    
    // Seleciona todos os botões "+" que servem como zona de soltar
    const dropZoneButtons = document.querySelectorAll('[data-bs-target="#modalAdicionarAtividade"]');

    // 1. Evento DRAGSTART: Quando começamos a arrastar um item da biblioteca
    if (listaBiblioteca) {
        // Usamos delegação de evento, pois os itens são adicionados dinamicamente
        listaBiblioteca.addEventListener('dragstart', function(e) {
            // Confirma que o alvo é um 'atividade-card' dentro da biblioteca
            const card = e.target.closest('.atividade-card');
            if (card && listaBiblioteca.contains(card)) {
                const nome = card.querySelector('.nome-atividade').textContent;
                const desc = card.querySelector('.desc-atividade').textContent;
                
                // Armazena os dados da atividade em formato JSON
                e.dataTransfer.setData('text/json', JSON.stringify({ nome, desc }));
                e.dataTransfer.effectAllowed = 'copy'; // Indica que é uma operação de "cópia"
            }
        });
    }

    // 2. Eventos nas Zonas de Drop (os botões "+")
    if (dropZoneButtons.length > 0) {
        dropZoneButtons.forEach(button => {
            
            // Evento DRAGOVER: Necessário para permitir o 'drop'
            button.addEventListener('dragover', function(e) {
                e.preventDefault(); // ISSO É ESSENCIAL!
                e.dataTransfer.dropEffect = 'copy';
                button.classList.add('drag-over-active'); // Adiciona o feedback visual
            });

            // Evento DRAGLEAVE: Remove o feedback visual
            button.addEventListener('dragleave', function(e) {
                button.classList.remove('drag-over-active');
            });

            // Evento DROP: A mágica acontece aqui
            button.addEventListener('drop', function(e) {
                e.preventDefault(); // Previne comportamento padrão (ex: abrir link)
                button.classList.remove('drag-over-active');
                
                // 1. Pega os dados que salvamos no 'dragstart'
                try {
                    const data = JSON.parse(e.dataTransfer.getData('text/json'));
                    const { nome, desc } = data;

                    // 2. Descobre para qual dia a atividade deve ir (pelo atributo do botão)
                    const targetId = button.getAttribute('data-day-target-id');
                    const diaAlvo = document.getElementById(targetId);

                    if (diaAlvo && nome) { // Checa se os dados existem
                        // 3. Cria o novo card (lógica similar à sua função adicionarAtividadeNoDia)
                        const cloneParaDia = document.createElement('li');
                        // Adiciona as classes do card que fica no dia
                        cloneParaDia.className = 'card mb-2 border-1 atividade-card button-gradient'; 
                        cloneParaDia.setAttribute('draggable', 'true'); // Opcional: permite arrastar *dos* dias

                        cloneParaDia.innerHTML = `
                            <div class="card-body p-2"> 
                                <h6 class="mb-0 nome-atividade fw-bold">${nome}</h6>
                                <small class="text-muted desc-atividade">${desc}</small>
                            </div>
                        `;
                        
                        // 4. Adiciona o card ao <ul> do dia correspondente
                        diaAlvo.appendChild(cloneParaDia);
                    }
                } catch (error) {
                    console.error("Erro ao processar o drop:", error);
                }
            });
        });
    }

}); // Fim do 'DOMContentLoaded' a estilização do background do items adicionados devem estar iguais os já tem 