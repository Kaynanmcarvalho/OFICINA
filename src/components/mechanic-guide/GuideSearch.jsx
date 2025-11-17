/**
 * Guide Search Component
 * Componente de busca e filtros para guias técnicos
 * 
 * @author Torq AI Team
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';
import { Search, Filter, X, Book, Clock, TrendingUp } from 'lucide-react';
import mechanicGuideService from '../../services/mechanicGuideService';
import GuideCard from './GuideCard';

const GuideSearch = ({ empresaId, onSelectGuide }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [guides, setGuides] = useState([]);
  const [filteredGuides, setFilteredGuides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    tags: [],
    orderBy: 'views',
    orderDirection: 'desc'
  });

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    loadInitialData();
  }, [empresaId]);

  useEffect(() => {
    searchGuides();
  }, [searchQuery, filters]);

  const loadInitialData = async () => {
    try {
      const [cats, tgs, popular] = await Promise.all([
        mechanicGuideService.getCategories(empresaId),
        mechanicGuideService.getTags(empresaId),
        mechanicGuideService.getPopularGuides(empresaId, 20)
      ]);
      
      setCategories(cats);
      setTags(tgs);
      setGuides(popular);
      setFilteredGuides(popular);
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const searchGuides = async () => {
    setLoading(true);
    try {
      const results = await mechanicGuideService.searchGuides(searchQuery, {
        empresaId,
        ...filters,
        limit: 50
      });
      setFilteredGuides(results);
    } catch (error) {
      console.error('Error searching guides:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleTagToggle = (tag) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      difficulty: '',
      tags: [],
      orderBy: 'views',
      orderDirection: 'desc'
    });
    setSearchQuery('');
  };

  const hasActiveFilters = 
    filters.category || 
    filters.difficulty || 
    filters.tags.length > 0 || 
    searchQuery;

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar guias técnicos..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
              showFilters || hasActiveFilters
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <Filter className="w-5 h-5" />
            <span>Filtros</span>
            {hasActiveFilters && (
              <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                {[filters.category, filters.difficulty, ...filters.tags].filter(Boolean).length}
              </span>
            )}
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Categoria
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todas</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Dificuldade
                </label>
                <select
                  value={filters.difficulty}
                  onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Todas</option>
                  <option value="facil">Fácil</option>
                  <option value="medio">Médio</option>
                  <option value="dificil">Difícil</option>
                </select>
              </div>

              {/* Sort Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ordenar por
                </label>
                <select
                  value={filters.orderBy}
                  onChange={(e) => handleFilterChange('orderBy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="views">Mais visualizados</option>
                  <option value="likes">Mais curtidos</option>
                  <option value="createdAt">Mais recentes</option>
                  <option value="title">Nome (A-Z)</option>
                </select>
              </div>
            </div>

            {/* Tags Filter */}
            {tags.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {tags.slice(0, 15).map(tag => (
                    <button
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        filters.tags.includes(tag)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Clear Filters */}
            {hasActiveFilters && (
              <div className="flex justify-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Limpar filtros</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {loading ? 'Buscando...' : `${filteredGuides.length} guia(s) encontrado(s)`}
          </h2>
          
          {filteredGuides.length > 0 && (
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <TrendingUp className="w-4 h-4" />
              <span>Ordenado por: {
                filters.orderBy === 'views' ? 'Visualizações' :
                filters.orderBy === 'likes' ? 'Curtidas' :
                filters.orderBy === 'createdAt' ? 'Data' : 'Nome'
              }</span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : filteredGuides.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map(guide => (
              <GuideCard
                key={guide.id}
                guide={guide}
                onClick={() => onSelectGuide(guide.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Book className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Nenhum guia encontrado
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Tente ajustar os filtros ou buscar por outros termos
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Limpar filtros
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GuideSearch;
