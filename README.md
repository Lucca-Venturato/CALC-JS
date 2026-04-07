# 🧮 Calculadora Web

Uma calculadora moderna, responsiva e elegante construída com HTML, CSS e JavaScript puro — sem dependências externas.

---

## ✨ Funcionalidades

- Operações básicas: adição, subtração, multiplicação e divisão
- Encadeamento de operações sem precisar apertar `=`
- Inversão de sinal (`+/−`) e percentual (`%`)
- Ponto decimal com proteção contra duplicatas
- Expressão exibida em tempo real no display
- Formatação numérica em pt-BR (vírgula como separador decimal)
- Proteção contra overflow (limite de 14 dígitos)
- Suporte completo ao teclado
- Animações de entrada, pop no display e destaque no operador ativo
- Totalmente responsivo para mobile, tablet e desktop

---

## 📁 Estrutura do Projeto

```
calculadora/
├── index.html   # Estrutura e marcação da calculadora
├── style.css    # Estilos, tema dark e animações
└── script.js    # Lógica e interatividade
```

---

## 🚀 Como usar

Não há instalação necessária. Basta:

1. Fazer o download ou clonar os arquivos
2. Manter os três arquivos na **mesma pasta**
3. Abrir o `index.html` em qualquer navegador moderno

```bash
# Opcional: servir localmente com Python
python -m http.server 8080
# Acesse http://localhost:8080
```

---

## ⌨️ Atalhos de Teclado

| Tecla | Ação |
|---|---|
| `0` – `9` | Digitar número |
| `.` ou `,` | Ponto decimal |
| `+` | Adição |
| `-` | Subtração |
| `*` ou `x` | Multiplicação |
| `/` | Divisão |
| `%` | Percentual |
| `Enter` ou `=` | Calcular resultado |
| `Backspace` | Apagar último dígito |
| `Escape` ou `Delete` | Limpar tudo (AC) |

---

## 🎨 Design

- **Tema:** Dark com orbs animados ao fundo
- **Tipografia:** `DM Mono` (display) + `Syne` (interface)
- **Cores:** Roxo vibrante nos operadores, gradiente nos botões de igual, verde esmeralda no indicador de status
- **Animações:** Entrada suave da calculadora, pop no display a cada interação, ripple nos botões

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|---|---|
| HTML5 | Estrutura semântica |
| CSS3 | Estilização, animações e responsividade |
| JavaScript (ES6+) | Lógica da calculadora e eventos |
| Google Fonts | Tipografia (`DM Mono`, `Syne`) |

---

## 📱 Responsividade

A interface se adapta automaticamente a diferentes tamanhos de tela:

- **Mobile** (`< 400px`): botões compactos, fontes reduzidas
- **Tablet / Desktop** (`≥ 600px`): card levemente maior, botões com mais altura
- **Telas baixas** (`height < 700px`): layout comprimido verticalmente

---

## 📄 Licença

Este projeto é de uso livre para fins pessoais e educacionais.