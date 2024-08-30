import type { Core } from '@strapi/strapi';
import { YoutubeTranscript } from 'youtube-transcript';

function transformData(data: any) {
  let text = '';

  data.forEach((item: any) => {
    text += item.text + ' ';
  });

  return {
    data: data,
    text: text.trim(),
  };
}

async function getTranscript(id: string) {
  const response = await YoutubeTranscript.fetchTranscript(id);
  return response;
}

const service = ({ strapi }: { strapi: Core.Strapi }) => ({
  
  async getYoutubeTranscript(videoId: string) {
    const youtubeIdRegex = /^[a-zA-Z0-9_-]{11}$/;
    const isValid = youtubeIdRegex.test(videoId);

    if (!isValid) return { error: 'Invalid video ID', data: null };

    try {
      const data = await getTranscript(videoId);
      const transformedData = transformData(data);
      return transformedData.text;
    } catch (error) {
      return { error: 'Error fetching transcript', data: null };
    }

  },
});

export default service;
