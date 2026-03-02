import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const filterTagEnum = z.enum([
  'TEATRO',
  'MUSICA',
  'AUDIOVISUALES',
  'TEXTOS',
  'OID_MORTALES',
]);

const portfolio = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/portfolio' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1),
      subtitle: z.string().min(1),
      category: z.string().optional(),
      filterTags: z.array(filterTagEnum).min(1),
      image: image(),
      imageAlt: z.string().min(1),
      order: z.number().int().positive(),
      externalUrl: z.string().url().optional(),
    }),
});

export const collections = { portfolio };
