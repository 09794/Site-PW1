import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStar, FaBookOpen, FaFilter } from 'react-icons/fa';

function GenrePage() {
  const { genreId } = useParams();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    orderBy: 'score',
    sort: 'desc',
  });
  const [showFilters, setShowFilters] = useState(false);

  // Busca informações do gênero
  const { data: genreInfo } = useQuery({
    queryKey: ['genreInfo', genreId],
    queryFn: async () => {
      const response = await axios.get('https://api.jikan.moe/v4/genres/manga');
      return response.data.data.find(g => g.mal_id === parseInt(genreId));
    },
    staleTime: 24 * 60 * 60 * 1000,
  });

  // Busca os mangás do gênero
  const { data: mangas, isLoading, error } = useQuery({
    queryKey: ['mangasByGenre', genreId, page, filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        genres: genreId,
        page: page,
        limit: 24,
        order_by: filters.orderBy,
        sort: filters.sort,
        ...(filters.status && { status: filters.status }),
        ...(filters.type && { type: filters.type }),
      });
      const response = await axios.get(`https://api.jikan.moe/v4/manga?${params.toString()}`);
      return response.data;
    },
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-600 dark:text-red-400">
        Ocorreu um erro ao carregar os mangás. Por favor, tente novamente.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          to="/generos"
          className="text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block"
        >
          ← Voltar para Gêneros
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">
          {genreInfo?.name}
          <span className="ml-2 text-xl text-gray-600 dark:text-gray-400">
            ({mangas?.pagination?.items?.total?.toLocaleString()} mangás)
          </span>
        </h1>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 flex items-center gap-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <FaFilter />
          Filtros
        </button>

        {showFilters && (
          <div className="w-full mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
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

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ordem
              </label>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="desc">Maior para menor</option>
                <option value="asc">Menor para maior</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {mangas?.data?.map((manga) => (
          <motion.div
            key={manga.mal_id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
          >
            <Link to={`/manga/${manga.mal_id}`}>
              <div className="relative">
                <img
                  src={manga.images.jpg.large_image_url}
                  alt={manga.title}
                  className="w-full h-56 object-cover"
                  loading="lazy"
                />
                <div className="absolute top-0 right-0 bg-black/60 text-white px-2 py-1 m-2 rounded-lg flex items-center">
                  <FaStar className="text-yellow-400 mr-1" />
                  <span>{manga.score || 'N/A'}</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {manga.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <FaBookOpen className="mr-1" />
                    <span>{manga.chapters || '?'} caps</span>
                  </div>
                  <span>{manga.type}</span>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {mangas?.pagination && mangas.pagination.last_visible_page > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-8">
          <button
            onClick={() => setPage(old => Math.max(old - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <span className="text-gray-600 dark:text-gray-400">
            Página {page} de {mangas.pagination.last_visible_page}
          </span>
          <button
            onClick={() => setPage(old => Math.min(old + 1, mangas.pagination.last_visible_page))}
            disabled={page === mangas.pagination.last_visible_page}
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
}

export default GenrePage; 