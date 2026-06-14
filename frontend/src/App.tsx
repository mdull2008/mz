import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Explore from './pages/Explore';
import StoryPage from './pages/StoryPage';
import WritePage from './pages/WritePage';
import ProfilePage from './pages/ProfilePage';
import PostPage from './pages/PostPage';
import Library from './pages/Library';
import AuthPage from './pages/AuthPage';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: { background: '#1a1a2e', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.1)' },
          success: { iconTheme: { primary: '#7c4dff', secondary: '#fff' } },
        }}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/library" element={<Library />} />
        <Route path="/story/:id" element={<StoryPage />} />
        <Route path="/write" element={<WritePage />} />
        <Route path="/write/:id" element={<WritePage />} />
        <Route path="/u/:username" element={<ProfilePage />} />
        <Route path="/post/:id" element={<PostPage />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route path="/notifications" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
