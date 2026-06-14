import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import PostCard from '../components/post/PostCard';
import ComposePost from '../components/post/ComposePost';
import api from '../lib/api';
import { useAuthStore } from '../store/authStore';

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const [data, setData] = useState<{ replies?: unknown[] } & Parameters<typeof PostCard>[0]['post'] | null>(null);

  useEffect(() => { load(); }, [id]);

  const load = async () => {
    try {
      const { data: d } = await api.get(`/posts/${id}`);
      setData(d);
    } catch {}
  };

  const handleReply = (post: unknown) => {
    setData(prev => prev ? { ...prev, replies: [...(prev.replies || []), post] } : prev);
  };

  if (!data) return (
    <Layout>
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div className="sticky top-0 bg-surface-950/90 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center gap-3">
        <Link to="/" className="text-gray-400 hover:text-gray-200">←</Link>
        <h1 className="font-bold text-gray-100">Пост</h1>
      </div>
      <PostCard post={data} />
      {user && <ComposePost onPost={handleReply} placeholder="Написать ответ..." replyTo={id} />}
      <div className="border-t border-white/5">
        {(data.replies as Parameters<typeof PostCard>[0]['post'][] | undefined)?.map(r => (
          <PostCard key={r.id} post={r} />
        ))}
        {(!data.replies || data.replies.length === 0) && (
          <div className="text-center py-10 text-gray-600 text-sm">Нет ответов</div>
        )}
      </div>
    </Layout>
  );
}
