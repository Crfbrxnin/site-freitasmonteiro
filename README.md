# Bruno Freitas Contabilidade — site e painel

Site institucional e comercial com blog, landing pages, captação de leads e painel administrativo.
Identidade visual aplicada a partir do **Manual da Marca v1.0 (nov/2026)**.

**Stack:** Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · libSQL/SQLite (local ou Turso) · Flux Icons.

---

## 1. Rodar localmente

```bash
npm install
cp .env.example .env.local   # preencha SESSION_SECRET, ADMIN_EMAIL e ADMIN_PASSWORD
npm run dev                  # http://localhost:3000  ·  painel: /admin
```

Na primeira execução o banco (`data/site.db`) é criado com os serviços, landing pages, categorias e 3 artigos iniciais.
O primeiro administrador é criado a partir de `ADMIN_EMAIL`/`ADMIN_PASSWORD` **somente se ainda não houver usuários**.
Depois do primeiro acesso, troque a senha em *Minha conta* e remova `ADMIN_PASSWORD` do ambiente.

Para criar ou redefinir um administrador pelo terminal: `npm run admin:create -- email@dominio.com.br "Nome"`.

## 2. Variáveis de ambiente

| Variável | Obrigatória | Para quê |
| --- | --- | --- |
| `SITE_URL` | sim | Domínio público (canonical, sitemap, Open Graph): `https://freitasmonteiro.com.br` |
| `DATABASE_URL` | sim | `file:./data/site.db` (servidor com disco) ou `libsql://...turso.io` |
| `DATABASE_AUTH_TOKEN` | com Turso | Token do banco Turso |
| `SESSION_SECRET` | sim | Segredo das sessões do painel (mín. 32 caracteres): `openssl rand -base64 48` |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | 1º acesso | Cria o primeiro administrador |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | opcional | Envio dos leads por e-mail |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | opcional | Antispam Cloudflare Turnstile |

Nenhum segredo vai para o navegador. GA4, Search Console, Meta Pixel, e-mail de destino dos leads e webhook de CRM são configurados no painel (*Integrações*, só administradores).

## 3. Publicação (recomendado: Railway + Cloudflare)

Todas as páginas leem o banco a cada acesso (10–40 ms), então a instalação (build) não depende do banco e o conteúdo editado no painel aparece na hora.

1. **GitHub:** envie este projeto para um repositório **privado**.
2. **Railway** (railway.com): *New Project → Deploy from GitHub repo*. O Railway detecta o Next.js e roda `npm run build` e `npm start` (a porta vem da variável `PORT`).
3. **Volume:** no serviço, *Add Volume* com caminho de montagem `/app/data`. É ali que ficam o banco, os leads e as imagens enviadas.
4. **Variáveis** (*Variables*):
   - `SITE_URL=https://freitasmonteiro.com.br`
   - `DATABASE_URL=file:/app/data/site.db`
   - `SESSION_SECRET=` (gere com `openssl rand -base64 48`)
   - `ADMIN_EMAIL=bruno@freitasmonteiro.com.br` e `ADMIN_PASSWORD=` (temporária; remova após o primeiro login)
   - `SMTP_*` quando o e-mail estiver criado (exemplo com Zoho no `.env.example`).
5. **Domínio:** em *Settings → Networking → Custom Domain*, adicione `freitasmonteiro.com.br` e `www.freitasmonteiro.com.br`. O Railway mostra os registros DNS a criar.
6. **DNS no Cloudflare** (plano gratuito): domínios `.com.br` usam o Registro.br, cujo DNS não aceita CNAME no domínio raiz. Crie a zona no Cloudflare, aponte os *nameservers* no Registro.br para os do Cloudflare e crie os registros indicados pelo Railway com a nuvem **cinza** (*DNS only*). Antes de trocar os nameservers, confira se os registros de e-mail (MX, SPF, DKIM, DMARC) foram copiados.

**Alternativa — Vercel:** use Turso como banco (`DATABASE_URL=libsql://...` + `DATABASE_AUTH_TOKEN`). Uso comercial na Vercel exige o plano Pro.

**Servidor próprio (VPS):** `npm ci && npm run build && npm start` atrás de Caddy ou Nginx com HTTPS, com `data/` em disco persistente e backup.

**Backup:** o banco é um único arquivo (`/app/data/site.db`). Faça cópias periódicas (no Railway, use os *backups* do volume).

### Domínio e e-mails

- **Endereço principal:** `https://freitasmonteiro.com.br`. O `www.freitasmonteiro.com.br` redireciona para ele (já configurado no `next.config.ts`); aponte os dois no DNS para a hospedagem e ative HTTPS.
- **E-mail público do site:** `contato@freitasmonteiro.com.br` (rodapé, Contato, dados estruturados e Política de Privacidade).
- **E-mail que recebe os leads:** `bruno@freitasmonteiro.com.br` (Painel › Integrações).
- **Provedor de e-mail sugerido (aceita pessoa física):** Zoho Mail Lite, com `bruno@` como conta e `contato@` como alias. O site envia os avisos pelo SMTP do Zoho (`smtp.zoho.com`, porta 587, usuário `bruno@`, senha específica de aplicativo, remetente `contato@`). Os registros de DNS exatos (MX, SPF, DKIM) aparecem no painel do Zoho; crie-os no Cloudflare e acrescente `_dmarc` com `v=DMARC1; p=none; rua=mailto:bruno@freitasmonteiro.com.br`.
- **Administrador:** use `ADMIN_EMAIL=bruno@freitasmonteiro.com.br` no primeiro acesso.
- **Entregabilidade:** no DNS do domínio, mantenha os registros SPF, DKIM e DMARC indicados pelo seu provedor de e-mail (Google Workspace, Microsoft 365, Zoho, Hostinger etc.), para que os avisos de lead não caiam no spam.
- **Google Search Console:** cadastre a propriedade de domínio `freitasmonteiro.com.br` (verificação por DNS) ou use o código de verificação em *Integrações*, e envie `https://freitasmonteiro.com.br/sitemap.xml`.

## 4. Páginas

| Rota | Conteúdo |
| --- | --- |
| `/` | Hero, benefícios, serviços, diferenciais, como funciona, depoimentos, blog, CTA final |
| `/sobre` | Posicionamento e princípios (do manual), Bruno Freitas, história, missão/visão/valores, filosofia, equipe |
| `/servicos` e `/servicos/[url]` | Página geral e uma página por serviço (problema, benefícios, escopo, público, etapas, FAQ, formulário, WhatsApp) |
| `/blog`, `/blog/[url]`, `/blog/categoria/[url]` | Busca, filtro por categoria, paginação, artigos com H2/H3, tempo de leitura, compartilhamento, relacionados, CTA |
| `/contato` | Formulário, dados de contato, redes e mapa (quando o endereço é público) |
| `/orcamento` | Formulário de orçamento completo (aceita `?servico=<url>`) |
| `/diagnostico` | Landing page do diagnóstico contábil inicial |
| `/lp/[url]` | Landing pages de anúncios, sem menu: abertura de empresa, troca de contador, prestadores de serviço, pequenas empresas, planejamento tributário |
| `/obrigado` | Página de confirmação (use como conversão no Google Ads/Meta) |
| `/politica-de-privacidade` | Modelo LGPD editável |
| `/admin` | Painel |

## 5. Painel administrativo

- **Painel:** leads e cliques no WhatsApp dos últimos 30 dias (por origem, formulário e página) e lista de pendências de configuração.
- **Leads:** busca, filtro, situação (novo → cliente), anotações, resposta pelo WhatsApp, exportação CSV e exclusão (pedidos LGPD).
- **Conteúdo:** página inicial, Sobre, serviços (criar/editar/ocultar/ordenar), blog (rascunho, publicar, programar por data, excluir), categorias, depoimentos, landing pages, mídia.
- **Configurações:** identidade e dados legais, contato e localização (SEO local), mensagens do WhatsApp por página, redes sociais, SEO de cada página, Política de Privacidade, integrações.
- **Usuários:** administrador (tudo) e editor (conteúdo e leads, sem integrações, usuários ou exclusão de leads).

Nos títulos, coloque a palavra de ênfase entre `*asteriscos*`: ela aparece em itálico (rosé no escuro, vinho no claro), como pede o manual.

**Modo de configuração** (*Identidade e dados legais*): enquanto ligado, campos vazios aparecem no site como "✎ A definir". Desligue antes de divulgar o site; os campos vazios passam a ficar ocultos.

## 6. Leads, WhatsApp e rastreamento

- Formulários validados no navegador e no servidor, com consentimento obrigatório, honeypot, tempo mínimo de preenchimento, limite de envios por IP e Turnstile opcional.
- Cada lead é salvo no banco e, se configurado, enviado por e-mail (SMTP) e/ou webhook JSON (Make, Zapier, n8n, CRM). O resultado do envio aparece na ficha do lead.
- UTMs (`utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`), página de entrada e referência ficam guardados na sessão do navegador e são gravados junto do lead.
- O botão flutuante e todos os botões de WhatsApp usam `wa.me` com mensagem conforme a origem (home, cada serviço, cada landing page, blog, contato…). Sem número configurado, os botões levam para `/contato`.
- GA4 e Meta Pixel só carregam **depois do aceite** no aviso de cookies. Eventos: `generate_lead` (Lead) e `whatsapp_click` (Contact).

## 7. Segurança

Senhas com bcrypt; sessão JWT em cookie `httpOnly`/`secure`/`SameSite=Lax` com versão (trocar a senha derruba outras sessões); limite de tentativas de login; permissões checadas em cada ação do servidor; uploads conferidos pela assinatura do arquivo (SVG bloqueado); Markdown sem HTML bruto; CSV protegido contra injeção de fórmulas; cabeçalhos HSTS, `nosniff`, `X-Frame-Options` e `noindex` no painel.

## 8. O que ainda depende de dados do escritório

Nada foi inventado. O painel lista o que falta em *Pendências de configuração*:

- horário, endereço (ou manter oculto) e região atendida;
- razão social, CNPJ e, se existir, CRC da organização contábil;
- foto profissional, apresentação de Bruno Freitas, história, missão, visão, valores e equipe;
- depoimentos reais com autorização;
- GA4, Search Console, Meta Pixel, SMTP e webhook;
- revisão dos textos dos serviços e dos 3 artigos iniciais (escritos como ponto de partida, sem números que mudam com a legislação);
- revisão jurídica da Política de Privacidade.

Dados já preenchidos: CRC RJ-141105/O-6, WhatsApp (21) 98749-1091, Instagram @brunofreitas.cont, Rio de Janeiro/RJ, domínio freitasmonteiro.com.br, e-mail contato@freitasmonteiro.com.br e leads para bruno@freitasmonteiro.com.br.

**Fotos:** as imagens em `public/images/` vieram do Unsplash (licença Unsplash: uso comercial gratuito, sem obrigação de crédito; não é permitido revendê-las como imagens avulsas). Foram extraídas do PDF do manual, então têm resolução limitada (até 940 × 2075 px). Para máxima nitidez em telas de alta densidade, substitua cada arquivo pelo original baixado do Unsplash mantendo o mesmo nome (`calculadora-vertical.jpg`, `calculadora.jpg`, `travessia-vertical.jpg`, `travessia.jpg`, `edificio.jpg`). O site já aplica o tratamento P&B do manual automaticamente. Para o retrato do Bruno, use foto própria (campo *Foto profissional* em Sobre nós).
