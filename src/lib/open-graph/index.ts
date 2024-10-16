import prisma from '$lib/prisma';

interface OpenGraphData {
  title: string;
  image: string;
  description: string;
}

const parseOpenGraphTags = (html: string): OpenGraphData => {
  const properties = ['title', 'image', 'description'];
  const ogTags = html.match(/<meta[^>]+property="og:([^"]+)"[^>]+content="([^"]+)"[^>]*>/g);

  // Create object to store Open Graph data from properties
  const ogData: OpenGraphData = { title: '', image: '', description: '' };

  if (ogTags) {
    ogTags.forEach((tag) => {
      const matches = tag.match(/<meta[^>]+property="og:([^"]+)"[^>]+content="([^"]+)"[^>]*>/);

      if (matches && matches.length === 3) {
        const [, property, content] = matches;

        // if property is title, image or description
        if (!properties.includes(property)) {
          return;
        }
        ogData[property as keyof OpenGraphData] = content;
      }
    });
  }
  return ogData;
};

async function getOpenGraphData(url: string): Promise<OpenGraphData> {
  let html: string = '';

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'OpenGraph',
        'Cache-Control': 'no-cache',
        Accept: '*/*'
      }
    });
    html = await response.text();
  } catch (error) {
    console.error(error);
    throw new Error('Failed to fetch Open Graph data');
  }

  return parseOpenGraphTags(html);
}

getOpenGraphData('https://syntax.fm/');

export const populateLearningResourceOpenGraphData = async () => {
  const learning_resources = await prisma.learningResources.findMany({
    select: { id: true, url: true }
  });

  for (const resource of learning_resources) {
    const ogData = await getOpenGraphData(resource.url);

    if (ogData.description) {
      await prisma.learningResources.update({
        where: { id: resource.id },
        data: { description: ogData.description }
      });
    }

    if (ogData.image) {
      await prisma.learningResources.update({
        where: { id: resource.id },
        data: { imageUrl: ogData.image }
      });
    }
  }
};

populateLearningResourceOpenGraphData();
