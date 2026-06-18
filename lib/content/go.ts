import type { Track } from "./types";

export const goTrack: Track = {
  id: "go",
  title: "Golang",
  subtitle: "Concorrência simples, performance e serviços enxutos",
  accent: "go",
  icon: "🐹",
  modules: [
    {
      id: "go-fundamentals",
      step: 1,
      title: "Fundamentos de Go",
      icon: "🌱",
      summary: "Sintaxe, tipos, funções e controle de fluxo.",
      lessons: [
        {
          id: "go-hello",
          title: "Olá, Go — estrutura e execução",
          minutes: 12,
          xp: 40,
          theory: `## O programa mínimo

\`\`\`go
package main

import "fmt"

func main() {
    fmt.Println("Olá, Go!")
}
\`\`\`

- \`package main\` — todo executável começa no pacote \`main\`.
- \`import "fmt"\` — biblioteca de formatação/saída.
- \`func main()\` — ponto de entrada.

Go compila para um **binário único** e nativo — sem máquina virtual. Rápido de compilar e fácil de distribuir.

\`\`\`bash
go run main.go      # compila e roda
go build            # gera o binário
\`\`\`

Go é opinativo: o \`gofmt\` formata o código por você, e variáveis não usadas são **erro de compilação** (não warning). Isso mantém os projetos limpos.`,
          examples: [
            {
              title: "Println x Printf",
              lang: "go",
              code: `package main

import "fmt"

func main() {
    nome := "Ana"
    idade := 28
    fmt.Println(nome, "tem", idade, "anos")
    fmt.Printf("%s tem %d anos\\n", nome, idade)
}`,
              note: "%s para string, %d para inteiro, \\n para quebra de linha.",
            },
          ],
          quiz: [
            {
              q: "O que acontece com uma variável declarada e não usada em Go?",
              options: [
                "Nada, é ignorada",
                "Gera um warning",
                "Causa erro de compilação",
                "Vira nil",
              ],
              answer: 2,
              explain: "Go força código limpo: variável não usada não compila.",
            },
          ],
          exercise: {
            prompt:
              "Imprima exatamente:\n\n```\nGo\nrumo ao topo\n```",
            lang: "go",
            starter: `package main

import "fmt"

func main() {
    // imprima as duas linhas
}`,
            expectedOutput: "Go\nrumo ao topo",
            hint: "Use fmt.Println duas vezes.",
            solution: `package main

import "fmt"

func main() {
    fmt.Println("Go")
    fmt.Println("rumo ao topo")
}`,
          },
        },
        {
          id: "go-types",
          title: "Variáveis, tipos e :=",
          minutes: 15,
          xp: 45,
          theory: `## Declaração de variáveis

\`\`\`go
var x int = 10
var y = 20        // tipo inferido
z := 30           // forma curta (só dentro de funções)
\`\`\`

O operador \`:=\` declara e infere de uma vez — é o jeito idiomático dentro de funções.

## Tipos comuns

- \`int\`, \`int64\`, \`float64\`, \`bool\`, \`string\`
- \`byte\` (= \`uint8\`), \`rune\` (= \`int32\`, um caractere Unicode)

Go é fortemente tipado e **não faz conversão implícita** entre tipos numéricos:

\`\`\`go
var a int = 3
var b float64 = float64(a) // conversão explícita obrigatória
\`\`\`

## Zero values

Toda variável tem um valor zero por padrão: \`0\` para números, \`""\` para string, \`false\` para bool, \`nil\` para ponteiros/maps/slices. Não existe "indefinido".`,
          examples: [
            {
              title: "Múltiplos retornos",
              lang: "go",
              code: `package main

import "fmt"

func divmod(a, b int) (int, int) {
    return a / b, a % b
}

func main() {
    q, r := divmod(17, 5)
    fmt.Println(q, r) // 3 2
}`,
              note: "Funções em Go podem retornar vários valores — usado o tempo todo (valor, erro).",
            },
          ],
          exercise: {
            prompt:
              "Calcule o quociente e o resto de 17 por 5 e imprima, um por linha:\n\n```\n3\n2\n```",
            lang: "go",
            starter: `package main

import "fmt"

func main() {
    a, b := 17, 5
    // imprima a/b e depois a%b
}`,
            expectedOutput: "3\n2",
            solution: `package main

import "fmt"

func main() {
    a, b := 17, 5
    fmt.Println(a / b)
    fmt.Println(a % b)
}`,
          },
        },
        {
          id: "go-control",
          title: "if, for, switch e slices",
          minutes: 18,
          xp: 50,
          theory: `## Um único loop: for

Go tem só \`for\` — que cobre while e for-each:

\`\`\`go
for i := 0; i < 3; i++ { }      // clássico
for cond { }                    // como while
for i, v := range slice { }     // for-each
\`\`\`

## if e switch

\`\`\`go
if n := calc(); n > 0 {  // pode declarar antes da condição
    fmt.Println(n)
}

switch dia {
case "sab", "dom":
    fmt.Println("fds")
default:
    fmt.Println("útil")
}
\`\`\`

\`switch\` não precisa de \`break\` (não há fall-through por padrão).

## Slices

Arrays em Go têm tamanho fixo; **slices** são a abstração flexível usada na prática:

\`\`\`go
nums := []int{1, 2, 3}
nums = append(nums, 4)   // [1 2 3 4]
fmt.Println(len(nums))   // 4
\`\`\``,
          examples: [
            {
              title: "Somando com range",
              lang: "go",
              code: `package main

import "fmt"

func main() {
    nums := []int{10, 20, 30}
    soma := 0
    for _, v := range nums {
        soma += v
    }
    fmt.Println(soma) // 60
}`,
              note: "O _ descarta o índice que não vamos usar.",
            },
          ],
          quiz: [
            {
              q: "Quantos tipos de loop existem em Go?",
              options: ["3 (for, while, do-while)", "2 (for, while)", "1 (for)", "Nenhum"],
              answer: 2,
            },
          ],
          exercise: {
            prompt:
              "Some os números de 1 a 100 com um `for` e imprima:\n\n```\n5050\n```",
            lang: "go",
            starter: `package main

import "fmt"

func main() {
    soma := 0
    // some de 1 a 100
    fmt.Println(soma)
}`,
            expectedOutput: "5050",
            solution: `package main

import "fmt"

func main() {
    soma := 0
    for i := 1; i <= 100; i++ {
        soma += i
    }
    fmt.Println(soma)
}`,
          },
        },
      ],
    },
    {
      id: "go-structs",
      step: 2,
      title: "Structs e Métodos",
      icon: "🧩",
      summary: "Tipos compostos, métodos com receiver e composição.",
      lessons: [
        {
          id: "go-structs-lesson",
          title: "Structs, métodos e composição",
          minutes: 18,
          xp: 55,
          theory: `## Go não tem classes — tem structs

\`\`\`go
type Conta struct {
    Titular string
    Saldo   float64
}

// método com receiver de ponteiro (pode alterar o struct)
func (c *Conta) Depositar(v float64) {
    c.Saldo += v
}
\`\`\`

- Campos com inicial **maiúscula** são exportados (públicos); minúscula são privados ao pacote.
- Receiver de ponteiro \`(c *Conta)\` permite mutação; de valor \`(c Conta)\` trabalha numa cópia.

## Composição no lugar de herança

Go favorece **composição**: embutir um struct dentro de outro.

\`\`\`go
type Animal struct{ Nome string }
type Cachorro struct {
    Animal      // embedding
    Raca string
}
// cachorro.Nome funciona via promoção de campo
\`\`\``,
          examples: [
            {
              title: "Criando e usando um struct",
              lang: "go",
              code: `package main

import "fmt"

type Conta struct{ Saldo float64 }

func (c *Conta) Depositar(v float64) { c.Saldo += v }

func main() {
    c := Conta{Saldo: 100}
    c.Depositar(50)
    fmt.Println(c.Saldo) // 150
}`,
            },
          ],
          quiz: [
            {
              q: "O que torna um campo de struct público (exportado) em Go?",
              options: [
                "A palavra-chave public",
                "Iniciar com letra maiúscula",
                "A tag json",
                "Estar no pacote main",
              ],
              answer: 1,
            },
          ],
          exercise: {
            prompt:
              "Crie um struct `Retangulo` com método `Area()` e imprima a área de 4x3:\n\n```\n12\n```",
            lang: "go",
            starter: `package main

import "fmt"

type Retangulo struct {
    Largura, Altura int
}

// implemente Area()

func main() {
    r := Retangulo{Largura: 4, Altura: 3}
    fmt.Println(r.Area())
}`,
            expectedOutput: "12",
            solution: `package main

import "fmt"

type Retangulo struct {
    Largura, Altura int
}

func (r Retangulo) Area() int { return r.Largura * r.Altura }

func main() {
    r := Retangulo{Largura: 4, Altura: 3}
    fmt.Println(r.Area())
}`,
          },
        },
      ],
    },
    {
      id: "go-interfaces",
      step: 3,
      title: "Interfaces e Erros",
      icon: "🔗",
      summary: "Interfaces implícitas e o padrão de erros idiomático.",
      lessons: [
        {
          id: "go-interfaces-lesson",
          title: "Interfaces implícitas e tratamento de erros",
          minutes: 18,
          xp: 60,
          theory: `## Interfaces satisfeitas implicitamente

Em Go, você não declara "implements". Se o tipo tem os métodos, ele satisfaz a interface — *duck typing* verificado em compilação.

\`\`\`go
type Forma interface {
    Area() float64
}
// qualquer tipo com Area() float64 já é uma Forma
\`\`\`

## Erros são valores

Go não tem exceções. Funções retornam um \`error\` como último valor:

\`\`\`go
f, err := os.Open("arquivo.txt")
if err != nil {
    return err   // trate explicitamente
}
defer f.Close()  // adia até a função retornar
\`\`\`

O padrão \`if err != nil\` é onipresente e proposital: torna o tratamento de erro **visível** e local. \`defer\` agenda limpeza, executada na ordem inversa quando a função retorna.`,
          quiz: [
            {
              q: "Como um tipo passa a satisfazer uma interface em Go?",
              options: [
                "Usando a palavra implements",
                "Implementando os métodos da interface (implícito)",
                "Herdo da interface",
                "Registrando no main",
              ],
              answer: 1,
            },
            {
              q: "Como Go sinaliza erros?",
              options: [
                "Lançando exceções",
                "Retornando um valor error a ser checado",
                "Com try/catch",
                "Encerrando o programa",
              ],
              answer: 1,
            },
          ],
        },
      ],
    },
    {
      id: "go-concurrency",
      step: 4,
      title: "Goroutines e Channels",
      icon: "⚡",
      summary: "Concorrência leve: goroutines, channels e select.",
      lessons: [
        {
          id: "go-concurrency-lesson",
          title: "Concorrência idiomática",
          minutes: 20,
          xp: 70,
          theory: `## O superpoder do Go

Uma **goroutine** é uma função concorrente leve — milhares cabem facilmente. Basta \`go\`:

\`\`\`go
go fazerAlgo()   // roda concorrentemente
\`\`\`

**Channels** comunicam entre goroutines com segurança:

\`\`\`go
ch := make(chan int)
go func() { ch <- 42 }()  // envia
v := <-ch                 // recebe (bloqueia até chegar)
\`\`\`

> Lema do Go: *"Don't communicate by sharing memory; share memory by communicating."* Em vez de locks, passe dados por channels.

\`select\` espera em vários channels:

\`\`\`go
select {
case v := <-ch1: usar(v)
case <-time.After(time.Second): timeout()
}
\`\`\`

Use \`sync.WaitGroup\` para esperar um grupo de goroutines terminarem.`,
          examples: [
            {
              title: "Channel simples",
              lang: "go",
              code: `package main

import "fmt"

func main() {
    ch := make(chan int)
    go func() {
        ch <- 7 * 6
    }()
    fmt.Println(<-ch) // 42
}`,
            },
          ],
          quiz: [
            {
              q: "Qual a filosofia de concorrência do Go?",
              options: [
                "Compartilhe memória usando locks sempre",
                "Compartilhe memória comunicando (via channels)",
                "Evite concorrência",
                "Use apenas uma thread",
              ],
              answer: 1,
            },
          ],
          exercise: {
            prompt:
              "Envie o valor `42` por um channel e imprima o que recebeu:\n\n```\n42\n```",
            lang: "go",
            starter: `package main

import "fmt"

func main() {
    ch := make(chan int)
    // envie 42 numa goroutine e receba
}`,
            expectedOutput: "42",
            hint: "go func(){ ch <- 42 }() e depois <-ch.",
            solution: `package main

import "fmt"

func main() {
    ch := make(chan int)
    go func() { ch <- 42 }()
    fmt.Println(<-ch)
}`,
          },
        },
      ],
    },
    {
      id: "go-http",
      step: 5,
      title: "Serviços HTTP",
      icon: "🌐",
      summary: "net/http, handlers, JSON e construção de APIs.",
      lessons: [
        {
          id: "go-http-lesson",
          title: "Uma API HTTP com a biblioteca padrão",
          minutes: 18,
          xp: 65,
          theory: `## A stdlib já serve HTTP

Go vem com um servidor HTTP de produção na biblioteca padrão — sem framework obrigatório.

\`\`\`go
package main

import (
    "encoding/json"
    "net/http"
)

func main() {
    http.HandleFunc("/ping", func(w http.ResponseWriter, r *http.Request) {
        json.NewEncoder(w).Encode(map[string]string{"msg": "pong"})
    })
    http.ListenAndServe(":8080", nil)
}
\`\`\`

- \`http.HandleFunc\` registra uma rota.
- \`w http.ResponseWriter\` escreve a resposta; \`r *http.Request\` traz a requisição.
- \`encoding/json\` serializa structs para JSON.

Para roteamento mais rico (path params, middlewares), a comunidade usa \`chi\` ou \`gin\` — mas a base é essa. Go é uma escolha forte para backends de alta performance justamente por esse núcleo enxuto.`,
          quiz: [
            {
              q: "Go precisa de um framework externo para servir HTTP?",
              options: [
                "Sim, sempre",
                "Não — net/http da stdlib já é suficiente para produção",
                "Só com Gin",
                "Apenas com Docker",
              ],
              answer: 1,
            },
          ],
        },
      ],
    },
    {
      id: "go-testing",
      step: 6,
      title: "Testes e Deploy",
      icon: "🚀",
      summary: "testing, table-driven tests e binário para produção.",
      lessons: [
        {
          id: "go-testing-lesson",
          title: "Testes nativos e empacotamento",
          minutes: 16,
          xp: 60,
          theory: `## Testes fazem parte da linguagem

Sem framework: arquivos \`_test.go\` e o comando \`go test\`.

\`\`\`go
func TestSoma(t *testing.T) {
    casos := []struct{ a, b, esperado int }{
        {1, 2, 3},
        {0, 0, 0},
        {-1, 1, 0},
    }
    for _, c := range casos {
        if got := Soma(c.a, c.b); got != c.esperado {
            t.Errorf("Soma(%d,%d) = %d; quero %d", c.a, c.b, got, c.esperado)
        }
    }
}
\`\`\`

O padrão **table-driven** acima é idiomático: uma tabela de casos, um loop. Rode com \`go test ./...\`.

## Deploy

\`go build\` gera um binário estático único. Junte com uma imagem Docker mínima (até \`scratch\`) e você tem um container de poucos MB — perfeito para cloud e Kubernetes (que você viu na trilha Java).`,
          quiz: [
            {
              q: "Qual padrão de teste é idiomático em Go?",
              options: [
                "BDD com Gherkin",
                "Table-driven tests",
                "Testes só manuais",
                "Reflection em runtime",
              ],
              answer: 1,
            },
          ],
        },
      ],
    },
  ],
};
