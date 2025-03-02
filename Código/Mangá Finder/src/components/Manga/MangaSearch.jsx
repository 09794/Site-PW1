import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';

function MangaSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['searchManga', debouncedTerm],
    queryFn: async () => {
      if (!debouncedTerm) return null;
      const response = await axios.get(`https://api.jikan.moe/v4/manga?q=${debouncedTerm}`);
      return response.data;
    },
    enabled: !!debouncedTerm,
  });

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setTimeout(() => {
      setDebouncedTerm(value);
    }, 500);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Buscar mangás..."
            className="w-full px-4 py-2 pl-10 pr-4 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {isLoading && (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      )}

      {error && (
        <div className="text-center text-red-600">
          Ocorreu um erro ao buscar os mangás. Por favor, tente novamente.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data?.data?.map((manga) => (
          <motion.div
            key={manga.mal_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <Link to={`/manga/${manga.mal_id}`}>
              <img
                src={manga.images.jpg.image_url}
                alt={manga.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{manga.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-3">{manga.synopsis}</p>
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

      {data?.data?.length === 0 && debouncedTerm && (
        <div className="text-center text-gray-600 mt-8">
          Nenhum mangá encontrado para sua busca.
        </div>
      )}
    </div>
  );
}

export default MangaSearch; 