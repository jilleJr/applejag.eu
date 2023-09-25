import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import mime from 'mime-types';
import sizeOf from 'image-size';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';
import fs from 'fs';
import { join } from 'path';

/**
 *
 * @param {import("astro").APIContext} context
 * @returns
 */
export async function GET(context) {
	const posts = await getCollection('blog');
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		xmlns: {
			media: 'http://search.yahoo.com/mrss/',
			atom: 'http://www.w3.org/2005/Atom',
		},
		customData: `<image>
			<url>${new URL('favicon.svg', context.site)}</url>
			<title>${SITE_TITLE}</title>
			<link>${context.site}</link>
		</image>
		<atom:link
			href="${context.site}rss.xml"
			rel="self"
			type="application/rss+xml"
		/>`,
		items: posts.map((post) => {
			/** @type {import("@astrojs/rss").RSSFeedItem} */
			const feedItem = {
				title: post.data.title,
				pubDate: post.data.pubDate,
				description: post.data.description,
				categories: post.data.tags,
				link: `/blog/${post.slug}/`,
			}
			const heroImage = post.data.heroImage;
			if (heroImage) {
				const url = new URL(heroImage, context.site);
				const path = join('public', heroImage);
				const dimensions = sizeOf(path);
				const mimeType = mime.lookup(heroImage);
				feedItem.customData = `<media:content
					type="${mimeType}"
					width="${dimensions.width}"
					height="${dimensions.height}"
					medium="image"
					url="${url}"
				/>`;
				const stat = fs.statSync(path);
				feedItem.enclosure = {
					length: stat.size,
					type: mimeType,
					url: url.toString(),
				};
				feedItem.content = `<img
					src="${url}"
					width="${dimensions.width}"
					height="${dimensions.height}"
				/>`
			}
			return feedItem;
		}),
	});
}
