import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const teams = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/teams' }),
  schema: z.object({
    title: z.string(),
    shortName: z.string(),
    description: z.string(),
    role: z.string().optional(),
    established: z.string().optional(),
    advisors: z.array(z.string()).default([]),
    heroImage: z.string().optional(),
    heroAlt: z.string().optional(),
    thumbnail: z.string().optional(),
    logo: z.string().optional(),
    order: z.number().default(0),
    gallery: z.array(z.object({
      src: z.string(),
      alt: z.string(),
      caption: z.string().optional()
    })).optional(),
    sponsors: z.array(z.string()).default([]),
    recentResults: z.array(z.string()).default([]),
    externalLinks: z.object({
      instagram: z.string().optional(),
      github: z.string().optional(),
      website: z.string().optional()
    }).optional()
  })
});

const courses = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/courses' }),
  schema: z.object({
    code: z.string(),
    name: z.string(),
    credits: z.number(),
    crossList: z.array(z.string()).default([]),
    semesters: z.array(z.string()).default([]),
    prerequisites: z.array(z.string()).default([]),
    instructor: z.string().optional(),
    developedBy: z.string().optional(),
    openMaterialsUrl: z.string().optional(),
    order: z.number().default(0)
  })
});

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    heroImage: z.string().optional(),
    draft: z.boolean().default(false),
    category: z.enum(['news', 'event', 'student-spotlight']).default('news')
  })
});

const partners = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/partners' }),
  schema: z.object({
    name: z.string(),
    tier: z.enum(['founding', 'corporate', 'supporter', 'national-lab']),
    logo: z.string().optional(),
    description: z.string().optional(),
    website: z.string().optional(),
    since: z.string().optional(),
    order: z.number().default(0)
  })
});

export const collections = { teams, courses, news, partners };
