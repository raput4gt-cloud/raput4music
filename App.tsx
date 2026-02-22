// =====================================================
// RaPut4 Music - Main App Component
// =====================================================

import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { PlayerProvider } from '@/contexts/PlayerContext';
import { Navbar } from '@/components/Navbar';
import { MusicPlayer } from '@/components/player/MusicPlayer';
import { HomePage } from '@/pages/HomePage';
import { ArtistsPage } from '@/pages/ArtistsPage';
import { ArtistDetailPage } from '@/pages/ArtistDetailPage';
import { PlaylistsPage } from '@/pages/PlaylistsPage';
import { PlaylistDetailPage } from '@/pages/PlaylistDetailPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { UploadPage } from '@/pages/UploadPage';
import { LikedSongsPage } from '@/pages/LikedSongsPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return <>{children}</>;
}

// Main app content with routing
function AppContent() {
  const [currentPage, setCurrentPage] = useState('home');
  const [pageParams, setPageParams] = useState<Record<string, string>>({});
  const { user } = useAuth();

  // Handle navigation
  const navigate = (page: string, params?: Record<string, string>) => {
    setCurrentPage(page);
    setPageParams(params || {});
    window.scrollTo(0, 0);
  };

  // Listen for navigation events from components
  useEffect(() => {
    const handleNavigate = (e: CustomEvent) => {
      const { page, params } = e.detail;
      navigate(page, params);
    };

    window.addEventListener('navigate' as any, handleNavigate);
    return () => window.removeEventListener('navigate' as any, handleNavigate);
  }, []);

  // Make navigate available globally
  useEffect(() => {
    (window as any).navigate = navigate;
  }, []);

  // Render current page
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'artists':
        return <ArtistsPage />;
      case 'artist-detail':
        return <ArtistDetailPage artistId={pageParams.artistId} />;
      case 'playlists':
        return (
          <ProtectedRoute>
            <PlaylistsPage />
          </ProtectedRoute>
        );
      case 'playlist-detail':
        return (
          <ProtectedRoute>
            <PlaylistDetailPage playlistId={pageParams.playlistId} />
          </ProtectedRoute>
        );
      case 'dashboard':
        return (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        );
      case 'upload':
        return (
          <ProtectedRoute>
            <UploadPage />
          </ProtectedRoute>
        );
      case 'liked-songs':
        return (
          <ProtectedRoute>
            <LikedSongsPage />
          </ProtectedRoute>
        );
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar currentPage={currentPage} onNavigate={navigate} />
      
      <main className="flex-1 pb-32">
        {renderPage()}
      </main>
      
      <MusicPlayer />
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: {
            background: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            color: 'hsl(var(--foreground))',
          },
        }}
      />
    </div>
  );
}

// Root App component
function App() {
  return (
    <AuthProvider>
      <PlayerProvider>
        <AppContent />
      </PlayerProvider>
    </AuthProvider>
  );
}

export default App;
