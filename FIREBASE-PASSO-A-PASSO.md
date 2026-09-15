# Firebase — passo a passo do site CAJU

O código do Firebase já foi adicionado ao site.

## 1. O texto da tela do Firebase

Você não precisa apagar o texto que aparece em “Adicionar o SDK do Firebase”.
Ele é apenas um exemplo para copiar. O `firebaseConfig` desse projeto já está no arquivo `js/config.js`.

## 2. Ativar o Firestore

No painel do Firebase:

1. Abra **Bancos de dados e armazenamento**.
2. Entre em **Firestore Database**.
3. Clique em **Criar banco de dados**.
4. Escolha **modo de teste** para começar.
5. Escolha a região sugerida pelo Firebase.
6. Finalize.

Depois disso, o site poderá salvar:

- cadastros de alunos na coleção `students`;
- mensagens de contato na coleção `contacts`;
- feedbacks na coleção `feedback`.

## 3. Regras iniciais do Firestore

Use estas regras enquanto o site estiver em fase de teste:

```txt
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /students/{document} {
      allow create: if true;
      allow read, update, delete: if false;
    }

    match /contacts/{document} {
      allow create: if true;
      allow read, update, delete: if false;
    }

    match /feedback/{document} {
      allow create: if true;
      allow read, update, delete: if false;
    }
  }
}
```

Essas regras permitem que visitantes façam cadastro, enviem contato e feedback, mas não permitem ler, editar ou apagar os dados pelo site.

## 4. Onde ver as respostas

No Firebase:

1. Vá em **Firestore Database**.
2. Abra a aba **Dados**.
3. Veja as coleções `students`, `contacts` e `feedback`.
