import { FastifyPluginAsync } from "fastify"
import { readdir, readFile } from 'fs/promises';

const images: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  fastify.get('/', async function (request, reply) {
    const imgsPath = `${process.cwd()}/images`;
    const imgDirs = await readdir(imgsPath);
    const imgUrls = imgDirs.map((dir) => `${request.protocol}://${request.hostname}/images/${dir}`);
    const data = shuffleArray(imgUrls);
    console.log(data);
    reply.send(data);
  });

  interface imgRequest {
    imgName: string
  }

  fastify.get('/:imgName', async function (request, reply) {
    const { imgName } = request.params as imgRequest;
    const imgPath = `${process.cwd()}/images/${imgName}`;
    const img = await readFile(imgPath);
    reply.type('image/png').send(img);
  });
}

export default images;
