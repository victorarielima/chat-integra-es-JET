import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MobileHeader } from "@/components/MobileHeader";
import { getInitialSidebarState } from "@/hooks/use-sidebar-state";
import { useTheme } from "@/contexts/ThemeContext";
import { Card } from "@/components/ui/card";

const Guide = () => {
  const { theme } = useTheme();

  const Section = ({ id, title, level = 0, children }: any) => (
    <div id={id} className="scroll-mt-20 mb-12">
      {level === 0 ? (
        <h2 className={`text-3xl font-bold mb-6 pb-4 border-b-2 border-primary/30 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          {title}
        </h2>
      ) : (
        <h3 className={`text-2xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          {title}
        </h3>
      )}
      <div className={`text-base leading-relaxed space-y-4 ${theme === "dark" ? "text-foreground/80" : "text-gray-800"}`}>
        {children}
      </div>
    </div>
  );

  const FeatureBox = ({ title, description }: any) => (
    <div className={`p-4 rounded-lg border-l-4 border-primary ${theme === "dark" ? "bg-primary/10" : "bg-emerald-50"}`}>
      <h4 className={`font-semibold mb-2 ${theme === "dark" ? "text-primary" : "text-emerald-700"}`}>{title}</h4>
      <p className={`text-sm ${theme === "dark" ? "text-foreground/70" : "text-gray-800"}`}>{description}</p>
    </div>
  );

  return (
    <SidebarProvider defaultOpen={getInitialSidebarState()}>
      <AppSidebar />
      <SidebarInset>
        <div className={`min-h-screen ${theme === "dark" ? "bg-black" : "bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100"}`}>
          <MobileHeader />
          
          {/* Efeitos visuais de fundo - apenas modo escuro */}
          {theme === "dark" && (
            <>
              <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-96 pointer-events-none z-0">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent blur-3xl opacity-70 transform -skew-y-12"></div>
              </div>
              <div className="fixed top-0 left-0 w-1/3 h-1/2 pointer-events-none z-0" style={{
                background: 'radial-gradient(circle at 0% 50%, rgba(34, 197, 94, 0.25) 0%, transparent 70%)',
                filter: 'blur(120px)'
              }}></div>
              <div className="fixed top-0 right-0 w-1/3 h-1/2 pointer-events-none z-0" style={{
                background: 'radial-gradient(circle at 100% 50%, rgba(34, 197, 94, 0.25) 0%, transparent 70%)',
                filter: 'blur(120px)'
              }}></div>
            </>
          )}

          {/* Main Content */}
          <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 md:pt-6 pt-16 relative z-10">
            {/* Página Chat */}
            <Section id="pagina-chat" title="Página Chat">
                  <p>
                    A página Chat é onde você interage com o assistente de IA para criar integrações, fazer perguntas e receber recomendações. É o centro de sua experiência na plataforma.
                  </p>
                  <p className="mt-4">
                    Você pode ter conversas naturais sobre o que deseja integrar, e o sistema sugere automaticamente as melhores práticas e soluções.
                  </p>

                  <div id="botao-mais" className="mt-8">
                    <h3 className={`text-2xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-black"}`}>
                      Botão '+' (Adicionar Integração)
                    </h3>
                    <p>
                      O botão '+' (mais) fica localizado no lado esquerdo dentro do campo de chat/input. Ele permite você criar uma nova integração de forma estruturada. Ao clicar, um dropdown de integrações aparece acima do campo de entrada.
                    </p>
                    
                    <div className="mt-6 space-y-4">
                      <FeatureBox 
                        title="Localização"
                        description="O botão '+' com uma seta (dropdown) fica no lado esquerdo do campo de chat, junto com o campo de entrada de mensagem."
                      />
                      <FeatureBox 
                        title="Passo 1: Abrir Dropdown"
                        description="Clique no botão '+' para exibir a lista de todas as integrações disponíveis no sistema em um dropdown organizado."
                      />
                      <FeatureBox 
                        title="Passo 2: Selecionar Integração"
                        description="Escolha a plataforma com a qual deseja integrar (Asaas, RD Station, Pipedrive, etc) clicando no seu nome no dropdown."
                      />
                      <FeatureBox 
                        title="Passo 3: Selecionar Ações"
                        description="Após selecionar uma integração, você pode escolher quais ações específicas deseja realizar. Cada integração possui diferentes ações disponíveis."
                      />
                      <FeatureBox 
                        title="Passo 4: Escolher Tipo"
                        description="Defina se deseja uma 'Integração' simples ou um 'Agente de IA' mais inteligente e autônomo para executar a tarefa."
                      />
                      <FeatureBox 
                        title="Passo 5: Confirmar e Enviar"
                        description="Revise suas escolhas e o sistema formatará uma mensagem com sua solicitação, que será enviada para o assistente processar."
                      />
                    </div>
                  </div>

                  <div id="enviar-mensagem" className="mt-8">
                    <h3 className={`text-2xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-black"}`}>
                      Enviar Mensagem
                    </h3>
                    <p>
                      Você pode digitar mensagens na caixa de entrada (textarea) na parte inferior da página. Pressione Enter ou clique no botão de envio para enviar sua mensagem.
                    </p>
                    <div className="mt-6 space-y-4">
                      <FeatureBox 
                        title="Textarea Auto-Redimensionável"
                        description="A caixa de texto cresce automaticamente conforme você digita, até um máximo de altura para manter a interface organizada."
                      />
                      <FeatureBox 
                        title="Histórico de Conversas"
                        description="Todas as suas mensagens e respostas do assistente são mantidas no histórico, permitindo você fazer referência a conversas anteriores."
                      />
                      <FeatureBox 
                        title="Scroll Automático"
                        description="A página automaticamente rola para a última mensagem, mantendo a conversa sempre visível."
                      />
                    </div>
                  </div>
                </Section>

                {/* Página Integrações */}
                <Section id="pagina-integracoes" title="Página de Integrações">
                  <p>
                    A página de Integrações exibe todas as plataformas disponíveis para integração. Ela está organizada por categorias para facilitar a navegação e exploração.
                  </p>

                  <div id="barra-busca-integracao" className="mt-8">
                    <h3 className={`text-2xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-black"}`}>
                      Barra de Busca
                    </h3>
                    <p>
                      Localizada no topo da página, a barra de busca permite filtrar integrações por nome ou categoria em tempo real.
                    </p>
                    <div className="mt-6">
                      <FeatureBox 
                        title="Busca em Tempo Real"
                        description="Conforme você digita, a lista de integrações é filtrada instantaneamente, mostrando apenas os resultados relevantes."
                      />
                      <p className="mt-4">
                        <strong>Exemplos de busca:</strong>
                      </p>
                      <ul className={`list-disc list-inside mt-2 space-y-2 ${theme === "dark" ? "text-foreground/70" : "text-gray-600"}`}>
                        <li>Digite "CRM" para ver todas as integrações de CRM</li>
                        <li>Digite "Pipedrive" para encontrar a integração Pipedrive</li>
                        <li>Digite "Financeiro" para ver integrações de sistemas financeiros</li>
                      </ul>
                    </div>
                  </div>

                  <div id="categorias" className="mt-8">
                    <h3 className={`text-2xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-black"}`}>
                      Categorias de Integrações
                    </h3>
                    <p>
                      As integrações estão organizadas em seções por categoria. Cada seção possui um título destacado com uma linha decorativa.
                    </p>
                    <div className="mt-6 space-y-4">
                      <FeatureBox 
                        title="CRM / Vendas"
                        description="Integrações para sistemas de gestão de relacionamento com clientes como Pipedrive. Ideais para gerenciar leads, negócios e contatos."
                      />
                      <FeatureBox 
                        title="Financeiro / ERP"
                        description="Sistemas como Asaas, Fasouto, Tiny e vhsys. Usados para gestão financeira, cobranças e operações empresariais."
                      />
                      <FeatureBox 
                        title="Marketing"
                        description="Plataformas como RD Station. Excelentes para automação de marketing, geração de leads e nurturing."
                      />
                      <FeatureBox 
                        title="Marketing / Email"
                        description="Ferramentas como Mailchimp. Especializadas em email marketing e gerenciamento de listas de contatos."
                      />
                      <FeatureBox 
                        title="Integrações / APIs"
                        description="Webhooks e integrações genéricas. Perfeitas para conectar com sistemas customizados."
                      />
                    </div>
                  </div>

                  <div id="card-integracao" className="mt-8">
                    <h3 className={`text-2xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-black"}`}>
                      Card de Integração
                    </h3>
                    <p>
                      Cada integração é exibida como um card dentro de sua categoria. O card apresenta informações essenciais sobre a plataforma.
                    </p>
                    <div className="mt-6 space-y-4">
                      <FeatureBox 
                        title="Nome da Integração"
                        description="Exibido em grande destaque no topo do card, identificando a plataforma."
                      />
                      <FeatureBox 
                        title="Descrição"
                        description="Um texto breve explicando o propósito da integração e sua utilidade."
                      />
                      <FeatureBox 
                        title="Quantidade de Ações"
                        description="Exibida na parte inferior com um ícone de código, mostrando quantas ações (endpoints) estão disponíveis para esta integração."
                      />
                      <FeatureBox 
                        title="Efeito de Hover"
                        description="Ao passar o mouse sobre o card, ele recebe um efeito de luz sutilmente aumentado (brilho de fundo) e uma sombra suave."
                      />
                      <FeatureBox 
                        title="Seta de Navegação"
                        description="Um ícone de seta (chevron) no canto superior direito que se move ligeiramente no hover, indicando que o card é clicável."
                      />
                    </div>
                  </div>

                  <div id="detalhes-integracao" className="mt-8">
                    <h3 className={`text-2xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-black"}`}>
                      Detalhes da Integração
                    </h3>
                    <p>
                      Ao clicar em um card de integração, você é levado para a página de detalhes que mostra informações completas sobre a plataforma.
                    </p>
                    <div className="mt-6 space-y-4">
                      <FeatureBox 
                        title="Nome e Descrição"
                        description="A página começa com o nome em destaque e uma descrição completa da integração."
                      />
                      <FeatureBox 
                        title="Categoria"
                        description="Um badge mostrando a categoria da integração."
                      />
                      <FeatureBox 
                        title="Total de Ações"
                        description="Um número grande mostrando quantas ações estão disponíveis para esta integração."
                      />
                      <FeatureBox 
                        title="Lista de Ações"
                        description="Cada ação é exibida com detalhes como: Nome, Método HTTP (GET, POST, PATCH), Endpoint da API, Tipo de Autenticação, Descrição detalhada e Observações importantes."
                      />
                      <FeatureBox 
                        title="Botão Voltar"
                        description="No topo da página, um botão permite retornar à página de integrações com um efeito de hover melhorado."
                      />
                    </div>
                  </div>
                </Section>

                {/* Página Insights */}
                <Section id="pagina-insights" title="Página de Insights">
                  <p>
                    A página de Insights oferece sugestões inteligentes de automação e possibilidades de integração para cada plataforma. É onde você descobre novas formas de otimizar seus processos.
                  </p>

                  <div id="barra-busca-insights" className="mt-8">
                    <h3 className={`text-2xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-black"}`}>
                      Barra de Busca
                    </h3>
                    <p>
                      A barra de busca permite filtrar insights por plataforma ou conteúdo de sugestão.
                    </p>
                    <div className="mt-6">
                      <FeatureBox 
                        title="Busca Inteligente"
                        description="A busca funciona tanto pelo nome da plataforma quanto pelo texto do insight, permitindo encontrar exatamente o que você procura."
                      />
                    </div>
                  </div>

                  <div id="card-insight" className="mt-8">
                    <h3 className={`text-2xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-black"}`}>
                      Estrutura de Cards de Insight
                    </h3>
                    <p>
                      Os insights são agrupados por plataforma/sistema. Cada sistema tem uma seção com título destacado mostrando o nome e a quantidade de insights disponíveis.
                    </p>
                    <div className="mt-6 space-y-4">
                      <FeatureBox 
                        title="Título da Seção"
                        description="O nome da plataforma (ex: 'Pipedrive', 'Asaas') com uma barra decorativa verde à esquerda."
                      />
                      <FeatureBox 
                        title="Badge de Contagem"
                        description="Mostra quantos insights estão disponíveis para aquela plataforma."
                      />
                      <FeatureBox 
                        title="Card Individual"
                        description="Cada insight é um card com borda esquerda verde mostrando o número do insight ou tipo (🤖 Agente de IA, 🔗 Integração)."
                      />
                      <FeatureBox 
                        title="Indicador de Tipo"
                        description="Cada insight mostra se é um 'Agente de IA' (com ícone 🤖), uma 'Integração' (com ícone 🔗) ou uma 'Possibilidade'."
                      />
                      <FeatureBox 
                        title="Benefício/Título"
                        description="Uma linha em destaque mostrando o benefício principal do insight, marcado com 💡."
                      />
                      <FeatureBox 
                        title="Descrição Formatada"
                        description="O texto do insight pode incluir: passos numerados, variações, integrações relacionadas, benefícios e extensões possíveis. Tudo é formatado de forma legível e organizada."
                      />
                    </div>
                    <p className="mt-6">
                      <strong>Estrutura do Texto:</strong> Os insights geralmente são estruturados assim:
                    </p>
                    <div className={`mt-4 p-4 rounded-lg border-l-4 border-primary ${theme === "dark" ? "bg-primary/10" : "bg-primary/5"}`}>
                      <p className={`text-sm ${theme === "dark" ? "text-foreground/70" : "text-gray-600"}`}>
                        <strong>Título/Benefício —</strong> Explicação detalhada.<br/>
                        <strong>Passos:</strong> (1) Primeiro passo (2) Segundo passo etc.<br/>
                        <strong>Variações:</strong> Diferentes formas de implementar<br/>
                        <strong>Integrações:</strong> Plataformas relacionadas<br/>
                        <strong>Benefícios:</strong> Vantagens dessa automação<br/>
                        <strong>Extensões:</strong> Como estender a funcionalidade
                      </p>
                    </div>
                  </div>
                </Section>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Guide;
