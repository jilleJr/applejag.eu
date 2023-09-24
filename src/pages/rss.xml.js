import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import mime from 'mime-types';
import sizeOf from 'image-size';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';

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
		customData: `<atom:link
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
				const dimensions = sizeOf('public/'+heroImage);
				feedItem.customData = `<media:content
					type="${mime.lookup(heroImage)}"
					width="${dimensions.width}"
					height="${dimensions.height}"
					medium="image"
					url="${context.site + heroImage}"
				/>`;
			}
			return feedItem;
		}),
	});
}
