---
title: "Pratique des Tests Unitaires"
sub_title: "Javascript"
author: "Mickaël RAMANITRERA"
theme:
    name: terminal-dark
    override:
        footer:
            style: template
            left: "{title}"
            center: "_mickael.ramanitrera_"
            right: "{current_slide} / {total_slides}"
            height: 3
        palette:
            classes:
                tag:
                    foreground: "ff0000"
                    background: "00ff00"
---

Sommaire
===

### Au Programme

<!-- incremental_lists: true -->
* Présentation de Jest
<!-- new_line -->
* Comment fonctionne Jest ? 
<!-- new_line -->
* Anatomie d'un test Jest
<!-- new_line -->
* Le modèle Arrange-Act-Assert
<!-- new_line -->
* Les assertions utiles
<!-- new_line -->
* Les mocks et spies
<!-- new_line -->
* Pratique
<!-- end_slide -->

Présentation de Jest
===

<!-- incremental_lists: true -->
- Jest est un framework de test développé initialement par Meta comme outil interne, puis est passé en open source en 2014.
<!-- new_line -->
- Intègre un `runner` de tests, un framework `d'assertions`, un support de `mocking` etc....
<!-- new_line -->
- Offre des messages d'erreur clairs et de bonnes performance.

<!-- end_slide -->

Comment Fonctionne Jest ?
===
<!-- incremental_lists: true -->
- Jest exécute vos fichiers de test et indique quels tests réussissent ou échouent.
<!-- new_line -->
- Les fichiers de test sont généralement placés dans un dossier `__tests__` ou nommés avec `.test.js`/`.test.ts`.
<!-- new_line -->

<!-- end_slide -->

Anatomie d'un Test Jest
===
<!-- column_layout: [2, 3] -->
<!-- column: 0 -->
<!-- incremental_lists: true -->
- `describe` regroupe des tests associés.
<!-- new_line -->
- `test` (ou `it`) définit un cas de test.
<!-- new_line -->
- `expect` est utilisé pour créer des assertions.
<!-- new_line -->
- `beforeAll/afterAll`  est utilisé pour exécuter un traitement avant/après tous les tests d'un fichier
<!-- new_line -->
- `beforeEach/afterEach` est utilisé pour exécuter un traitement avant/après chaque test d'un fichier

<!-- column: 1 -->

```javascript {9|10,15|12,16-19|1-3|5-7|all} +line_numbers
beforeAll(() => {
    console.log('Runs before the 2 shoulds')
})

beforeEach(() => {
    console.log('Runs every time before each should')
})

describe('Sum numbers', () => {
    it('should get a correct result summing 2 positive numbers', () => {
        const result = sum(1+2)
        expect(result).toBe(5)
    });

    it('should throw an error summing a number with a letter', () => {
        expect(
            () => sum(1+"a")
        ).toThrow()
    });
})
```
<!-- end_slide -->

Le Modèle Arrange-Act-Assert
===
<!-- column_layout: [2, 3] -->
<!-- column: 0 -->
<!-- incremental_lists: true -->
- **Arrange (Préparer)**: Mettre en place les objets et les valeurs nécessaires pour le test.
<!-- new_line -->
- **Act (Exécuter) :** Exécuter l'action ou la fonction que vous souhaitez tester.
<!-- new_line -->
- **Assert (Vérifier) :** Vérifier que le résultat de l'action est conforme aux attentes.

<!-- column: 1 -->
```javascript {all|3-8|10-11|13-14|all} +line_numbers
describe('Class builder', () => {
    it('should be able to build a mansion correctly', async () => {
        // Arrange
        const builder = new Builder({
            workers: 10,
            tools: [],
            engines: []
        });

        // Act
        const mansion = await builder.buildMansion(1);

        // Assert
        expect(mansion).toBeInstanceOf(Mansion)
    })
})
```

<!-- end_slide -->
Quelques assertions Utiles
===

Jest offre une multitude de matchers pour vos assertions :
<!-- new_line -->
<!-- new_line -->
<!-- incremental_lists: true -->
- `toBe(value)`: Compare des valeurs primitives (équivalent à `===`).
```javascript +line_numbers
    const result = sum(1+4);

    expect(result).toBe(5)  // ==> TRUE
```
- `toEqual(value)`: Compare récursivement toutes les propriétés d'objets ou de tableaux.
```javascript +line_numbers
    const myArray = [{id: 1}, {id: 2}]
    const result = myArray.push({id: 3});

    expect(result).toEqual({id: 1}, {id: 2}, {id: 3})  // ==> TRUE
```
- `not.toBe(value)` / `not.toEqual(value)`: Inverse l'assertion.
```javascript +line_numbers
    const myArray = [{id: 1}, {id: 2}]
    const result = myArray.push({id: 3});

    expect(result).not.toEqual({id: 1}, {id: 2})  // ==> TRUE
```

<!-- end_slide -->
Quelques assertions Utiles (2)
===
<!-- incremental_lists: true -->
- `toBeTruthy()` / `toBeFalsy()`: Vérifie les valeurs falsy / truthy.
```javascript +line_numbers
    const result = subtract(1, 1);

    expect(result).toBeFalsy()  // ==> TRUE
```
- `toContain(item)`: Vérifie si un tableau contient un élément spécifique.
```javascript +line_numbers
    const myArray = [1,2,3];

    expect(myArray).toContain(2)  // ==> TRUE
```
- `toThrow(error?)`: Vérifie si une fonction lève une erreur.
```javascript +line_numbers
     expect(
         () => {
             throw Error('This is an error')
         }
     ).toThrowError('This is an error'); // ==> TRUE
```
<!-- end_slide -->
Quelques assertions Utiles (3)
===
<!-- incremental_lists: true -->
- `toMatchObject({x:1, y: 2})`: Vérifie si une portion d'un objet est contenue dans un autre.
```javascript +line_numbers
    const result = {
        id: 098098098, 
        headers: ['Authorization:Bearer 17639873'], 
        body: {
            data: 'blabla',
            test: 'test'
        },
        query: {
            params: [1, 2, 3]
        }
    }

    expect(result).toMatchObject(
        {
            body: {data: 'blabla'}
        }
    ); // ==> TRUE
```
<!-- end_slide -->

Les Mocks et Spies
===
<!-- column_layout: [2, 3] -->
<!-- column: 0 -->
<!-- incremental_lists: true -->
- **Mocks :** Remplacent des dépendances réelles par des versions contrôlées pour isoler le code testé.
```javascript {1-2|4-24} +line_numbers
// sum.js
export default (a, b) => a + b;

// sum.test.js
import sum from 'sum.js';

jest.mock('sum.js');

describe('sum', () => {
    it('should return an arbitrary value', () => {
        sum
            .mockReturnValueOnce(1)
            .mockReturnValueOnce(2)
            .mockReturnValueOnce(3)
            .mockReturnValue(4);

        expect(sum(1,1)).toBe(1); // => TRUE
        expect(sum(1,1)).toBe(2); // => TRUE
        expect(sum(1,1)).toBe(3); // => TRUE
        expect(sum(1,1)).toBe(3); // => FALSE
        expect(sum(1,1)).toBe(4); // => TRUE
        expect(sum(1,1)).toBe(4); // => TRUE
    })
})
```
<!-- column: 1 -->
<!-- incremental_lists: true -->
- **Spies :** Observent l'appel de fonctions sans modifier leur implémentation.

```javascript {1-2|4-14} +line_numbers
// builder.js
import builder from 'builder.js'

// builder.test.js
const callWorkerSpy = jest.spyOn(builder, 'callWorker');

describe('builder', () => {
    it('should call worker when building a mansion', () => {
        const builder = new Builder();
        const mansion = builder.buildMansion()

        expect(callWorkerSpy).toHaveBeenCalled() // ==> TRUE
    })
})
```
<!-- end_slide -->
Une manière de faire un `it` en boucle
===

Cette syntaxe sert surtout quand on effetue des tests d'une même 
fonction mais avec des params ainsi que des résultats différents. 
Le `it` sera plus clean.

```javascript +line_numbers
    const testCases = [
        [1,2,3],
        [3,3,6],
        [4,4,8]
    ]
    it.each(testCases)('should correctly add %d and %d to get paid', (a, b, expected) => {
        const result = sum(a+b)
        expect(result).toBe(expected)
    })

```

<!-- end_slide -->
Pratique : Écrivez vos propres tests
===
<!-- incremental_lists: true -->
<!-- new_line -->
1. Récupérer le repo sur github.
<!-- new_line -->
2. Installer les dépendances
<!-- new_line -->
3. Ouvrez le projet dans votre IDE préféré :)

<!-- end_slide -->

Pratique : La somme
===
<!-- incremental_lists: true -->
<!-- new_line -->
1. Examinez le fichier sum.ts
<!-- new_line -->
2. Ecrire les tests correspondants
    - somme de 2 nombres positifs
    - somme de 2 zéros,
    - somme de 2 nombres négatifs 
    - somme d'un nombre positif et un nombre négatif
<!-- new_line -->
3. Faites passer le test

<!-- end_slide -->

Pratique : Une calculatrice
===
<!-- incremental_lists: true -->
<!-- new_line -->
1. Examinez le fichier calculator.ts
<!-- new_line -->
2. Ecrire un groupe de test pour chacune des méthodes (utiliser un it.each pour un test plus compact)
<!-- new_line -->
3. addition : 
    - somme de 2 nombres positifs
    - somme de 2 zéros,
    - somme de 2 nombres négatifs 
    - somme d'un nombre positif et un nombre négatif
<!-- new_line -->
4. soustraction : 
    - soustraire 2 à 5
    - soustraire 0 à 5
    - soustraire 5 à 2
    - soustraire -2 à -5
<!-- new_line -->
4. multiplication : 
    - multiplier 2 par 3
    - multiplier 5 par 0
    - multiplier 5 par -2
    - multiplier -2 par -3
<!-- new_line -->
5. division : 
    - diviser 6 par 3
    - diviser 10 par -2
    - diviser 7 par 2
    - confimer l'erreur de la division par 0
<!-- new_line -->
6. Faites passer les tests

<!-- end_slide -->

Pratique : La banque (part 1)
===
<!-- incremental_lists: true -->
<!-- new_line -->
1. Examinez le fichier bank.ts
<!-- new_line -->
> **NOTE**: On doit repartir d'une nouvelle instance de banque entre chaque test

```javascript +line_numbers
import { jest } from '@jest/globals';

describe('Bank', () => {
  let calculator: Calculator;
  let bank: Bank;
  let calculatorAddSpy: jest.SpiedFunction<(a: number, b: number) => number>;
  let calculatorSubtractSpy: jest.SpiedFunction<(a: number, b: number) => number>;

  beforeEach(() => {
    calculator = new Calculator();
    // Spy on calculator methods to ensure they are called correctly
    calculatorAddSpy = jest.spyOn(calculator, 'add');
    calculatorSubtractSpy = jest.spyOn(calculator, 'subtract');
    bank = new Bank(calculator);
  });

  afterEach(() => {
    // reset all mock states
    jest.restoreAllMocks();
  });
})

```
<!-- new_line -->
2. Ecrire les tests correspondants
    - création d'un nouveau compte, vérifier que la balance est 0
    - une erreur si on crée un compte avec un nom qui existe déjà
    - déposer de l'argent dans un compte existant, vérifier que la balance est correcte 
    - déposer de l'argent dans un compte inexistant cause une erreur
    - déposer un montant négatif ou égal à zéro lève une erreur
<!-- new_line -->
3. Faites passer le test

