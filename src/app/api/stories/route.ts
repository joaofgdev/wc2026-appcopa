import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

export const revalidate = 3600; // Cache por 1 hora para evitar bater no limite do feed RSS

export async function GET() {
  const parser = new Parser({
    customFields: {
      item: [
        ['media:group', 'mediaGroup'],
        ['media:content', 'mediaContent'],
      ]
    }
  });

  const storiesGroups = [];

  // 1. Grupo: Contagem Regressiva
  storiesGroups.push({
    id: 'countdown',
    title: 'Copa 2026',
    thumbnail: '/logo/icon.svg',
    stories: [
      {
        id: 'countdown-1',
        type: 'countdown',
        duration: 8000,
        targetDate: '2026-06-11T00:00:00Z'
      }
    ]
  });

  // 2. Grupo: CazéTV (Vídeos Automáticos do YouTube)
  try {
    // Channel ID da CazéTV
    const cazeTVFeed = await parser.parseURL('https://www.youtube.com/feeds/videos.xml?channel_id=UCZiYbVptd3PVPf4f6eR6UaQ');
    
    // Pegar os últimos 3 vídeos
    const videoStories = cazeTVFeed.items.slice(0, 3).map((item, index) => {
      // Extrair o ID do vídeo do link (ex: https://www.youtube.com/watch?v=dQw4w9WgXcQ)
      const videoId = item.link?.split('v=')[1] || (item as any).id?.split(':').pop();
      
      return {
        id: `cazetv-${index}`,
        type: 'video',
        title: item.title,
        url: videoId ? `https://www.youtube.com/watch?v=${videoId}` : '',
        imageUrl: videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '',
        duration: 15000, // Dá 15 segundos para o usuário ver um pedaço do vídeo/short
        publishedAt: item.pubDate
      };
    });

    if (videoStories.length > 0) {
      storiesGroups.push({
        id: 'cazetv',
        title: 'CazéTV',
        thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Logotipo_da_Caz%C3%A9TV.png', // Logo CazéTV
        stories: videoStories
      });
    }
  } catch (err) {
    console.error('Erro ao buscar feed da CazéTV:', err);
  }

  // 3. Grupo: Notícias GE Globo
  try {
    const geFeed = await parser.parseURL('https://ge.globo.com/rss/futebol/');
    
    const newsStories = geFeed.items.slice(0, 5).map((item, index) => {
      // O rss-parser do GE geralmente manda imagens no content/enclosure
      let imageUrl = null;
      
      // Tentativa 1: enclosure
      if (item.enclosure && item.enclosure.url && item.enclosure.type?.startsWith('image/')) {
        imageUrl = item.enclosure.url;
      } 
      // Tentativa 2: media:content
      else if (item.mediaContent && item.mediaContent['$'] && item.mediaContent['$'].url) {
        imageUrl = item.mediaContent['$'].url;
      }
      // Tentativa 3: Regex no content
      else if (item.content) {
        const imgMatch = item.content.match(/src="([^"]+)"/);
        if (imgMatch) imageUrl = imgMatch[1];
      }

      return {
        id: `news-${index}`,
        type: 'news',
        title: item.title,
        description: item.contentSnippet,
        url: item.link,
        imageUrl: imageUrl, // Se for null, o front-end renderiza o fallback degradê
        duration: 8000,
        publishedAt: item.pubDate
      };
    });

    if (newsStories.length > 0) {
      storiesGroups.push({
        id: 'news',
        title: 'Notícias GE',
        thumbnail: 'https://s2-ge.glbimg.com/O6X7zYyZ4k71L7Y7V-fM-Tz3uYc=/fit-in/256x256/filters:fill(transparent)/https://s2.glbimg.com/qA1m0pQ-O2V1z7U-92718Y-T500=/0x0:1024x1024/924x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_bc8228b6673f488aa253bbcb03c80ec5/internal_photos/bs/2020/g/A/8JbBf4T1qX9b2B2T5yJw/ge-logo.png', // Logo GE
        stories: newsStories
      });
    }
  } catch (err) {
    console.error('Erro ao buscar feed do GE:', err);
  }

  return NextResponse.json({ groups: storiesGroups });
}
