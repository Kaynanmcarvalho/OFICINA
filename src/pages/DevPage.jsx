import React, { useState, useEffect } from 'react';
import { 
  GitBranch, 
  GitCommit, 
  User, 
  Calendar, 
  FileCode, 
  Plus, 
  Minus,
  RefreshCw,
  Terminal,
  Code,
  FolderGit2
} from 'lucide-react';
import toast from 'react-hot-toast';

const DevPage = () => {
  const [commits, setCommits] = useState([]);
  const [fileChanges, setFileChanges] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCommit, setSelectedCommit] = useState(null);

  useEffect(() => {
    loadGitInfo();
  }, []);

  const loadGitInfo = async () => {
    setIsLoading(true);
    try {
      // Buscar commits do Git
      await fetchCommits();
      await fetchFileChanges();
    } catch (error) {
      console.error('Erro ao carregar informações do Git:', error);
      toast.error('Erro ao carregar informações do Git');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCommits = async () => {
    try {
      // Executar comando git log
      const response = await fetch('/api/git/commits');
      if (response.ok) {
        const data = await response.json();
        setCommits(data);
      } else {
        // Dados mock para demonstração
        setCommits([
          {
            hash: 'a1b2c3d',
            author: 'Você',
            email: 'dev@example.com',
            date: new Date().toISOString(),
            message: 'feat: Implementado sistema de relatórios com abas',
            files: ['src/pages/ReportsPage.jsx'],
            additions: 150,
            deletions: 20
          },
          {
            hash: 'e4f5g6h',
            author: 'Outro Dev',
            email: 'outro@example.com',
            date: new Date(Date.now() - 86400000).toISOString(),
            message: 'fix: Corrigido autocomplete em check-in details',
            files: ['src/pages/CheckInDetailsPage.jsx'],
            additions: 80,
            deletions: 15
          },
          {
            hash: 'i7j8k9l',
            author: 'Você',
            email: 'dev@example.com',
            date: new Date(Date.now() - 172800000).toISOString(),
            message: 'feat: Adicionado upload de foto de perfil',
            files: ['src/pages/ProfilePage.jsx', 'src/config/firebase.js'],
            additions: 120,
            deletions: 10
          },
          {
            hash: 'm0n1o2p',
            author: 'Outro Dev',
            email: 'outro@example.com',
            date: new Date(Date.now() - 259200000).toISOString(),
            message: 'refactor: Melhorado sistema de check-out',
            files: ['src/pages/CheckInPage.jsx', 'src/components/forms/CheckOutForm.jsx'],
            additions: 95,
            deletions: 45
          },
          {
            hash: 'q3r4s5t',
            author: 'Você',
            email: 'dev@example.com',
            date: new Date(Date.now() - 345600000).toISOString(),
            message: 'feat: Criado sistema de inventário com busca',
            files: ['src/pages/InventoryPage.jsx', 'src/store/inventoryStore.jsx'],
            additions: 200,
            deletions: 30
          }
        ]);
      }
    } catch (error) {
      console.error('Erro ao buscar commits:', error);
    }
  };

  const fetchFileChanges = async () => {
    try {
      // Buscar mudanças nos arquivos
      const response = await fetch('/api/git/status');
      if (response.ok) {
        const data = await response.json();
        setFileChanges(data);
      } else {
        // Dados mock
        setFileChanges([
          { file: 'src/pages/ReportsPage.jsx', status: 'modified', additions: 50, deletions: 10 },
          { file: 'src/pages/DevPage.jsx', status: 'new', additions: 300, deletions: 0 },
          { file: 'src/App.jsx', status: 'modified', additions: 5, deletions: 2 }
        ]);
      }
    } catch (error) {
      console.error('Erro ao buscar mudanças:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'modified':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'deleted':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'new':
        return 'Novo';
      case 'modified':
        return 'Modificado';
      case 'deleted':
        return 'Deletado';
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
  );
}

return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Terminal className="w-8 h-8 text-blue-600" />
            Painel de Desenvolvimento
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Histórico de commits e mudanças no código
          </p>
        </div>
        <button
          onClick={loadGitInfo}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Atualizar
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Total de Commits</h3>
            <GitCommit className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-3xl font-bold">{commits.length}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Linhas Adicionadas</h3>
            <Plus className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-3xl font-bold">
            {commits.reduce((sum, c) => sum + c.additions, 0)}
          </p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Linhas Removidas</h3>
            <Minus className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-3xl font-bold">
            {commits.reduce((sum, c) => sum + c.deletions, 0)}
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg text-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">Arquivos Modificados</h3>
            <FileCode className="w-8 h-8 opacity-80" />
          </div>
          <p className="text-3xl font-bold">{fileChanges.length}</p>
        </div>
      </div>

      {/* Mudanças Pendentes */}
      {fileChanges.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <FolderGit2 className="w-6 h-6 text-yellow-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Mudanças Pendentes (Não Commitadas)
            </h2>
          </div>

          <div className="space-y-3">
            {fileChanges.map((change, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Code className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {change.file}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-green-600 dark:text-green-400">
                        +{change.additions}
                      </span>
                      <span className="text-xs text-red-600 dark:text-red-400">
                        -{change.deletions}
                      </span>
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(change.status)}`}>
                  {getStatusLabel(change.status)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Histórico de Commits */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <GitBranch className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Histórico de Commits
          </h2>
        </div>

        <div className="space-y-4">
          {commits.map((commit) => (
            <div
              key={commit.hash}
              onClick={() => setSelectedCommit(selectedCommit === commit.hash ? null : commit.hash)}
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-1 text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                      {commit.hash}
                    </span>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <User className="w-4 h-4" />
                      <span>{commit.author}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(commit.date).toLocaleString('pt-BR')}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-900 dark:text-white font-medium mb-2">
                    {commit.message}
                  </p>

                  {selectedCommit === commit.hash && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Arquivos modificados:
                      </p>
                      <div className="space-y-2">
                        {commit.files.map((file, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 pl-4"
                          >
                            <FileCode className="w-4 h-4" />
                            <span className="font-mono">{file}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 ml-4">
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                      <Plus className="w-4 h-4" />
                      <span>{commit.additions}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                      <Minus className="w-4 h-4" />
                      <span>{commit.deletions}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Informações Adicionais */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Terminal className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-1">
              Nota sobre Integração Git
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Esta página mostra dados mock para demonstração. Para integração real com Git, 
              você precisará criar uma API backend que execute comandos Git (git log, git status, git diff) 
              e retorne os dados em JSON. Alternativamente, pode usar GitHub API ou GitLab API 
              para buscar informações do repositório remoto.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DevPage;
