# contributing to promptforge

thanks for wanting to contribute! here's how to get started.

## the easiest contribution: add a template

templates are the simplest way to contribute. each template is just an object in `lib/templates/index.ts`.

### template format

```typescript
{
  id: "your-template-id",           // unique, kebab-case
  name: "Your Template Name",       // display name
  category: "website",              // website|app|bot|api|script|agent|content|design
  description: "What this builds",  // one sentence
  icon: "Globe",                    // lucide-react icon name
  idea: "the starter idea text",    // what gets pre-filled in the forge
  tags: ["tag1", "tag2"],           // for filtering
}
```

### steps

1. fork the repo
2. add your template to the `templates` array in `lib/templates/index.ts`
3. test it locally: `npm run dev` → go to `/templates` → verify it appears
4. submit a PR with title: `template: [your template name]`

## improving the meta-prompt engine

the meta-prompting system is in `lib/llm/meta-prompt.ts`. this is the system prompt that generates prompts.

if you find a way to make the generated prompts better, submit a PR with:
- what you changed
- before/after example of generated output
- why it's better

## adding a new LLM provider

providers are in `lib/llm/providers.ts`. to add a new one:

1. add the provider config to the `providers` array
2. make sure it uses an OpenAI-compatible API
3. add the env variable to `.env.example`
4. update the README with the new provider

## code style

- typescript strict mode
- functional components with hooks
- tailwind for styling (no CSS modules)
- keep it simple — no over-engineering

## running locally

```bash
git clone https://github.com/YOUR_USERNAME/promptforge.git
cd promptforge
npm install
cp .env.example .env.local
# add at least one API key
npm run dev
```

## questions?

open an issue. we're friendly.
