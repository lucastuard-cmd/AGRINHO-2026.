/* ==========================================================================
   1. CONFIGURAÇÃO E INICIALIZAÇÃO
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    initMenuHamburguer();
    initValidacaoFormulario();
    initAnimacaoScroll();
});

/* ==========================================================================
   2. INTERATIVIDADE: MENU RESPONSIVO (HAMBÚRGUER)
   ========================================================================== */
function initMenuHamburguer() {
    const header = document.querySelector('header');
    const nav = document.querySelector('nav');
    
    // Cria o botão dinamicamente caso ele não exista no HTML
    if (!document.querySelector('.menu-toggle')) {
        const botaoMenu = document.createElement('button');
        botaoMenu.classList.add('menu-toggle');
        botaoMenu.innerHTML = '☰';
        botaoMenu.setAttribute('aria-label', 'Abrir menu de navegação');
        
        // Estilização básica via JS para garantir o funcionamento imediato
        botaoMenu.style.display = 'none';
        botaoMenu.style.background = 'none';
        botaoMenu.style.border = 'none';
        botaoMenu.style.fontSize = '1.8rem';
        botaoMenu.style.color = 'var(--verde-escuro)';
        botaoMenu.style.cursor = 'pointer';
        
        header.insertBefore(botaoMenu, nav);

        // Controla a exibição do botão via Media Query do JS
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        function verificarTela(e) {
            if (e.matches) {
                botaoMenu.style.display = 'block';
                nav.style.display = 'none';
            } else {
                botaoMenu.style.display = 'none';
                nav.style.display = 'block';
            }
        }
        mediaQuery.addEventListener('change', verificarTela);
        verificarTela(mediaQuery); // Executa ao carregar

        // Evento de clique para abrir/fechar o menu
        botaoMenu.addEventListener('click', () => {
            const estaAberto = nav.style.display === 'block';
            nav.style.style = ''; // Limpa estilos inline conflitantes
            nav.style.display = estaAberto ? 'none' : 'block';
            botaoMenu.innerHTML = estaAberto ? '☰' : '✕';
            
            if (!estaAberto) {
                nav.style.width = '100%';
                nav.style.textAlign = 'center';
            }
        });

        // Fecha o menu automaticamente ao clicar em qualquer link (mobile)
        const links = nav.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    nav.style.display = 'none';
                    botaoMenu.innerHTML = '☰';
                }
            });
        });
    }
}

/* ==========================================================================
   3. INTELIGÊNCIA: VALIDAÇÃO DO FORMULÁRIO DE CONTATO
   ========================================================================== */
function initValidacaoFormulario() {
    const formulario = document.querySelector('form');
    
    if (!formulario) return;

    formulario.addEventListener('submit', (evento) => {
        evento.preventDefault(); // Impede o envio padrão e o recarregamento da página

        const nome = formulario.querySelector('input[type="text"]').value.trim();
        const email = formulario.querySelector('input[type="email"]').value.trim();
        const mensagem = formulario.querySelector('textarea').value.trim();
        const botaoSubmit = formulario.querySelector('button[type="submit"]');

        // Validação simples de campos vazios
        if (nome === '' || email === '' || mensagem === '') {
            exibirFeedback('Por favor, preencha todos os campos antes de enviar.', '#E65100');
            return;
        }

        // Validação de formato de e-mail por Expressão Regular (Regex)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            exibirFeedback('Por favor, insira um e-mail válido.', '#E65100');
            return;
        }

        // Simulação de comportamento dinâmico de envio de dados
        botaoSubmit.disabled = true;
        botaoSubmit.innerText = 'Enviando...';

        setTimeout(() => {
            // Sucesso no envio fictício
            exibirFeedback(`Obrigado pelo contato, ${nome}! Sua mensagem foi enviada com sucesso. 🌱`, 'var(--verde-principal)');
            formulario.reset();
            botaoSubmit.disabled = false;
            botaoSubmit.innerText = 'Enviar Mensagem';
        }, 1500);
    });
}

// Função auxiliar para criar caixas de alerta dinâmicas e elegantes na tela
function exibirFeedback(texto, corFundo) {
    // Remove alertas antigos para não acumular na tela
    const alertaAntigo = document.querySelector('.alerta-feedback');
    if (alertaAntigo) alertaAntigo.remove();

    const alerta = document.createElement('div');
    alerta.classList.add('alerta-feedback');
    alerta.innerText = texto;
    
    // Estilização dinâmica do alerta
    Object.assign(alerta.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: corFundo,
        color: '#FFFFFF',
        padding: '15px 25px',
        borderRadius: 'var(--borda-raio)',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        fontFamily: 'var(--fonte-titulos)',
        fontWeight: '600',
        zIndex: '2000',
        transition: 'opacity 0.5s ease',
        opacity: '0'
    });

    document.body.appendChild(alerta);
    
    // Efeito suave de surgimento (Fade-in)
    setTimeout(() => alerta.style.opacity = '1', 50);

    // Remove o alerta automaticamente após 4 segundos (Fade-out)
    setTimeout(() => {
        alerta.style.opacity = '0';
        setTimeout(() => alerta.remove(), 500);
    }, 4000);
}

/* ==========================================================================
   4. COMPORTAMENTO: ANIMAÇÃO DE SURGIMENTO AO ROLAR A TELA (SCROLL)
   ========================================================================== */
function initAnimacaoScroll() {
    // Seleciona os elementos que queremos animar (introdução, cards, imagens e listas)
    const elementosParaAnimar = document.querySelectorAll('#introducao p, .card, .imagem, .conteudo div');

    if (elementosParaAnimar.length === 0) return;

    // Configura o estilo inicial oculto via JS (evita problemas se o JS quebrar)
    elementosParaAnimar.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });

    // Cria o observador de recursos modernos dos navegadores (Intersection Observer API)
    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.style.opacity = '1';
                entrada.target.style.transform = 'translateY(0)';
                observador.unobserve(entrada.target); // Para de observar após animar uma vez
            }
        });
    }, {
        threshold: 0.15 // Ativa a animação quando 15% do elemento estiver visível
    });

    elementosParaAnimar.forEach(el => observador.observe(el));
}

