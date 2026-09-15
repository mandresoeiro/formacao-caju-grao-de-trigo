window.CAJU_AULAS = [
  {
    numero: '01',
    slug: 'chamado-de-deus-e-fe',
    titulo: 'O Chamado de Deus e a Fé',
    subtitulo: 'Da busca humana ao encontro com Cristo',
    eixo: 'CRER',
    status: 'em-preparacao',
    statusLabel: 'Em preparação',
    resumo: 'Estrutura proposta para apresentar Revelação, fé, conversão e resposta do homem a Deus.',
    tema: 'dark',
    proposta: true,
    secoes: []
  },
  {
    numero: '02',
    slug: 'misterio-de-deus',
    titulo: 'O Mistério de Deus',
    subtitulo: 'Pai, Filho e Espírito Santo: a Santíssima Trindade',
    eixo: 'CRER',
    status: 'em-preparacao',
    statusLabel: 'Em preparação',
    resumo: 'Estrutura proposta para estudar a unidade de Deus, a Trindade e o centro cristológico da fé.',
    tema: 'dark',
    proposta: true,
    secoes: []
  },
  {
    numero: '03',
    slug: 'igreja-e-sacramentos',
    titulo: 'A Igreja e os Sacramentos',
    subtitulo: 'Cristo continua agindo no meio do seu povo',
    eixo: 'CELEBRAR',
    status: 'em-preparacao',
    statusLabel: 'Em preparação',
    resumo: 'Estrutura proposta para apresentar Igreja, sacramentos e preparar a passagem para a Eucaristia.',
    tema: 'dark',
    proposta: true,
    secoes: []
  },
  {
    numero: '04',
    slug: 'eucaristia',
    titulo: 'A Ascensão ao Altar',
    subtitulo: 'Do Dogma à Prática: o Mistério da Eucaristia e a Preparação do Fiel',
    eixo: 'CELEBRAR',
    status: 'publicada',
    statusLabel: 'Aula disponível',
    resumo: 'A Eucaristia como fonte e ápice da vida da Igreja: presença real, transubstanciação, comunhão, reverência e frutos espirituais.',
    tema: 'dark',
    capa: {
      src640: 'assets/img/aulas/04/slide-01-640.webp',
      src1280: 'assets/img/aulas/04/slide-01-1280.webp',
      alt: 'Capa da formação A Ascensão ao Altar, em azul-marinho e dourado, com símbolo geométrico de hóstia e cálice.'
    },
    imagens: [
      ['O Coração da Igreja', 'Painel visual que apresenta Eucaristia, Ceia do Senhor e Comunhão como três nomes fundamentais relacionados ao mistério e à unidade da Igreja.'],
      ['A Sacramentalidade da Matéria', 'Diagrama que relaciona pão e vinho, natureza e trabalho humano, ao altar e à oferta cotidiana do fiel.'],
      ['A Gênese no Cenáculo', 'Linha visual que conecta o lava-pés, a refeição pascal e o mandato de Cristo com a instituição da Eucaristia e do sacerdócio da Nova Aliança.'],
      ['Anamnese: o Memorial Atualizado', 'Diagrama entre história, altar cristão no presente e eternidade para explicar o memorial litúrgico como atualização eficaz.'],
      ['O Milagre Invisível: a Transubstanciação', 'Quadro comparativo entre pão e vinho, a ação sacramental e a realidade pós-consagração.'],
      ['A Integridade do Mistério', 'Ilustração da hóstia fracionada destacando que Cristo permanece inteiro em cada espécie e em cada fragmento.'],
      ['A Identidade Teológica do Altar', 'Diagrama do altar dividido entre altar do sacrifício e mesa do Senhor.'],
      ['O Exame da Alma: Critérios de Acesso', 'Fluxograma de exame de consciência e discernimento sobre pecado grave antes da comunhão.'],
      ['Protocolos Físicos de Adoração', 'Painel sobre reverência corporal e silêncio sagrado diante da presença eucarística.'],
      ['A Salvaguarda da Dignidade Eucarística', 'Orientações visuais sobre vigilância na exposição do Santíssimo e acolhimento da comunhão.'],
      ['O Impacto CAJU: Frutos Internos da Eucaristia', 'Três frutos destacados: intimidade com Cristo, preservação e purificação, e consolidação da Igreja em nós.'],
      ['O Transbordamento Social', 'Ilustração que liga a intimidade contemplativa ao compromisso com os vulneráveis.'],
      ['Você Diante do Sacrário', 'Página contemplativa sobre a presença de Cristo e a resposta pessoal do fiel diante do Sacrário.'],
      ['Citação Final', 'Encerramento visual da formação com chamada à evangelização e à centralidade de Jesus Eucarístico.']
    ].map((item, idx) => ({
      titulo: item[0],
      descricao: item[1],
      src640: `assets/img/aulas/04/slide-${String(idx + 2).padStart(2,'0')}-640.webp`,
      src1280: `assets/img/aulas/04/slide-${String(idx + 2).padStart(2,'0')}-1280.webp`
    })),
    secoes: [
      {
        id: 'coracao-da-igreja',
        titulo: 'O Coração da Igreja: fonte vital e ápice litúrgico',
        blocos: [
          { tipo: 'p', texto: 'A formação apresenta a Eucaristia como realidade central da vida eclesial: ela manifesta a comunhão íntima da humanidade com Deus e, ao mesmo tempo, edifica a unidade visível do Povo de Deus.' },
          { tipo: 'ul', itens: [
            'Eucaristia: ação de graças por excelência e reconhecimento do agir salvífico de Deus.',
            'Ceia do Senhor: remete ao ato fundador de Cristo com os Apóstolos no Cenáculo e orienta para o banquete definitivo.',
            'Comunhão: exprime o efeito do sacramento, a união com Cristo e a constituição dos muitos membros em um único Corpo.'
          ]},
          { tipo: 'callout', titulo: 'Para refletir', texto: 'A unidade celebrada no altar deve transbordar para a vida comunitária e para as relações concretas entre os fiéis.' }
        ],
        midia: [0]
      },
      {
        id: 'pao-e-vinho',
        titulo: 'A sacramentalidade do pão e do vinho',
        blocos: [
          { tipo: 'p', texto: 'Pão e vinho, elementos ordinários da criação e também frutos do trabalho humano, ocupam o centro da ação litúrgica. A formação os apresenta como sinais que unem criação, esforço humano e ação santificadora de Deus.' },
          { tipo: 'ul', itens: [
            'A multiplicação dos pães é apresentada como prefiguração da superabundância do alimento espiritual.',
            'As bodas de Caná são apresentadas como sinal que aponta para a glorificação de Cristo e para o banquete do Reino.',
            'No ofertório, a entrega material pode ser compreendida também como entrega da rotina, das fadigas e das conquistas do fiel.'
          ]}
        ],
        midia: [1]
      },
      {
        id: 'cenaculo',
        titulo: 'A instituição no Cenáculo',
        blocos: [
          { tipo: 'p', texto: 'A instituição da Eucaristia é situada no contexto da refeição pascal. Antes dela, o lava-pés estabelece o serviço e o mandamento do amor como chave de leitura para o sacramento.' },
          { tipo: 'p', texto: 'Ao ordenar que os Apóstolos repetissem seus gestos, Cristo confiou à Igreja a celebração do memorial de sua Morte e Ressurreição e associou o ministério apostólico à atualização litúrgica do único sacrifício.' }
        ],
        midia: [2]
      },
      {
        id: 'anamnese',
        titulo: 'Anamnese: o memorial atualizado',
        blocos: [
          { tipo: 'p', texto: 'Na formação, anamnese não significa simples recordação psicológica ou afetiva. O memorial litúrgico é apresentado como atualização eficaz: a celebração torna presente o único mistério pascal de Cristo no hoje da Igreja.' },
          { tipo: 'callout', titulo: 'Eixo da vida eclesial', texto: 'Desde a era apostólica, a assembleia no primeiro dia da semana e a fração do pão aparecem como referência estável da vida da Igreja.' }
        ],
        midia: [3]
      },
      {
        id: 'transubstanciacao',
        titulo: 'Transubstanciação e presença real',
        blocos: [
          { tipo: 'p', texto: 'O material recorre à definição doutrinal da transubstanciação para explicar a conversão eucarística: após a consagração, permanece a aparência sensível do pão e do vinho, enquanto a realidade substancial é apresentada como Corpo e Sangue de Cristo.' },
          { tipo: 'p', texto: 'Também se destaca que Cristo está inteiro em cada espécie e em cada fragmento, de modo que a divisão física da hóstia não divide a integridade de sua Pessoa.' }
        ],
        midia: [4, 5]
      },
      {
        id: 'altar',
        titulo: 'O altar: sacrifício e mesa do Senhor',
        blocos: [
          { tipo: 'p', texto: 'O altar é apresentado com uma identidade teológica dupla e inseparável: altar do sacrifício, onde se atualiza o mistério do Calvário, e mesa do Senhor, onde o povo é alimentado.' },
          { tipo: 'p', texto: 'Essa unidade ajuda a compreender que a Eucaristia é simultaneamente memorial sacrificial e banquete pascal.' }
        ],
        midia: [6]
      },
      {
        id: 'preparacao',
        titulo: 'Preparação para a comunhão',
        blocos: [
          { tipo: 'p', texto: 'A aula propõe um exame de consciência antes da comunhão e, quando existe consciência de pecado grave, orienta a busca do Sacramento da Reconciliação antes de comungar.' },
          { tipo: 'p', texto: 'Quando não há consciência de pecado grave, a aproximação é apresentada sob a atitude de humildade e temor reverente, inspirada na oração do centurião.' }
        ],
        midia: [7]
      },
      {
        id: 'reverencia',
        titulo: 'Reverência e dignidade eucarística',
        blocos: [
          { tipo: 'p', texto: 'A formação relaciona a fé na Presença Real a atitudes concretas de reverência, silêncio e cuidado com o Santíssimo Sacramento.' },
          { tipo: 'ul', itens: [
            'Vigilância durante a exposição pública do Santíssimo.',
            'Atenção ao modo de receber e consumir a hóstia durante a comunhão.',
            'Linguagem corporal coerente com a adoração e o respeito ao espaço sagrado.',
            'Silêncio interior e exterior como forma de reverência ativa.'
          ]}
        ],
        midia: [8, 9]
      },
      {
        id: 'frutos',
        titulo: 'Frutos da Eucaristia e compromisso com os vulneráveis',
        blocos: [
          { tipo: 'p', texto: 'Para o Compromisso CAJU, a formação apresenta a Eucaristia como padrão de aferição da própria fé e destaca frutos concretos na vida espiritual e comunitária.' },
          { tipo: 'ul', itens: [
            'Intimidade com Cristo.',
            'Preservação e purificação do pecado.',
            'Consolidação da Igreja em nós.',
            'Compromisso com os pobres, marginalizados e necessitados.'
          ]},
          { tipo: 'callout', titulo: 'Transbordamento social', texto: 'A missa se prolonga na história quando a comunhão com Cristo se transforma em serviço, caridade e promoção humana.' }
        ],
        midia: [10, 11, 12, 13]
      }
    ]
  },
  {
    numero: '05',
    slug: 'bem-aventurancas-e-virtudes',
    titulo: 'Bem-Aventuranças, Virtudes Teologais e Cardeais',
    subtitulo: 'O perfil espiritual do discípulo e os hábitos para viver o bem',
    eixo: 'VIVER',
    status: 'publicada',
    statusLabel: 'Aula disponível',
    resumo: 'Bem-aventuranças, Fé, Esperança e Caridade, além de Prudência, Justiça, Fortaleza e Temperança.',
    tema: 'light',
    secoes: [
      {
        id: 'bem-aventurancas',
        titulo: 'As Bem-Aventuranças: o rosto do discípulo',
        blocos: [
          { tipo: 'p', texto: 'A aula apresenta as Bem-Aventuranças como núcleo do Sermão da Montanha e como retrato espiritual de Cristo e de seu discípulo. Elas não são tratadas como promessas abstratas, mas como horizonte concreto da vida cristã.' },
          { tipo: 'ul', itens: [
            'Pobres em espírito: desapego, humildade e dependência de Deus.',
            'Aflitos: compunção, solidariedade e confiança na consolação divina.',
            'Mansos: domínio de si, paciência e rejeição da violência.',
            'Fome e sede de justiça: desejo de santidade e retidão.',
            'Misericordiosos: compaixão ativa e perdão.',
            'Puros de coração: intenção reta e guarda dos sentidos.',
            'Promotores da paz: reconciliação e rejeição da maledicência.',
            'Perseguidos por causa da justiça: firmeza na fé e perseverança.'
          ]}
        ]
      },
      {
        id: 'virtudes-teologais',
        titulo: 'Virtudes teologais: Fé, Esperança e Caridade',
        blocos: [
          { tipo: 'p', texto: 'As virtudes teologais são apresentadas como dons que têm Deus como origem, motivo e objeto. Elas estruturam a relação do cristão com Deus e dão forma à vida sobrenatural.' },
          { tipo: 'ul', itens: [
            'Fé: adesão livre e firme a Deus e às verdades por Ele reveladas.',
            'Esperança: confiança perseverante nas promessas de Deus e na vida eterna.',
            'Caridade: amor a Deus sobre todas as coisas e ao próximo por amor de Deus.'
          ]}
        ]
      },
      {
        id: 'prudencia',
        titulo: 'Prudência: discernir o bem concreto',
        blocos: [
          { tipo: 'p', texto: 'A prudência é apresentada como a virtude que dispõe a razão prática a discernir o verdadeiro bem e escolher os meios adequados para realizá-lo. Ela orienta as demais virtudes e combate a impulsividade.' }
        ]
      },
      {
        id: 'justica',
        titulo: 'Justiça: dar a cada um o que lhe é devido',
        blocos: [
          { tipo: 'p', texto: 'A justiça é descrita como vontade firme e constante de dar a Deus e ao próximo o que lhes é devido, respeitando direitos, deveres, equidade e bem comum.' }
        ]
      },
      {
        id: 'fortaleza',
        titulo: 'Fortaleza: firmeza no bem',
        blocos: [
          { tipo: 'p', texto: 'A fortaleza assegura constância na busca do bem, capacidade de resistir às tentações e coragem diante das dificuldades. A aula destaca tanto o enfrentamento quanto a perseverança prolongada.' }
        ]
      },
      {
        id: 'temperanca',
        titulo: 'Temperança: autodomínio e equilíbrio',
        blocos: [
          { tipo: 'p', texto: 'A temperança modera a atração dos prazeres e ordena os apetites sensíveis. A formação a relaciona à sobriedade, à castidade, à abstinência e ao domínio das paixões.' }
        ]
      },
      {
        id: 'graca-e-sacramentos',
        titulo: 'Virtudes, graça e vida sacramental',
        blocos: [
          { tipo: 'p', texto: 'A aula conclui que o esforço humano precisa ser purificado e elevado pela graça. A Eucaristia alimenta a caridade, enquanto a Reconciliação restaura a retidão e fortalece a caminhada moral.' }
        ]
      }
    ]
  },
  {
    numero: '06',
    slug: 'mandamentos',
    titulo: 'Lei de Deus vs. Preceitos da Igreja',
    subtitulo: 'O eterno e o prático na vida moral e sacramental',
    eixo: 'VIVER',
    status: 'publicada',
    statusLabel: 'Aula disponível',
    resumo: 'Os Dez Mandamentos e os cinco preceitos eclesiásticos apresentados como colunas complementares da formação moral católica.',
    tema: 'light',
    capa: {
      src640: 'assets/img/aulas/06/lei-de-deus-preceitos-640.webp',
      src1280: 'assets/img/aulas/06/lei-de-deus-preceitos-1280.webp',
      alt: 'Infográfico em fundo claro comparando o Decálogo com os Mandamentos da Igreja.'
    },
    imagens: [
      {
        titulo: 'Lei de Deus e Preceitos da Igreja',
        descricao: 'Infográfico comparativo entre origem, duração e objetivo do Decálogo e dos preceitos eclesiásticos.',
        src640: 'assets/img/aulas/06/lei-de-deus-preceitos-640.webp',
        src1280: 'assets/img/aulas/06/lei-de-deus-preceitos-1280.webp'
      }
    ],
    secoes: [
      {
        id: 'duas-colunas',
        titulo: 'Duas colunas da vida moral',
        blocos: [
          { tipo: 'p', texto: 'A formação distingue e relaciona o Decálogo, expressão da Lei Divina e Natural, e os preceitos eclesiásticos, normas disciplinares que orientam a prática mínima da vida sacramental.' },
          { tipo: 'callout', titulo: 'Distinção central', texto: 'A Lei Divina é apresentada como eterna e imutável; os preceitos eclesiásticos possuem caráter humano-disciplinar e podem ser adaptados pela autoridade da Igreja.' }
        ],
        midia: [0]
      },
      {
        id: 'primeira-tabua',
        titulo: 'Primeira tábua: o amor a Deus',
        blocos: [
          { tipo: 'ol', itens: [
            'Amar a Deus sobre todas as coisas.',
            'Não tomar seu santo Nome em vão.',
            'Guardar domingos e festas de guarda.'
          ]},
          { tipo: 'p', texto: 'Os três primeiros mandamentos são apresentados como ordenação da relação do fiel com Deus: adoração, reverência ao Nome divino e santificação do tempo.' }
        ]
      },
      {
        id: 'segunda-tabua',
        titulo: 'Segunda tábua: o amor ao próximo',
        blocos: [
          { tipo: 'ol', start: 4, itens: [
            'Honrar pai e mãe.',
            'Não matar.',
            'Guardar castidade.',
            'Não furtar.',
            'Não levantar falso testemunho.',
            'Não desejar a mulher do próximo.',
            'Não cobiçar as coisas alheias.'
          ]},
          { tipo: 'p', texto: 'A segunda tábua é tratada como aplicação do amor ao próximo em temas de família, vida, sexualidade, propriedade, verdade, desejos e justiça social.' }
        ]
      },
      {
        id: 'preceitos-da-igreja',
        titulo: 'Os cinco preceitos da Igreja',
        blocos: [
          { tipo: 'ol', itens: [
            'Participar da Missa nos domingos e festas de guarda.',
            'Confessar os pecados ao menos uma vez por ano, quando houver matéria que o exija.',
            'Comungar ao menos pela Páscoa da Ressurreição.',
            'Jejuar e abster-se de carne conforme a disciplina da Igreja.',
            'Prover às necessidades da Igreja segundo as próprias possibilidades.'
          ]},
          { tipo: 'p', texto: 'Esses preceitos são apresentados como uma linha mínima de segurança espiritual e sacramental, sem substituir a plenitude da vida cristã.' }
        ]
      },
      {
        id: 'perfeicao-da-caridade',
        titulo: 'A perfeição da caridade',
        blocos: [
          { tipo: 'p', texto: 'A aula conclui que mandamentos e preceitos não são um fim fechado em si mesmos: eles ordenam a consciência e sustentam a vida sacramental para conduzir o cristão à caridade.' }
        ]
      }
    ]
  },
  {
    numero: '07',
    slug: 'oracao',
    titulo: 'Resenha com o Pai',
    subtitulo: 'A oração na Igreja Católica: o diálogo filial e o combate da fé',
    eixo: 'REZAR',
    status: 'publicada',
    statusLabel: 'Aula disponível',
    resumo: 'Natureza da oração, formas e expressões, combate espiritual, Pai-Nosso, Ave-Maria, Rosário e rotina orante.',
    tema: 'dark',
    secoes: [
      {
        id: 'o-que-e-oracao',
        titulo: 'O que é a oração?',
        blocos: [
          { tipo: 'p', texto: 'A aula apresenta a oração como elevação da alma a Deus e como diálogo de amizade. Ela envolve inteligência, memória e vontade, iluminadas respectivamente pela fé, esperança e caridade.' },
          { tipo: 'p', texto: 'O coração é apresentado como lugar interior da aliança, da decisão e do encontro com Deus.' }
        ]
      },
      {
        id: 'graca-e-liberdade',
        titulo: 'Primazia da graça e cooperação da liberdade',
        blocos: [
          { tipo: 'p', texto: 'A iniciativa da oração pertence primeiro a Deus, mas a resposta humana exige liberdade, decisão, disciplina e perseverança, inclusive nos momentos em que faltam consolações sensíveis.' }
        ]
      },
      {
        id: 'sede-do-coracao',
        titulo: 'A sede do coração e a sede de Deus',
        blocos: [
          { tipo: 'p', texto: 'A formação descreve o ser humano como aberto ao infinito e incapaz de encontrar plenitude definitiva nas criaturas. No episódio da Samaritana, a sede humana e a sede de Deus se encontram.' }
        ]
      },
      {
        id: 'formas-de-oracao',
        titulo: 'Cinco formas de oração',
        blocos: [
          { tipo: 'ul', itens: [
            'Bênção e adoração.',
            'Petição.',
            'Intercessão.',
            'Ação de graças.',
            'Louvor.'
          ]}
        ]
      },
      {
        id: 'expressoes-de-oracao',
        titulo: 'Três expressões da oração',
        blocos: [
          { tipo: 'ul', itens: [
            'Oração vocal: palavras rezadas, cantadas ou recitadas.',
            'Meditação: busca reflexiva que mobiliza pensamento, imaginação, emoção e desejo.',
            'Oração contemplativa: olhar de fé e presença amorosa diante de Cristo.'
          ]}
        ]
      },
      {
        id: 'combate-espiritual',
        titulo: 'O combate espiritual na oração',
        blocos: [
          { tipo: 'ul', itens: [
            'Distrações: retornar ao foco com humildade e sem desespero.',
            'Aridez: perseverar por amor a Deus, mesmo sem consolações sensíveis.',
            'Acídia e frieza: responder com fidelidade, disciplina e perseverança.'
          ]}
        ]
      },
      {
        id: 'modelos-e-oracoes',
        titulo: 'Modelos e orações fundamentais',
        blocos: [
          { tipo: 'p', texto: 'Jesus é apresentado como o modelo da oração filial e o Pai-Nosso como síntese da oração cristã. Maria aparece como modelo de escuta, entrega e intercessão, com destaque para a Ave-Maria e para a contemplação dos mistérios de Cristo.' }
        ]
      },
      {
        id: 'rosario',
        titulo: 'Rosário e Terço Mariano',
        blocos: [
          { tipo: 'p', texto: 'O Rosário é apresentado como oração contemplativa, cristocêntrica e bíblica. A aula distingue o ciclo completo dos vinte mistérios da prática habitual do Terço de cinco mistérios.' }
        ]
      },
      {
        id: 'rotina-orante',
        titulo: 'Passos para uma rotina orante diária',
        blocos: [
          { tipo: 'ol', itens: [
            'Escolher lugar e tempo para a oração.',
            'Praticar a leitura orante da Palavra.',
            'Realizar exame de consciência diário.',
            'Rezar o Terço Mariano.',
            'Cultivar ação de graças constante.'
          ]}
        ]
      }
    ]
  },
  {
    numero: '08',
    slug: 'santidade',
    titulo: 'Setas para o Céu',
    subtitulo: 'A busca cristã pela santidade',
    eixo: 'SANTIDADE',
    status: 'publicada',
    statusLabel: 'Aula disponível',
    resumo: 'Chamado universal à santidade, santos como modelos e intercessores, canonização e testemunhos concretos de vida cristã.',
    tema: 'dark',
    secoes: [
      {
        id: 'chamado-universal',
        titulo: 'O chamado universal à santidade',
        blocos: [
          { tipo: 'p', texto: 'A formação parte da afirmação de que a santidade não é privilégio de poucos, mas vocação de todo cristão. Ser santo é viver unido a Deus pela graça, no cotidiano, sem confundir santidade com perfeccionismo ou ausência de quedas.' },
          { tipo: 'p', texto: 'Escritura, Tradição e Magistério são apresentados como os três grandes fundamentos desse chamado.' }
        ]
      },
      {
        id: 'santos-modelos',
        titulo: 'Santos: intercessores e modelos de Cristo',
        blocos: [
          { tipo: 'p', texto: 'Os santos são apresentados como testemunhas em quem o Evangelho se tornou visível. Eles não substituem Cristo: apontam para Ele, intercedem e mostram caminhos concretos de fidelidade.' }
        ]
      },
      {
        id: 'culto',
        titulo: 'Adoração e veneração: latria, dulia e hiperdulia',
        blocos: [
          { tipo: 'ul', itens: [
            'Latria: adoração devida somente a Deus.',
            'Dulia: veneração prestada aos santos.',
            'Hiperdulia: veneração singular reservada a Maria, sem jamais se tornar adoração.'
          ]}
        ]
      },
      {
        id: 'canonizacao',
        titulo: 'O processo de canonização',
        blocos: [
          { tipo: 'ol', itens: [
            'Servo de Deus: abertura da causa.',
            'Venerável: reconhecimento das virtudes heroicas ou do martírio.',
            'Beato: beatificação conforme os critérios da causa.',
            'Santo: canonização e proposta ao culto universal.'
          ]}
        ]
      },
      {
        id: 'setas',
        titulo: 'Setas que apontam para o Céu',
        blocos: [
          { tipo: 'ul', itens: [
            'Santa Teresinha do Menino Jesus: pequena via, confiança e amor nas pequenas coisas.',
            'Santa Teresa d’Ávila: amizade com Deus e perseverança na oração.',
            'São Francisco de Assis: despojamento, paz e alegria evangélica.',
            'São José: silêncio, fidelidade e obediência cotidiana.',
            'São Carlos Acutis: Eucaristia e missão no ambiente digital.'
          ]}
        ]
      },
      {
        id: 'maria',
        titulo: 'Maria Santíssima: primeira e perfeita discípula',
        blocos: [
          { tipo: 'p', texto: 'Maria é apresentada como modelo de escuta, fé e entrega total a Deus. A aula recorda sua maternidade divina, a Imaculada Conceição, a Assunção e sua relação singular com a Igreja.' }
        ]
      },
      {
        id: 'caju-santidade',
        titulo: 'Santidade e os propósitos da Casa da Juventude',
        blocos: [
          { tipo: 'p', texto: 'A formação conclui aplicando o tema à vida da Casa da Juventude: ser uma comunidade em que cada pessoa aprende a apontar para Cristo e a transformar o cotidiano em caminho concreto de santidade e serviço.' }
        ]
      }
    ]
  }
];
