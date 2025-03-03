import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Layout/Navbar';
import HomePage from './components/Home/HomePage';
import MangaSearch from './components/Manga/MangaSearch';
import MangaDetails from './components/Manga/MangaDetails';
import PopularManga from './components/Manga/PopularManga';
import GenresPage from './components/Genres/GenresPage';
import GenrePage from './components/Genres/GenrePage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <div className="flex flex-col min-h-screen w-full bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <Toaster position="top-right" />
            <Navbar />
            <main className="flex-1 w-full mt-16">
              <div className="min-h-[calc(100vh-4rem)] w-full">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                <Route path="/buscar" element={<MangaSearch />} />
                <Route path="/manga/:id" element={<MangaDetails />} />
                <Route path="/populares" element={<PopularManga />} />
                <Route path="/generos" element={<GenresPage />} />
                <Route path="/generos/:genreId" element={<GenrePage />} />
                </Routes>
              </div>
            </main>
            <footer className="w-full py-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm mt-auto border-t border-gray-200 dark:border-gray-700">
              <div className="max-w-7xl mx-auto px-4 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                  © 2024 Mangá Finder. Todos os direitos reservados.
                  </div>
                  <div className="flex space-x-6">
                    <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                      Sobre
                    </a>
                    <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                      Privacidade
                    </a>
                    <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                      Termos
                    </a>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;