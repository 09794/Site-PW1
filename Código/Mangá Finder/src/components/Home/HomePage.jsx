import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch, FaFire, FaTags, FaHome, FaStar, FaBookOpen } from 'react-icons/fa';

function HomePage() {
  const { data: topManga } = useQuery({
    queryKey: ['topMangaPreview'],
    queryFn: async () => {
      const response = await axios.get('https://api.jikan.moe/v4/top/manga?limit=4');
      return response.data;
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Bem-vindo ao MangáFinder
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Explore milhares de mangás, descubra novas séries e encontre suas histórias favoritas.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <Link
          to="/buscar"
          className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          <FaSearch className="text-4xl text-blue-600 dark:text-blue-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2 dark:text-white">Buscar Mangás</h2>
          <p className="text-gray-600 dark:text-gray-300 text-center">
            Encontre mangás por título, autor ou palavras-chave
          </p>
        </Link>

        <Link
          to="/populares"
          className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          <FaFire className="text-4xl text-orange-600 dark:text-orange-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2 dark:text-white">Mangás Populares</h2>
          <p className="text-gray-600 dark:text-gray-300 text-center">
            Descubra os mangás mais bem avaliados e populares
          </p>
        </Link>

        <Link
          to="/generos"
          className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          <FaTags className="text-4xl text-green-600 dark:text-green-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2 dark:text-white">Explorar por Gênero</h2>
          <p className="text-gray-600 dark:text-gray-300 text-center">
            Navegue por mangás organizados por categorias e gêneros
          </p>
        </Link>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Mangás em Destaque</h2>
          <Link
            to="/populares"
            className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
          >
            Ver todos
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {topManga?.data?.map((manga, index) => (
            <motion.div
              key={manga.mal_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <Link to={`/manga/${manga.mal_id}`}>
                <div className="relative">
                  <img
                    src={manga.images.jpg.large_image_url}
                    alt={manga.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-0 right-0 bg-black/60 text-white px-2 py-1 m-2 rounded-lg flex items-center">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span>{manga.score?.toFixed(2) || 'N/A'}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
                    {manga.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">
                    {manga.synopsis || 'Sem sinopse disponível.'}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <FaBookOpen className="mr-1" />
                      <span>{manga.chapters ? `${manga.chapters} caps` : 'Em andamento'}</span>
                    </div>
                    <span>{manga.type}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage; 