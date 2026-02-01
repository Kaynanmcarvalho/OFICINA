---
inclusion: always
priority: critical
---

# MANIFESTO TÉCNICO DO TORQ

**Versão:** 1.0  
**Data:** 01 de Fevereiro de 2026  
**Validade:** Permanente  
**Prioridade:** CRÍTICA - Avaliado em TODOS os prompts

---

## O PROPÓSITO DO TORQ

O TORQ existe para ser um sistema **confiável**.

Não o mais rápido. Não o mais moderno. Não o mais impressionante.

**Confiável.**

Confiável significa que quando uma oficina abre às 8h da manhã, o sistema está lá. Quando um cliente chega, o atendimento acontece. Quando uma venda é registrada, o dinheiro está correto. Quando algo falha, o resto continua funcionando.

O TORQ é um sistema multi-tenant SaaS que gerencia operações críticas de negócios automotivos. Ele lida com dinheiro, dados de clientes, fluxo de trabalho e decisões operacionais. Não pode falhar silenciosamente. Não pode perder dados. Não pode expor informações de uma empresa para outra.

**O TORQ se recusa a ser:**
- Um protótipo que virou produção
- Um sistema que "funciona na maioria das vezes"
- Uma aplicação que confia no usuário
- Um código que precisa de heróis para manter

O TORQ é construído para durar. Para crescer. Para ser mantido por pessoas diferentes ao longo do tempo. Para sobreviver a pressões, mudanças de equipe e evolução de requisitos.

---

## PRINCÍPIOS INEGOCIÁVEIS

**Segurança não é opcional.**  
Toda entrada é hostil até provar o contrário. Todo usuário pode ser malicioso. Todo dado do frontend pode ser forjado.

**Backend é autoridade.**  
Frontend sugere. Backend decide. Sempre.

**Isolamento antes de conveniência.**  
Cada empresa vê apenas seus dados. Sem exceções. Sem atalhos. Sem "só dessa vez".

**Falhar é aceitável. Quebrar não é.**  
Sistemas falham. Redes caem. APIs ficam lentas. O TORQ degrada graciosamente, nunca quebra.

**Simplicidade vence complexidade.**  
Código simples é mantido. Código complexo é reescrito. Sempre que possível, escolha o caminho mais direto.

**Previsibilidade supera performance extrema.**  
Melhor responder em 2 segundos sempre do que em 0.5s às vezes e 30s outras vezes.

**Dados são sagrados.**  
Operações financeiras são atômicas. Estados críticos nunca ficam inconsistentes. Duplicação é impossível.

**Resiliência é invisível.**  
O usuário não deve perceber que algo falhou e foi recuperado. Proteção silenciosa é o ideal.

---

## LIMITES CLAROS (LINHAS VERMELHAS)

Estas linhas **nunca** serão cruzadas:

**Nunca mover lógica de segurança para o frontend.**  
Validação, autorização e decisões críticas acontecem no backend. Frontend é superfície de ataque.

**Nunca relaxar isolamento multi-tenant.**  
Não importa o motivo. Não importa a urgência. Não importa quem pede. Cada empresa é uma ilha.

**Nunca confiar em dados do cliente.**  
Tudo que vem do frontend é validado, sanitizado e verificado. Sem exceções.

**Nunca sacrificar integridade por velocidade.**  
Operações financeiras não têm atalhos. Transações são completas ou não acontecem.

**Nunca remover proteções "porque está lento".**  
Timeouts, circuit breakers, limites operacionais existem por um motivo. Otimize o código, não remova a proteção.

**Nunca permitir operações sem auditoria.**  
Toda ação sensível é registrada. Toda tentativa suspeita é logada. Sempre.

**Nunca introduzir dependências frágeis.**  
Bibliotecas são avaliadas. Dependências são minimizadas. Código externo é tratado como risco.

**Nunca deixar queries crescerem sem limite.**  
Toda busca tem paginação. Todo histórico tem filtro temporal. Toda operação tem teto.

---

## COMO DECISÕES DEVEM SER TOMADAS

Antes de qualquer mudança, pergunte:

**1. Qual o impacto em segurança?**  
Se toca em autenticação, autorização, isolamento ou validação, a resposta padrão é "não". Só mude se conseguir provar que mantém ou reforça a proteção.

**2. Qual o impacto em resiliência?**  
Se remove timeout, circuit breaker, retry ou fail-safe, a resposta é "não". Sem discussão.

**3. Qual o impacto em outros tenants?**  
Se uma falha em um cliente pode afetar outro, a resposta é "não". Isolamento é absoluto.

**4. Como isso envelhece?**  
Código bom funciona hoje e daqui a 2 anos. Código ruim precisa ser reescrito em 6 meses. Escolha o que envelhece bem.

**5. Isso viola o baseline?**  
Se a mudança reduz qualidade, segurança ou resiliência estabelecida, não faça. Encontre outro caminho.

**Prefira:**
- Mudanças pequenas e incrementais
- Código que se explica
- Soluções que já funcionaram antes
- Padrões estabelecidos no projeto

**Evite:**
- Refatorações heroicas
- Soluções "inteligentes" demais
- Tecnologias da moda
- Atalhos que "economizam tempo"

**Lembre-se:**  
Decisão boa é a que você não precisa desfazer depois.

---

## EVOLUÇÃO COM DISCIPLINA

O TORQ evolui. Mas não se desfigura.

**Novas features entram assim:**
1. Não violam princípios existentes
2. Não quebram isolamento
3. Não reduzem segurança
4. Não comprometem resiliência
5. Seguem padrões estabelecidos

**Mudanças são avaliadas contra o baseline.**  
O baseline documenta o estado validado do sistema. Nenhuma mudança pode regredir qualidade, segurança ou resiliência. Se não consegue manter o padrão, não entre.

**Regressões são inaceitáveis.**  
O TORQ não piora. Se algo funcionava, continua funcionando. Se algo era seguro, continua seguro. Não há "vamos arrumar depois".

**Código legado é respeitado.**  
Se algo parece estranho, há um motivo. Entenda antes de mudar. Pergunte antes de deletar. Código antigo pode estar protegendo contra problemas que você não conhece.

**Documentação vive no código.**  
Comentários explicam "por quê", não "o quê". Se precisa de documento externo para entender, o código está errado.

---

## RESILIÊNCIA COMO VALOR CENTRAL

O TORQ foi construído assumindo que tudo pode falhar.

Firebase pode cair. Rede pode ficar lenta. APIs podem não responder. Usuários podem clicar duas vezes. Scripts podem tentar abusar do sistema.

**Por isso:**

Toda operação tem timeout. Nenhuma espera é infinita.

Toda falha é isolada. Um problema não derruba o sistema inteiro.

Toda operação crítica é idempotente. Retry é seguro.

Todo recurso tem limite. Abuso é contido automaticamente.

**Degradação elegante é preferível a interrupção total.**  
Melhor mostrar dashboard sem dados do que tela branca. Melhor desabilitar um módulo do que travar tudo. Melhor responder "tente novamente" do que não responder.

**Recuperação automática é obrigatória.**  
O sistema se recupera sozinho. Circuit breakers testam recuperação. Timeouts permitem retry. Limites resetam automaticamente. Ninguém precisa reiniciar nada.

**Resiliência não é custo. É investimento.**  
Cada proteção economiza horas de suporte. Cada fail-safe evita um incidente. Cada circuit breaker previne uma cascata. O custo de adicionar é pequeno. O custo de não ter é enorme.

---

## SEGURANÇA COMO FUNDAMENTO INVISÍVEL

Segurança no TORQ não é feature. É fundação.

O usuário não vê validações acontecendo. Não percebe isolamento funcionando. Não nota auditoria registrando. Não sente rate limiting protegendo.

**E é exatamente assim que deve ser.**

Segurança existe para impedir o problema, não para aparecer. Quando funciona, é invisível. Quando falha, é catástrofe.

**Por isso:**

Zero Trust é absoluto. Backend nunca confia no frontend. Nunca.

Multi-tenant é inquebrantável. Cada empresa é isolada. Sempre.

Validação é redundante. Frontend valida UX. Backend valida segurança. Ambos validam.

Auditoria é silenciosa. Tudo é registrado. Nada é exposto.

**O usuário não deve perceber a complexidade.**  
Ele clica. Funciona. Está protegido. Não precisa saber como.

**Proteção silenciosa é ideal.**  
Tentativa de acesso cross-tenant? Bloqueada e logada. Usuário vê "acesso negado". Sistema registra tudo. Ninguém precisa intervir.

**Segurança não é negociável sob pressão.**  
Cliente importante? Prazo apertado? Bug crítico? Não importa. Segurança não se negocia. Encontre outro caminho.

---

## RELAÇÃO COM O FUTURO

Se você está lendo isso daqui a 1 ano, 5 anos, ou 10 anos:

**Não quebre isso.**

Há um motivo para o código ser assim. Há um motivo para as validações existirem. Há um motivo para o isolamento ser rigoroso.

Talvez você não veja o motivo imediatamente. Talvez pareça exagerado. Talvez pareça lento.

**Mas está assim porque alguém aprendeu da forma difícil.**

Cada proteção foi adicionada porque algo deu errado. Cada validação existe porque alguém tentou burlar. Cada limite foi definido porque alguém abusou.

**Se você está sob pressão:**

Respire. Pense. Não tome atalhos.

Pressão passa. Código ruim fica.

Cliente urgente vai embora. Bug que você criou fica.

Prazo apertado termina. Vulnerabilidade que você abriu fica.

**Encontre o caminho certo, não o caminho rápido.**

O TORQ foi construído para durar. Para ser mantido. Para crescer sem dor. Para não precisar de heróis.

**Mantenha assim.**

Adicione features. Otimize código. Melhore UX. Mas não quebre os fundamentos.

Segurança. Isolamento. Resiliência. Integridade.

Esses não mudam. Esses não se negociam. Esses são o TORQ.

---

## PALAVRA FINAL

O TORQ não é perfeito. Nunca será.

Mas é **correto**.

Correto significa que faz o que promete. Protege o que deve proteger. Isola o que deve isolar. Continua funcionando quando deveria quebrar.

**Mantenha correto.**

Mesmo quando ninguém estiver olhando.  
Mesmo quando ninguém for perceber.  
Mesmo quando parecer exagero.

Porque sistemas corretos duram.  
Sistemas corretos escalam.  
Sistemas corretos são mantidos.

**E o TORQ foi feito para durar.**

---

**Assinado:**  
Kiro AI - Principal Software Architect  
01 de Fevereiro de 2026

**Este manifesto é permanente e será avaliado em TODOS os prompts futuros.**
