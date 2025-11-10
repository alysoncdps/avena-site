document.addEventListener('DOMContentLoaded', function() {
    const nomePaciente = "Maria Silva"

    const nomePlano= document.getElementById('nomePlano')

    function formatarNome(nome) {
        const partesNome = nome.split(' ')

        const primeiroNome = partesNome[0]

        if (partesNome.length > 1) {
            const sobrenome = partesNome[partesNome.length - 1]

            const inicialSobrenome = sobrenome.charAt(0)
            
            return `${primeiroNome} ${inicialSobrenome}`
        } else {
            return primeiroNome
        }
    }

    const nomeFormatado = formatarNome(nomePaciente)

     if (nomePlano) {
        nomePlano.innerHTML = `Plano semanal para <span class="nome-paciente">${nomeFormatado}.</span>`
     }
})



const btnSalvarAtividade = document.getElementById('btnSalvarAtividade');
const inputNome = document.getElementById('inputNomeAtividade');
const inputDesc = document.getElementById('inputDescAtividade');
const containerBiblioteca = document.querySelector('.biblioteca-scroll');
const modalElement = document.getElementById('modalNovaAtividade');
const modalBootstrap = new bootstrap.Modal(modalElement);

btnSalvarAtividade.addEventListener('click', function(){
    const nome = inputNome.value;
    const desc = inputDesc.value;

    if (!nome){
        alert('Por favor, digite um nome para atividade');
        return;
    }

    const novoCard = document.createElement('div');
    novoCard.className = 'card mb-2 border-1 bg-light atividade-card'; 
    
    novoCard.innerHTML = `
        <div class="card-body p-2">
            <h6 class="mb-0 nome-atividade fw-bold">${nome}</h6>
            <small class="text-muted desc-atividade">${desc}</small>
        </div>
    `;

    containerBiblioteca.appendChild(novoCard);

    // Limpa e fecha o modal
    inputNome.value = '';
    inputDesc.value = '';
    modalBootstrap.hide();
});




const modalAdicionar = document.getElementById('modalAdicionarAtividade');
const corpoModal = document.getElementById('corpoModalBiblioteca');
const instanciaModalAdicionar = new bootstrap.Modal(modalAdicionar);


let diaAlvoParaAdicionar = null; 


modalAdicionar.addEventListener('show.bs.modal', function (event) {
    
 
    const botaoClicado = event.relatedTarget; 
    

    const targetId = botaoClicado.getAttribute('data-day-target-id');
    

    diaAlvoParaAdicionar = document.getElementById(targetId);

    corpoModal.innerHTML = '';

    const atividadesDaBiblioteca = document.querySelectorAll('.biblioteca-scroll .atividade-card');

    atividadesDaBiblioteca.forEach(atividadeOriginal => {
        
        const cloneParaModal = atividadeOriginal.cloneNode(true);
        
        cloneParaModal.addEventListener('click', function () {
            adicionarAtividadeNoDia(cloneParaModal, diaAlvoParaAdicionar);
        });

        corpoModal.appendChild(cloneParaModal);
    });
});

function adicionarAtividadeNoDia(itemDoModal, diaAlvo) {
    if (!diaAlvo) return; // Segurança

    const cloneParaDia = itemDoModal.cloneNode(true);
    
    cloneParaDia.replaceWith(cloneParaDia.cloneNode(true));

    const tituloDoClone = cloneParaDia.querySelector('.nome-atividade')
    if (tituloDoClone) {
        tituloDoClone.classList.add('fw-bold')
    }

    cloneParaDia.classList.remove('bg-light')
    cloneParaDia.classList.add('background-primary')
    diaAlvo.appendChild(cloneParaDia);

    instanciaModalAdicionar.hide();
}


modalAdicionar.addEventListener('hidden.bs.modal', function () {
    diaAlvoParaAdicionar = null;
    corpoModal.innerHTML = ''; // Economiza memória
});



