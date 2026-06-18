import type { Track } from "./types";

export const javaTrack: Track = {
  id: "java",
  title: "Java",
  subtitle: "Dos fundamentos ao System Design — a escada completa",
  accent: "java",
  icon: "☕",
  modules: [
    {
      id: "java-fundamentals",
      step: 1,
      title: "Fundamentos de Java",
      icon: "🌱",
      summary: "Sintaxe, tipos, variáveis, controle de fluxo e métodos.",
      lessons: [
        {
          id: "java-hello",
          title: "Olá, Java — estrutura de um programa",
          minutes: 12,
          xp: 40,
          theory: `## O ponto de partida

Todo programa Java vive dentro de uma **classe**, e a execução começa por um método especial chamado \`main\`. A JVM (Java Virtual Machine) procura exatamente essa assinatura para saber por onde iniciar.

\`\`\`java
public class Main {
    public static void main(String[] args) {
        System.out.println("Olá, mundo!");
    }
}
\`\`\`

Lendo de fora pra dentro:

- \`public class Main\` — uma classe pública chamada \`Main\`. Por convenção, o arquivo se chama \`Main.java\`.
- \`public static void main(String[] args)\` — o método de entrada. \`static\` significa que pertence à classe (roda sem criar um objeto); \`String[] args\` recebe argumentos da linha de comando.
- \`System.out.println(...)\` — imprime no console e pula uma linha.

## Compilar e rodar

Java é **compilado** para *bytecode* (\`.class\`) e depois executado pela JVM. No fluxo clássico:

\`\`\`bash
javac Main.java   # compila -> Main.class
java Main         # executa
\`\`\`

Neste app, o botão **Executar** faz isso pra você num sandbox e compara a saída automaticamente.`,
          examples: [
            {
              title: "Imprimindo várias linhas",
              lang: "java",
              code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Linha 1");
        System.out.print("sem ");   // não pula linha
        System.out.println("quebra");
    }
}`,
              note: "println pula linha; print não.",
            },
          ],
          quiz: [
            {
              q: "Qual a assinatura do ponto de entrada de um programa Java?",
              options: [
                "void start()",
                "public static void main(String[] args)",
                "function main()",
                "int main(int argc)",
              ],
              answer: 1,
              explain: "A JVM procura exatamente public static void main(String[] args).",
            },
            {
              q: "O que é gerado quando você compila um arquivo .java?",
              options: ["Um .exe", "Código de máquina", "Bytecode (.class)", "Um .jar automaticamente"],
              answer: 2,
            },
          ],
          exercise: {
            prompt:
              "Escreva um programa que imprima exatamente:\n\n```\nDevQuest\nrumo ao topo\n```",
            lang: "java",
            starter: `public class Main {
    public static void main(String[] args) {
        // imprima as duas linhas aqui
    }
}`,
            expectedOutput: "DevQuest\nrumo ao topo",
            hint: "Use dois System.out.println.",
            solution: `public class Main {
    public static void main(String[] args) {
        System.out.println("DevQuest");
        System.out.println("rumo ao topo");
    }
}`,
          },
        },
        {
          id: "java-types",
          title: "Variáveis, tipos primitivos e operadores",
          minutes: 15,
          xp: 45,
          theory: `## Tipos primitivos

Java é **estaticamente tipado**: o tipo é declarado e checado em compilação. Os primitivos mais usados:

- \`int\` — inteiro de 32 bits
- \`long\` — inteiro de 64 bits (\`100L\`)
- \`double\` — ponto flutuante (\`3.14\`)
- \`boolean\` — \`true\` / \`false\`
- \`char\` — um caractere (\`'A'\`)

\`\`\`java
int idade = 28;
double preco = 19.90;
boolean ativo = true;
String nome = "Ana"; // String NÃO é primitivo, é uma classe
\`\`\`

## var (inferência de tipo)

Desde o Java 10, \`var\` deixa o compilador inferir o tipo de variáveis **locais**:

\`\`\`java
var total = 10;        // int
var texto = "oi";      // String
\`\`\`

O tipo continua fixo — \`var\` não é dinâmico.

## Operadores

Aritméticos (\`+ - * / %\`), de comparação (\`== != > < >= <=\`) e lógicos (\`&& || !\`). Cuidado com divisão inteira:

\`\`\`java
System.out.println(7 / 2);    // 3  (int / int)
System.out.println(7 / 2.0);  // 3.5
System.out.println(7 % 2);    // 1  (resto)
\`\`\``,
          examples: [
            {
              title: "Concatenação e formatação",
              lang: "java",
              code: `public class Main {
    public static void main(String[] args) {
        String nome = "Ana";
        int idade = 28;
        System.out.println(nome + " tem " + idade + " anos");
        System.out.printf("%s tem %d anos%n", nome, idade);
    }
}`,
              note: "printf usa marcadores: %s texto, %d inteiro, %n quebra de linha.",
            },
          ],
          quiz: [
            {
              q: "Qual o valor de 7 / 2 em Java?",
              options: ["3.5", "3", "4", "Erro de compilação"],
              answer: 1,
              explain: "Divisão entre inteiros descarta a parte fracionária.",
            },
          ],
          exercise: {
            prompt:
              "Dadas as variáveis `a = 17` e `b = 5`, imprima o quociente inteiro e o resto, um por linha. Saída esperada:\n\n```\n3\n2\n```",
            lang: "java",
            starter: `public class Main {
    public static void main(String[] args) {
        int a = 17, b = 5;
        // imprima a / b e depois a % b
    }
}`,
            expectedOutput: "3\n2",
            hint: "Use os operadores / e %.",
            solution: `public class Main {
    public static void main(String[] args) {
        int a = 17, b = 5;
        System.out.println(a / b);
        System.out.println(a % b);
    }
}`,
          },
        },
        {
          id: "java-control-flow",
          title: "Controle de fluxo: if, switch e loops",
          minutes: 18,
          xp: 50,
          theory: `## Condicionais

\`\`\`java
if (nota >= 7) {
    System.out.println("Aprovado");
} else if (nota >= 5) {
    System.out.println("Recuperação");
} else {
    System.out.println("Reprovado");
}
\`\`\`

O \`switch\` moderno (Java 14+) usa setas e não precisa de \`break\`:

\`\`\`java
String dia = switch (n) {
    case 1, 7 -> "fim de semana";
    case 2, 3, 4, 5, 6 -> "dia útil";
    default -> "inválido";
};
\`\`\`

## Loops

- \`for\` — quando você sabe quantas vezes
- \`while\` — enquanto uma condição for verdadeira
- \`for-each\` — para percorrer coleções/arrays

\`\`\`java
for (int i = 1; i <= 3; i++) System.out.println(i);

int[] nums = {10, 20, 30};
for (int n : nums) System.out.println(n);
\`\`\`

\`break\` interrompe o loop; \`continue\` pula para a próxima iteração.`,
          examples: [
            {
              title: "FizzBuzz — o clássico",
              lang: "java",
              code: `public class Main {
    public static void main(String[] args) {
        for (int i = 1; i <= 15; i++) {
            if (i % 15 == 0) System.out.println("FizzBuzz");
            else if (i % 3 == 0) System.out.println("Fizz");
            else if (i % 5 == 0) System.out.println("Buzz");
            else System.out.println(i);
        }
    }
}`,
            },
          ],
          quiz: [
            {
              q: "O que `continue` faz dentro de um loop?",
              options: [
                "Encerra o loop",
                "Pula para a próxima iteração",
                "Reinicia o loop do zero",
                "Lança uma exceção",
              ],
              answer: 1,
            },
          ],
          exercise: {
            prompt:
              "Imprima a soma dos números de 1 a 100. A saída deve ser apenas:\n\n```\n5050\n```",
            lang: "java",
            starter: `public class Main {
    public static void main(String[] args) {
        int soma = 0;
        // some de 1 a 100
        System.out.println(soma);
    }
}`,
            expectedOutput: "5050",
            hint: "Use um for de 1 a 100 acumulando em soma.",
            solution: `public class Main {
    public static void main(String[] args) {
        int soma = 0;
        for (int i = 1; i <= 100; i++) soma += i;
        System.out.println(soma);
    }
}`,
          },
        },
        {
          id: "java-methods",
          title: "Métodos e arrays",
          minutes: 16,
          xp: 50,
          theory: `## Métodos

Um método encapsula um comportamento reutilizável. Tem tipo de retorno, nome e parâmetros:

\`\`\`java
static int somar(int a, int b) {
    return a + b;
}
\`\`\`

\`void\` indica que nada é retornado. Métodos podem ser **sobrecarregados** (mesmo nome, parâmetros diferentes).

## Arrays

Coleção de tamanho fixo de elementos do mesmo tipo:

\`\`\`java
int[] notas = new int[3];   // [0, 0, 0]
notas[0] = 10;
int[] dados = {1, 2, 3};    // literal
System.out.println(dados.length); // 3
\`\`\`

Índices vão de \`0\` a \`length - 1\`. Acessar fora disso lança \`ArrayIndexOutOfBoundsException\`.`,
          examples: [
            {
              title: "Método que calcula a média de um array",
              lang: "java",
              code: `public class Main {
    static double media(int[] v) {
        int soma = 0;
        for (int x : v) soma += x;
        return (double) soma / v.length;
    }
    public static void main(String[] args) {
        System.out.println(media(new int[]{2, 4, 6})); // 4.0
    }
}`,
              note: "O cast (double) evita a divisão inteira.",
            },
          ],
          exercise: {
            prompt:
              "Crie um método `max(int[] v)` que retorne o maior valor do array e imprima o resultado para `{3, 9, 1, 7}`. Saída esperada:\n\n```\n9\n```",
            lang: "java",
            starter: `public class Main {
    static int max(int[] v) {
        // retorne o maior elemento
        return 0;
    }
    public static void main(String[] args) {
        System.out.println(max(new int[]{3, 9, 1, 7}));
    }
}`,
            expectedOutput: "9",
            hint: "Comece com v[0] e percorra comparando.",
            solution: `public class Main {
    static int max(int[] v) {
        int m = v[0];
        for (int x : v) if (x > m) m = x;
        return m;
    }
    public static void main(String[] args) {
        System.out.println(max(new int[]{3, 9, 1, 7}));
    }
}`,
          },
        },
      ],
    },
    {
      id: "java-oop",
      step: 2,
      title: "Programação Orientada a Objetos",
      icon: "🧩",
      summary: "Classes, objetos, encapsulamento, herança e polimorfismo.",
      lessons: [
        {
          id: "oop-classes",
          title: "Classes, objetos e construtores",
          minutes: 18,
          xp: 55,
          theory: `## Classe x objeto

Uma **classe** é o molde; um **objeto** é uma instância criada a partir dela. Atributos (estado) + métodos (comportamento).

\`\`\`java
class Conta {
    private double saldo;          // atributo

    Conta(double inicial) {        // construtor
        this.saldo = inicial;
    }

    void depositar(double v) {     // método
        saldo += v;
    }

    double getSaldo() {
        return saldo;
    }
}
\`\`\`

\`this\` referencia o próprio objeto. \`new Conta(100)\` chama o construtor.

## Encapsulamento

Marcamos atributos como \`private\` e expomos acesso controlado via métodos (\`getters\`/\`setters\`). Isso protege invariantes — por exemplo, impedir saldo negativo.`,
          examples: [
            {
              title: "Usando a classe",
              lang: "java",
              code: `public class Main {
    static class Conta {
        private double saldo;
        Conta(double inicial) { this.saldo = inicial; }
        void depositar(double v) { saldo += v; }
        double getSaldo() { return saldo; }
    }
    public static void main(String[] args) {
        Conta c = new Conta(100);
        c.depositar(50);
        System.out.println(c.getSaldo()); // 150.0
    }
}`,
              note: "Classes aninhadas precisam ser static para o exemplo rodar em Main.",
            },
          ],
          quiz: [
            {
              q: "Para que serve o modificador `private` em um atributo?",
              options: [
                "Tornar o atributo constante",
                "Impedir acesso direto de fora da classe (encapsulamento)",
                "Deixar o atributo global",
                "Acelerar o acesso",
              ],
              answer: 1,
            },
          ],
          exercise: {
            prompt:
              "Complete a classe `Retangulo` com um método `area()`. Para 4x3, a saída deve ser:\n\n```\n12\n```",
            lang: "java",
            starter: `public class Main {
    static class Retangulo {
        int largura, altura;
        Retangulo(int l, int a) { largura = l; altura = a; }
        int area() {
            // retorne a área
            return 0;
        }
    }
    public static void main(String[] args) {
        System.out.println(new Retangulo(4, 3).area());
    }
}`,
            expectedOutput: "12",
            solution: `public class Main {
    static class Retangulo {
        int largura, altura;
        Retangulo(int l, int a) { largura = l; altura = a; }
        int area() { return largura * altura; }
    }
    public static void main(String[] args) {
        System.out.println(new Retangulo(4, 3).area());
    }
}`,
          },
        },
        {
          id: "oop-inheritance",
          title: "Herança, polimorfismo e interfaces",
          minutes: 20,
          xp: 60,
          theory: `## Herança

Uma classe pode **estender** outra, herdando estado e comportamento:

\`\`\`java
class Animal {
    String som() { return "..."; }
}
class Cachorro extends Animal {
    @Override
    String som() { return "Au"; }
}
\`\`\`

\`@Override\` documenta e faz o compilador verificar que você está sobrescrevendo de fato.

## Polimorfismo

Uma variável do tipo base pode apontar para qualquer subtipo, e a chamada resolve em tempo de execução:

\`\`\`java
Animal a = new Cachorro();
a.som(); // "Au"
\`\`\`

## Interfaces

Definem um **contrato** sem implementação (até o Java 8, que trouxe \`default methods\`):

\`\`\`java
interface Pagavel {
    double valor();
}
\`\`\`

Prefira **programar para interfaces**: facilita testes e troca de implementação. É a base do "D" de SOLID e da injeção de dependência que você verá no Spring.`,
          quiz: [
            {
              q: "O que é polimorfismo?",
              options: [
                "Ter vários construtores",
                "A capacidade de uma referência base se comportar conforme o subtipo real",
                "Esconder atributos",
                "Compilar para várias plataformas",
              ],
              answer: 1,
            },
            {
              q: "Uma interface (clássica) define:",
              options: [
                "Estado e comportamento concretos",
                "Apenas um contrato de métodos",
                "Somente atributos",
                "Threads",
              ],
              answer: 1,
            },
          ],
          exercise: {
            prompt:
              "Crie `Quadrado` que estende `Forma` e sobrescreve `area()`. Para lado 5, imprima:\n\n```\n25\n```",
            lang: "java",
            starter: `public class Main {
    static abstract class Forma { abstract int area(); }
    static class Quadrado extends Forma {
        int lado;
        Quadrado(int l) { lado = l; }
        // sobrescreva area()
        int area() { return 0; }
    }
    public static void main(String[] args) {
        Forma f = new Quadrado(5);
        System.out.println(f.area());
    }
}`,
            expectedOutput: "25",
            solution: `public class Main {
    static abstract class Forma { abstract int area(); }
    static class Quadrado extends Forma {
        int lado;
        Quadrado(int l) { lado = l; }
        int area() { return lado * lado; }
    }
    public static void main(String[] args) {
        Forma f = new Quadrado(5);
        System.out.println(f.area());
    }
}`,
          },
        },
      ],
    },
    {
      id: "java-collections",
      step: 3,
      title: "Collections Framework",
      icon: "📚",
      summary: "List, Set, Map, iteração e Stream API.",
      lessons: [
        {
          id: "collections-basics",
          title: "List, Set e Map",
          minutes: 18,
          xp: 55,
          theory: `## As três estruturas centrais

- **List** (\`ArrayList\`) — sequência ordenada, permite duplicatas, acesso por índice.
- **Set** (\`HashSet\`) — sem duplicatas, sem ordem garantida.
- **Map** (\`HashMap\`) — pares chave→valor.

\`\`\`java
import java.util.*;

List<String> nomes = new ArrayList<>();
nomes.add("Ana");
nomes.add("Bia");

Set<Integer> unicos = new HashSet<>(List.of(1, 1, 2)); // {1, 2}

Map<String, Integer> idades = new HashMap<>();
idades.put("Ana", 28);
int x = idades.get("Ana"); // 28
\`\`\`

**Generics** (\`<String>\`) garantem segurança de tipo: o compilador impede colocar o tipo errado.`,
          examples: [
            {
              title: "Contando frequência com Map",
              lang: "java",
              code: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        String[] palavras = {"a", "b", "a", "c", "b", "a"};
        Map<String, Integer> freq = new HashMap<>();
        for (String p : palavras) {
            freq.merge(p, 1, Integer::sum);
        }
        System.out.println(freq.get("a")); // 3
    }
}`,
              note: "merge é o jeito idiomático de incrementar um contador num Map.",
            },
          ],
          quiz: [
            {
              q: "Qual estrutura NÃO permite elementos duplicados?",
              options: ["ArrayList", "HashSet", "LinkedList", "Array"],
              answer: 1,
            },
          ],
          exercise: {
            prompt:
              "Conte quantos números do array `{4, 4, 4, 2, 2, 8}` são distintos e imprima:\n\n```\n3\n```",
            lang: "java",
            starter: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        int[] v = {4, 4, 4, 2, 2, 8};
        // use um Set para contar distintos
    }
}`,
            expectedOutput: "3",
            hint: "Adicione todos a um HashSet<Integer> e imprima .size().",
            solution: `import java.util.*;
public class Main {
    public static void main(String[] args) {
        int[] v = {4, 4, 4, 2, 2, 8};
        Set<Integer> s = new HashSet<>();
        for (int x : v) s.add(x);
        System.out.println(s.size());
    }
}`,
          },
        },
        {
          id: "collections-streams",
          title: "Stream API: map, filter, reduce",
          minutes: 20,
          xp: 60,
          theory: `## Programação declarativa com Streams

A Stream API (Java 8+) processa coleções de forma encadeada e legível:

\`\`\`java
import java.util.*;
import java.util.stream.*;

List<Integer> nums = List.of(1, 2, 3, 4, 5, 6);

int soma = nums.stream()
    .filter(n -> n % 2 == 0)   // só pares
    .mapToInt(n -> n * n)      // ao quadrado
    .sum();                    // 4 + 16 + 36 = 56
\`\`\`

Operações são **intermediárias** (\`filter\`, \`map\`) ou **terminais** (\`sum\`, \`collect\`, \`forEach\`). A stream só é processada quando há uma operação terminal (avaliação preguiçosa).

\`\`\`java
List<String> maiusculas = nomes.stream()
    .map(String::toUpperCase)
    .collect(Collectors.toList());
\`\`\``,
          quiz: [
            {
              q: "Qual destas é uma operação TERMINAL?",
              options: ["filter", "map", "collect", "peek"],
              answer: 2,
            },
          ],
          exercise: {
            prompt:
              "Usando streams, some apenas os números pares de 1 a 10 e imprima:\n\n```\n30\n```",
            lang: "java",
            starter: `import java.util.stream.*;
public class Main {
    public static void main(String[] args) {
        int soma = IntStream.rangeClosed(1, 10)
            // filtre pares e some
            .sum();
        System.out.println(soma);
    }
}`,
            expectedOutput: "30",
            hint: "Use .filter(n -> n % 2 == 0) antes de .sum().",
            solution: `import java.util.stream.*;
public class Main {
    public static void main(String[] args) {
        int soma = IntStream.rangeClosed(1, 10)
            .filter(n -> n % 2 == 0)
            .sum();
        System.out.println(soma);
    }
}`,
          },
        },
      ],
    },
    {
      id: "java-exceptions",
      step: 4,
      title: "Tratamento de Exceções",
      icon: "⚠️",
      summary: "try/catch/finally, exceções checadas e boas práticas.",
      lessons: [
        {
          id: "exceptions-basics",
          title: "try, catch, finally e throw",
          minutes: 16,
          xp: 55,
          theory: `## Por que exceções

Exceções separam o fluxo normal do tratamento de erros. Em vez de retornar códigos de erro, o método **lança** uma exceção que sobe na pilha até alguém tratá-la.

\`\`\`java
try {
    int x = Integer.parseInt("abc"); // lança NumberFormatException
} catch (NumberFormatException e) {
    System.out.println("Número inválido: " + e.getMessage());
} finally {
    System.out.println("Sempre executa");
}
\`\`\`

## Checadas x não checadas

- **Checadas** (\`IOException\`) — o compilador obriga a tratar ou declarar \`throws\`.
- **Não checadas** (\`RuntimeException\`, ex.: \`NullPointerException\`) — erros de programação.

## Boas práticas

- Capture o tipo mais específico possível.
- Não engula exceções com \`catch (Exception e) {}\` vazio.
- Use \`try-with-resources\` para fechar recursos automaticamente:

\`\`\`java
try (var reader = new BufferedReader(...)) {
    // usa o reader; é fechado sozinho no fim
}
\`\`\``,
          quiz: [
            {
              q: "Quando o bloco `finally` é executado?",
              options: [
                "Só quando há exceção",
                "Só quando não há exceção",
                "Sempre, com ou sem exceção",
                "Nunca, é opcional",
              ],
              answer: 2,
            },
          ],
          exercise: {
            prompt:
              'Tente converter `"abc"` em inteiro. Se falhar, imprima exatamente:\n\n```\nerro\n```',
            lang: "java",
            starter: `public class Main {
    public static void main(String[] args) {
        String entrada = "abc";
        // tente Integer.parseInt e trate a exceção imprimindo "erro"
    }
}`,
            expectedOutput: "erro",
            solution: `public class Main {
    public static void main(String[] args) {
        String entrada = "abc";
        try {
            Integer.parseInt(entrada);
        } catch (NumberFormatException e) {
            System.out.println("erro");
        }
    }
}`,
          },
        },
      ],
    },
    {
      id: "java-multithreading",
      step: 5,
      title: "Multithreading",
      icon: "⚙️",
      summary: "Threads, sincronização, ExecutorService e concorrência segura.",
      lessons: [
        {
          id: "threads-intro",
          title: "Threads e concorrência",
          minutes: 18,
          xp: 60,
          theory: `## Concorrência em Java

Uma **thread** é uma linha de execução. Várias threads rodam "ao mesmo tempo", aproveitando múltiplos núcleos.

\`\`\`java
Runnable tarefa = () -> System.out.println("oi da thread");
Thread t = new Thread(tarefa);
t.start();  // start() roda em paralelo; run() rodaria na mesma thread
t.join();   // espera terminar
\`\`\`

## O problema das condições de corrida

Quando duas threads escrevem na mesma variável sem coordenação, o resultado é imprevisível. Soluções:

- \`synchronized\` — exclusão mútua em um bloco/método.
- \`AtomicInteger\` — operações atômicas sem lock.
- \`java.util.concurrent\` — \`ExecutorService\`, \`ConcurrentHashMap\`, etc.

\`\`\`java
ExecutorService pool = Executors.newFixedThreadPool(4);
pool.submit(() -> processar());
pool.shutdown();
\`\`\`

Na prática moderna, prefira **pools** e estruturas concorrentes em vez de criar e gerenciar threads manualmente. (Java 21+ trouxe *virtual threads* para escalar I/O com baixo custo.)`,
          quiz: [
            {
              q: "Qual método inicia a thread em paralelo?",
              options: ["run()", "start()", "exec()", "begin()"],
              answer: 1,
              explain: "run() executaria na thread atual; start() cria uma nova.",
            },
          ],
        },
      ],
    },
    {
      id: "java-jdbc",
      step: 6,
      title: "JDBC",
      icon: "🔌",
      summary: "Conexão com banco, PreparedStatement e ResultSet.",
      lessons: [
        {
          id: "jdbc-intro",
          title: "Acessando banco com JDBC",
          minutes: 16,
          xp: 55,
          theory: `## JDBC: a API de banco do Java

JDBC é a camada de baixo nível para falar com bancos relacionais. O fluxo:

1. Obter uma \`Connection\`.
2. Criar um \`PreparedStatement\` (sempre parametrizado!).
3. Executar e ler o \`ResultSet\`.

\`\`\`java
String sql = "SELECT nome FROM usuarios WHERE id = ?";
try (Connection con = DriverManager.getConnection(url, user, pass);
     PreparedStatement ps = con.prepareStatement(sql)) {
    ps.setInt(1, 42);
    try (ResultSet rs = ps.executeQuery()) {
        if (rs.next()) System.out.println(rs.getString("nome"));
    }
}
\`\`\`

## Segurança: nunca concatene SQL

\`"... WHERE id = " + entrada\` abre brecha para **SQL Injection**. O \`?\` do \`PreparedStatement\` separa código de dados e elimina o risco. Frameworks como JPA/Hibernate (passos à frente) abstraem o JDBC, mas o entendimento aqui é a base.`,
          quiz: [
            {
              q: "Por que usar PreparedStatement com `?` em vez de concatenar strings?",
              options: [
                "É mais rápido de digitar",
                "Evita SQL Injection e separa dados de código",
                "É obrigatório pelo compilador",
                "Não há diferença",
              ],
              answer: 1,
            },
          ],
        },
      ],
    },
    {
      id: "java-sql",
      step: 7,
      title: "SQL",
      icon: "🗄️",
      summary: "SELECT, JOIN, agregações, índices e modelagem.",
      lessons: [
        {
          id: "sql-basics",
          title: "Consultas SQL essenciais",
          minutes: 20,
          xp: 60,
          theory: `## A linguagem dos dados relacionais

\`\`\`sql
SELECT nome, idade
FROM usuarios
WHERE idade >= 18
ORDER BY idade DESC
LIMIT 10;
\`\`\`

## JOIN

Combina linhas de tabelas relacionadas pela chave:

\`\`\`sql
SELECT p.titulo, u.nome
FROM posts p
JOIN usuarios u ON u.id = p.autor_id;
\`\`\`

\`INNER JOIN\` só traz correspondências; \`LEFT JOIN\` mantém todas as linhas da esquerda.

## Agregação

\`\`\`sql
SELECT autor_id, COUNT(*) AS total
FROM posts
GROUP BY autor_id
HAVING COUNT(*) > 5;
\`\`\`

\`WHERE\` filtra linhas antes de agrupar; \`HAVING\` filtra grupos. **Índices** aceleram leituras em colunas muito consultadas — ao custo de escritas um pouco mais lentas.`,
          examples: [
            {
              title: "Top 3 produtos por receita",
              lang: "sql",
              code: `SELECT produto_id, SUM(valor) AS receita
FROM vendas
GROUP BY produto_id
ORDER BY receita DESC
LIMIT 3;`,
            },
          ],
          quiz: [
            {
              q: "Qual cláusula filtra GRUPOS após o GROUP BY?",
              options: ["WHERE", "HAVING", "FILTER", "ON"],
              answer: 1,
            },
          ],
        },
      ],
    },
    {
      id: "java-spring-core",
      step: 8,
      title: "Spring Core",
      icon: "🌿",
      summary: "IoC, injeção de dependência e o container do Spring.",
      lessons: [
        {
          id: "spring-core-di",
          title: "Inversão de Controle e Injeção de Dependência",
          minutes: 18,
          xp: 60,
          theory: `## O coração do Spring

**Inversão de Controle (IoC)**: em vez de o seu código criar suas dependências (\`new\`), o **container** do Spring as cria e entrega prontas. Isso é a **Injeção de Dependência (DI)**.

\`\`\`java
@Service
class PedidoService {
    private final EstoqueRepository estoque;

    // o Spring injeta o repositório automaticamente
    PedidoService(EstoqueRepository estoque) {
        this.estoque = estoque;
    }
}
\`\`\`

Anotações-chave:

- \`@Component\` / \`@Service\` / \`@Repository\` — registram a classe como *bean*.
- \`@Autowired\` — injeta (preferível via construtor, como acima).
- \`@Configuration\` + \`@Bean\` — define beans manualmente.

## Por que importa

DI deixa o código desacoplado e **testável**: nos testes você injeta uma implementação falsa (mock). Esse é o mesmo princípio de "programar para interfaces" que você viu em OOP.`,
          quiz: [
            {
              q: "O que a Injeção de Dependência resolve?",
              options: [
                "Acelera a JVM",
                "Faz o container fornecer as dependências, desacoplando o código",
                "Compila mais rápido",
                "Substitui o banco de dados",
              ],
              answer: 1,
            },
          ],
        },
      ],
    },
    {
      id: "java-spring-boot",
      step: 9,
      title: "Spring Boot",
      icon: "🔋",
      summary: "Auto-configuração, starters e a primeira aplicação.",
      lessons: [
        {
          id: "spring-boot-intro",
          title: "Sua primeira aplicação Spring Boot",
          minutes: 16,
          xp: 60,
          theory: `## Spring Boot = Spring sem dor de configuração

O Spring Boot adiciona **auto-configuração** e um servidor embutido (Tomcat) para você subir uma API com pouquíssimo código.

\`\`\`java
@SpringBootApplication
public class App {
    public static void main(String[] args) {
        SpringApplication.run(App.class, args);
    }
}
\`\`\`

- **Starters** (\`spring-boot-starter-web\`) trazem um conjunto coeso de dependências.
- \`application.properties\` / \`.yml\` centraliza configuração.
- \`@RestController\` expõe endpoints (próximo passo: REST APIs).

Use o **Spring Initializr** (start.spring.io) para gerar o projeto. Boot cuida de boilerplate; você foca na regra de negócio.`,
          quiz: [
            {
              q: "Qual a principal promessa do Spring Boot?",
              options: [
                "Substituir o Java",
                "Auto-configuração e servidor embutido para subir apps rápido",
                "Compilar para C",
                "Eliminar o banco de dados",
              ],
              answer: 1,
            },
          ],
        },
      ],
    },
    {
      id: "java-rest",
      step: 10,
      title: "REST APIs",
      icon: "🌐",
      summary: "Verbos HTTP, status codes, JSON e design de endpoints.",
      lessons: [
        {
          id: "rest-intro",
          title: "Construindo uma REST API",
          minutes: 18,
          xp: 60,
          theory: `## Princípios REST

Recursos identificados por URLs, manipulados por **verbos HTTP**:

- \`GET /usuarios\` — listar
- \`GET /usuarios/42\` — obter um
- \`POST /usuarios\` — criar
- \`PUT/PATCH /usuarios/42\` — atualizar
- \`DELETE /usuarios/42\` — remover

\`\`\`java
@RestController
@RequestMapping("/usuarios")
class UsuarioController {
    @GetMapping("/{id}")
    Usuario buscar(@PathVariable Long id) { ... }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    Usuario criar(@RequestBody Usuario novo) { ... }
}
\`\`\`

## Status codes que você precisa saber

- \`200\` OK, \`201\` Created, \`204\` No Content
- \`400\` Bad Request, \`401\` Unauthorized, \`403\` Forbidden, \`404\` Not Found
- \`500\` Internal Server Error

Use os códigos corretos — eles são parte do contrato da API.`,
          quiz: [
            {
              q: "Qual verbo HTTP é idiomático para CRIAR um recurso?",
              options: ["GET", "POST", "DELETE", "HEAD"],
              answer: 1,
            },
            {
              q: "Qual status indica 'recurso não encontrado'?",
              options: ["200", "301", "404", "500"],
              answer: 2,
            },
          ],
        },
      ],
    },
    {
      id: "java-jpa",
      step: 11,
      title: "JPA / Hibernate",
      icon: "🧬",
      summary: "ORM, entidades, relacionamentos e repositórios.",
      lessons: [
        {
          id: "jpa-intro",
          title: "Mapeamento objeto-relacional",
          minutes: 18,
          xp: 60,
          theory: `## ORM: objetos viram tabelas

JPA é a especificação; **Hibernate** é a implementação mais usada. Você anota classes Java e o ORM gera/usa as tabelas.

\`\`\`java
@Entity
class Usuario {
    @Id @GeneratedValue
    Long id;
    String nome;

    @OneToMany(mappedBy = "autor")
    List<Post> posts;
}
\`\`\`

Com **Spring Data JPA**, repositórios viram interfaces — sem implementar:

\`\`\`java
interface UsuarioRepo extends JpaRepository<Usuario, Long> {
    List<Usuario> findByNome(String nome); // query derivada do nome
}
\`\`\`

## Cuidado clássico: N+1

Carregar uma lista e depois acessar uma relação \`LAZY\` item a item dispara N consultas extras. Resolva com \`JOIN FETCH\` ou \`@EntityGraph\`. ORM acelera o desenvolvimento, mas você ainda precisa entender o SQL que ele gera.`,
          quiz: [
            {
              q: "Qual anotação marca uma classe como entidade persistente?",
              options: ["@Table", "@Entity", "@Repository", "@Bean"],
              answer: 1,
            },
          ],
        },
      ],
    },
    {
      id: "java-microservices",
      step: 12,
      title: "Microsserviços",
      icon: "🧱",
      summary: "Decomposição, comunicação, resiliência e trade-offs.",
      lessons: [
        {
          id: "microservices-intro",
          title: "Monólito x microsserviços",
          minutes: 18,
          xp: 65,
          theory: `## Quando dividir

Microsserviços quebram a aplicação em serviços pequenos, deployáveis de forma independente, cada um dono dos seus dados. Ganhos: escala e deploy independentes, times autônomos. Custo: **complexidade distribuída** (rede, consistência, observabilidade).

> Regra prática: comece com um **monólito bem modularizado**. Só divida quando a dor de escala/time justificar.

## Padrões essenciais

- **API Gateway** — porta de entrada única.
- **Service Discovery** — serviços se encontram dinamicamente.
- **Circuit Breaker** (Resilience4j) — evita que uma falha derrube tudo.
- **Comunicação**: síncrona (REST/gRPC) ou assíncrona (mensageria — próximo passo, Kafka).

A consistência costuma ser **eventual**; abrace isso com padrões como Saga e idempotência.`,
          quiz: [
            {
              q: "Qual é a recomendação prática mais comum ao começar um sistema?",
              options: [
                "Começar com dezenas de microsserviços",
                "Começar com um monólito bem modularizado",
                "Nunca usar banco de dados",
                "Usar apenas comunicação síncrona",
              ],
              answer: 1,
            },
          ],
        },
      ],
    },
    {
      id: "java-kafka",
      step: 13,
      title: "Kafka",
      icon: "📨",
      summary: "Mensageria, tópicos, partições, produtores e consumidores.",
      lessons: [
        {
          id: "kafka-intro",
          title: "Mensageria com Kafka",
          minutes: 18,
          xp: 65,
          theory: `## Comunicação assíncrona e desacoplada

Kafka é um **log distribuído** de eventos. Produtores publicam em **tópicos**; consumidores leem no seu próprio ritmo.

- **Tópico** — fluxo nomeado de eventos.
- **Partição** — divide o tópico para paralelismo e ordem por chave.
- **Consumer group** — consumidores que dividem as partições entre si.
- **Offset** — posição de leitura (Kafka guarda os eventos, não os apaga ao consumir).

\`\`\`java
@KafkaListener(topics = "pedidos")
void consumir(PedidoEvent e) {
    // processa o evento
}
\`\`\`

Vantagem central: o produtor não conhece os consumidores. Isso permite **escalar**, reprocessar histórico e ligar novos serviços sem mudar quem produz.`,
          quiz: [
            {
              q: "O que permite paralelismo e ordenação por chave em um tópico Kafka?",
              options: ["Réplicas", "Partições", "Brokers", "Offsets"],
              answer: 1,
            },
          ],
        },
      ],
    },
    {
      id: "java-docker",
      step: 14,
      title: "Docker",
      icon: "🐳",
      summary: "Imagens, containers, Dockerfile e empacotamento.",
      lessons: [
        {
          id: "docker-intro",
          title: "Empacotando com Docker",
          minutes: 16,
          xp: 60,
          theory: `## Por que containers

Um **container** empacota sua app + dependências num ambiente isolado e reproduzível: "funciona na minha máquina" deixa de ser problema.

\`\`\`yaml
# Dockerfile (multi-stage para Java)
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app
COPY . .
RUN ./mvnw package -DskipTests

FROM eclipse-temurin:21-jre
COPY --from=build /app/target/app.jar app.jar
ENTRYPOINT ["java","-jar","app.jar"]
\`\`\`

- **Imagem** — template imutável.
- **Container** — instância em execução da imagem.
- Build multi-stage deixa a imagem final pequena (sem o JDK completo).

\`\`\`bash
docker build -t minha-api .
docker run -p 8080:8080 minha-api
\`\`\``,
          quiz: [
            {
              q: "Qual a diferença entre imagem e container?",
              options: [
                "São sinônimos",
                "Imagem é o template imutável; container é a instância em execução",
                "Container é o template; imagem é a execução",
                "Imagem só existe na nuvem",
              ],
              answer: 1,
            },
          ],
        },
      ],
    },
    {
      id: "java-kubernetes",
      step: 15,
      title: "Kubernetes",
      icon: "☸️",
      summary: "Pods, Deployments, Services e orquestração.",
      lessons: [
        {
          id: "k8s-intro",
          title: "Orquestração com Kubernetes",
          minutes: 18,
          xp: 65,
          theory: `## Quando muitos containers viram um sistema

Kubernetes (k8s) orquestra containers: escala, reinicia os que caem, faz deploy sem downtime e balanceia carga.

- **Pod** — menor unidade; um ou mais containers juntos.
- **Deployment** — declara o estado desejado (réplicas, imagem) e o k8s converge para ele.
- **Service** — IP/DNS estável que roteia para os pods.
- **Ingress** — entrada HTTP externa.

\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata: { name: api }
spec:
  replicas: 3
  selector: { matchLabels: { app: api } }
  template:
    metadata: { labels: { app: api } }
    spec:
      containers:
        - name: api
          image: minha-api:1.0
          ports: [{ containerPort: 8080 }]
\`\`\`

Você declara o **estado desejado**; o k8s cuida de chegar lá e mantê-lo.`,
          quiz: [
            {
              q: "Qual objeto declara quantas réplicas da sua app devem rodar?",
              options: ["Pod", "Service", "Deployment", "Ingress"],
              answer: 2,
            },
          ],
        },
      ],
    },
    {
      id: "java-cloud",
      step: 16,
      title: "Cloud",
      icon: "☁️",
      summary: "Modelos de serviço, escalabilidade e custo na nuvem.",
      lessons: [
        {
          id: "cloud-intro",
          title: "Fundamentos de Cloud",
          minutes: 16,
          xp: 60,
          theory: `## A nuvem como plataforma

Provedores (AWS, GCP, Azure) oferecem computação, armazenamento e serviços gerenciados sob demanda.

Modelos de serviço:

- **IaaS** — você gerencia VMs (ex.: EC2).
- **PaaS** — você sobe código, a plataforma cuida do resto.
- **Serverless / FaaS** — funções que escalam a zero (ex.: Lambda).

Conceitos que importam:

- **Escala horizontal** (mais instâncias) x **vertical** (máquina maior).
- **Stateless** — guarde estado fora da instância (banco, cache) para escalar.
- **Observabilidade** — logs, métricas e tracing distribuído.
- **Custo** — recursos cobrados por uso; arquitete pensando em eficiência.

A Vercel onde este app roda é um exemplo de plataforma serverless: você dá o código, ela cuida da infra.`,
          quiz: [
            {
              q: "Para escalar horizontalmente com facilidade, sua aplicação deve ser:",
              options: ["Stateful", "Monolítica", "Stateless", "Single-thread"],
              answer: 2,
            },
          ],
        },
      ],
    },
    {
      id: "java-system-design",
      step: 17,
      title: "System Design",
      icon: "🏛️",
      summary: "Escalabilidade, consistência, cache, filas e trade-offs.",
      lessons: [
        {
          id: "sysdesign-intro",
          title: "Pensando em sistemas de larga escala",
          minutes: 22,
          xp: 80,
          theory: `## O topo da escada

System Design é a arte de combinar tudo que você aprendeu para construir sistemas que escalam, são confiáveis e mantíveis. Não há resposta única — há **trade-offs**.

## Ferramentas mentais

- **Teorema CAP** — sob partição de rede, escolha entre Consistência e Disponibilidade.
- **Cache** (Redis) — leituras rápidas; cuidado com invalidação.
- **Filas** (Kafka) — absorvem picos e desacoplam.
- **Réplicas de leitura / sharding** — distribuem carga no banco.
- **CDN** — conteúdo estático perto do usuário.
- **Idempotência** — operações seguras de repetir.

## Método para entrevistas

1. Esclareça requisitos e estime escala (QPS, dados).
2. Defina a API.
3. Desenhe o diagrama de alto nível.
4. Aprofunde gargalos (banco, cache, consistência).
5. Discuta trade-offs e pontos de falha.

Você chegou ao topo da trilha Java. A partir daqui, projetar um encurtador de URL, um feed ou um sistema de pagamentos vira uma conversa sobre escolhas — exatamente o que separa um sênior.`,
          quiz: [
            {
              q: "Segundo o Teorema CAP, sob partição de rede você precisa escolher entre:",
              options: [
                "Velocidade e custo",
                "Consistência e Disponibilidade",
                "SQL e NoSQL",
                "Cache e fila",
              ],
              answer: 1,
            },
          ],
        },
      ],
    },
  ],
};
