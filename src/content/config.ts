import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		description: z.string(),
		tags: z.array(z.string()),
		// Transform string to Date object
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
	}),
});

const pages = defineCollection({
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		headTitle: z.string().optional(),
		description: z.string(),
		heroImage: z.string().optional(),
	}),
});

export const collections = { blog, pages };
