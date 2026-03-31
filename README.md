# Mapa de Sala — Gerenciador de Turmas

Gerencie turmas, alunos e a disposição de carteiras em sala de aula.  
Funciona 100% offline — dados salvos no próprio dispositivo.

## Estrutura de arquivos

```
mapa-de-sala/
├── index.html          ← app principal
├── manifest.json       ← configuração da PWA
├── service-worker.js   ← cache offline
├── gerar_icones.py     ← script para regenerar ícones
└── icons/
    ├── icon.svg
    ├── icon-16.png
    ├── icon-32.png
    ├── icon-192.png
    ├── icon-512.png
    └── apple-touch-icon.png
```

---

## Como publicar na Microsoft Store

### Passo 1 — Subir no GitHub Pages

```bash
git init
git add .
git commit -m "primeira versão"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/mapa-de-sala.git
git push -u origin main
```

Depois, ative o GitHub Pages em:  
**Settings → Pages → Source: Deploy from branch (main / root)**

Seu app ficará disponível em:  
`https://SEU_USUARIO.github.io/mapa-de-sala`

---

### Passo 2 — Gerar o pacote MSIX no PWABuilder

1. Acesse **pwabuilder.com**
2. Cole a URL do GitHub Pages
3. Clique em **Package for stores → Microsoft Store**
4. Preencha os dados do Partner Center (Package ID, Publisher ID)
5. Baixe o `.zip` com o `.msix`

---

### Passo 3 — Criar conta e publicar no Partner Center

1. Acesse **partner.microsoft.com/dashboard**
2. Crie a conta de desenvolvedor (US$ 19, pagamento único)
3. Preencha o formulário W-8BEN (dados fiscais)
4. Crie um novo app e reserve o nome "Mapa de Sala"
5. Faça upload do `.msix` gerado
6. Configure preço, descrição e screenshots
7. Envie para revisão (3–7 dias úteis)

---

## Como regenerar os ícones

```bash
pip install Pillow
python3 gerar_icones.py
```

---

## Tecnologias

- HTML + CSS + JavaScript puro (sem frameworks)
- PWA com service worker e cache offline
- Dados salvos em localStorage
