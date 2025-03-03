import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaSearch, FaStar, FaFilter, FaBookOpen } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

function MangaSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    orderBy: 'score',
    sort: 'desc',
    minScore: '',
    genres: [],
  });
  const [showFilters, setShowFilters] = useState(false);

  // Busca os gêneros disponíveis
  const { data: genresData } = useQuery({
    queryKey: ['mangaGenres'],
    queryFn: async () => {
      const response = await axios.get('https://api.jikan.moe/v4/genres/manga');
      return response.data.data;
    },
    staleTime: 24 * 60 * 60 * 1000,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['searchManga', debouncedTerm, filters],
    queryFn: async () => {
      if (!debouncedTerm && !filters.status && !filters.type && !filters.minScore && filters.genres.length === 0) return null;
      
      const params = new URLSearchParams({
        q: debouncedTerm,
        order_by: filters.orderBy,
        sort: filters.sort,
        ...(filters.status && { status: filters.status }),
        ...(filters.type && { type: filters.type }),
        ...(filters.minScore && { min_score: filters.minScore }),
        ...(filters.genres.length > 0 && { genres: filters.genres.join(',') }),
      });

      const response = await axios.get(`https://api.jikan.moe/v4/manga?${params.toString()}`);
      return response.data;
    },
    enabled: !!(debouncedTerm || filters.status || filters.type || filters.minScore || filters.genres.length > 0),
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleGenreToggle = (genreId) => {
    setFilters(prev => ({
      ...prev,
      genres: prev.genres.includes(genreId)
        ? prev.genres.filter(id => id !== genreId)
        : [...prev.genres, genreId]
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar mangás..."
              className="w-full px-4 py-2 pl-10 pr-4 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <FaFilter />
            Filtros {filters.genres.length > 0 && `(${filters.genres.length})`}
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg mb-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="">Todos</option>
                    <option value="publishing">Em publicação</option>
                    <option value="complete">Completo</option>
                    <option value="hiatus">Em hiato</option>
                    <option value="discontinued">Descontinuado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tipo
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                    className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="">Todos</option>
                    <option value="manga">Mangá</option>
                    <option value="novel">Novel</option>
                    <option value="oneshot">One Shot</option>
                    <option value="doujin">Doujin</option>
                    <option value="manhwa">Manhwa</option>
                    <option value="manhua">Manhua</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Nota Mínima
                  </label>
                  <select
                    value={filters.minScore}
                    onChange={(e) => handleFilterChange('minScore', e.target.value)}
                    className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="">Qualquer</option>
                    <option value="9">9+ ⭐⭐⭐⭐⭐</option>
                    <option value="8">8+ ⭐⭐⭐⭐</option>
                    <option value="7">7+ ⭐⭐⭐</option>
                    <option value="6">6+ ⭐⭐</option>
                    <option value="5">5+ ⭐</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Ordenar por
                  </label>
                  <select
                    value={filters.orderBy}
                    onChange={(e) => handleFilterChange('orderBy', e.target.value)}
                    className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="score">Nota</option>
                    <option value="title">Título</option>
                    <option value="popularity">Popularidade</option>
                    <option value="favorites">Favoritos</option>
                  </select>
                </div>

                <div className="col-span-full">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Gêneros
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {genresData?.map((genre) => (
                      <button
                        key={genre.mal_id}
                        onClick={() => handleGenreToggle(genre.mal_id)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          filters.genres.includes(genre.mal_id)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {genre.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="col-span-full flex justify-end">
                  <button
                    onClick={() => setFilters({
                      status: '',
                      type: '',
                      orderBy: 'score',
                      sort: 'desc',
                      minScore: '',
                      genres: [],
                    })}
                    className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    Limpar filtros
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
        </div>
      )}

      {error && (
        <div className="text-center text-red-600 dark:text-red-400 py-8">
          Ocorreu um erro ao buscar os mangás. Por favor, tente novamente.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data?.data?.map((manga) => (
          <motion.div
            key={manga.mal_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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
                  <span>{manga.score || 'N/A'}</span>
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

      {data?.data?.length === 0 && (debouncedTerm || Object.values(filters).some(v => Array.isArray(v) ? v.length > 0 : v)) && (
        <div className="text-center text-gray-600 dark:text-gray-400 mt-8 p-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <p className="text-lg mb-2">Nenhum mangá encontrado</p>
          <p className="text-sm">Tente ajustar seus filtros ou usar termos diferentes na busca.</p>
        </div>
      )}
    </div>
  );
}

export default MangaSearch; 