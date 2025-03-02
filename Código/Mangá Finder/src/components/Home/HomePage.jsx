import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch, FaFire, FaTags } from 'react-icons/fa';

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
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Bem-vindo ao MangáFinder
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Explore milhares de mangás, descubra novas séries e encontre suas histórias favoritas.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <Link
          to="/buscar"
          className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          <FaSearch className="text-4xl text-blue-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Buscar Mangás</h2>
          <p className="text-gray-600 text-center">
            Encontre mangás por título, autor ou palavras-chave
          </p>
              </Link>

              <Link
          to="/populares"
          className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          <FaFire className="text-4xl text-orange-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Mangás Populares</h2>
          <p className="text-gray-600 text-center">
            Descubra os mangás mais bem avaliados e populares
          </p>
              </Link>

        <Link
          to="/generos"
          className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          <FaTags className="text-4xl text-green-600 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Explorar por Gênero</h2>
          <p className="text-gray-600 text-center">
            Navegue por mangás organizados por categorias e gêneros
          </p>
        </Link>
            </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Mangás em Destaque</h2>
          <Link
            to="/populares"
            className="text-blue-600 hover:text-blue-700 font-medium"
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
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <Link to={`/manga/${manga.mal_id}`}>
                <img
                  src={manga.images.jpg.large_image_url}
                  alt={manga.title}
                  className="w-full h-64 object-cover"
                />
                  <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {manga.title}
                    </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {manga.synopsis}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Capítulos: {manga.chapters || 'Em andamento'}
                    </span>
                    <span className="text-sm text-gray-500">
                      Nota: {manga.score || 'N/A'}
                        </span>
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