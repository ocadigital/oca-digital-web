import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, Headphones, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const PostEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image: '',
    audio_url: '',
    author: '',
    category: '',
    tags: '',
    read_time: '5 min',
    featured: false,
    published: false,
  });

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setFormData({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        image: data.image || '',
        audio_url: data.audio_url || '',
        author: data.author,
        category: data.category,
        tags: data.tags?.join(', ') || '',
        read_time: data.read_time,
        featured: data.featured,
        published: data.published,
      });
    } catch (error: any) {
      toast.error('Erro ao carregar post: ' + error.message);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('audio/')) {
      toast.error('Escolha um arquivo de áudio (MP3, M4A, WAV ou OGG).');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      toast.error('O arquivo passa de 50 MB. Comprima o áudio e tente de novo.');
      return;
    }
    setUploadingAudio(true);
    try {
      const ext = (file.name.split('.').pop() || 'mp3').toLowerCase().replace(/[^a-z0-9]/g, '');
      const base = (formData.slug || 'post').replace(/[^a-z0-9-]/g, '');
      const path = `${base}-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from('blog-audio').upload(path, file, {
        contentType: file.type,
        cacheControl: '31536000',
      });
      if (error) throw error;
      const { data } = supabase.storage.from('blog-audio').getPublicUrl(path);
      setFormData((prev) => ({ ...prev, audio_url: data.publicUrl }));
      toast.success('Áudio enviado. Clique em salvar para publicar no post.');
    } catch (error) {
      toast.error('Erro ao enviar o áudio: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setUploadingAudio(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const postData = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        image: formData.image || null,
        audio_url: formData.audio_url.trim() || null,
        author: formData.author,
        category: formData.category,
        tags: tagsArray,
        read_time: formData.read_time,
        featured: formData.featured,
        published: formData.published,
        published_at: formData.published ? new Date().toISOString() : null,
      };

      if (id) {
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', id);

        if (error) throw error;
        toast.success('Post atualizado com sucesso!');
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .insert([postData]);

        if (error) throw error;
        toast.success('Post criado com sucesso!');
      }

      navigate('/admin/posts');
    } catch (error: any) {
      toast.error('Erro ao salvar post: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/admin/posts" className="inline-flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para lista
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="p-8">
          <h1 className="text-3xl font-bold text-foreground mb-8">
            {id ? 'Editar Post' : 'Novo Post'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                placeholder="Digite o título do post"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
                placeholder="slug-do-post"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="excerpt">Resumo *</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                required
                placeholder="Breve resumo do post"
                rows={3}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="content">Conteúdo * (HTML)</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                placeholder="<p>Conteúdo do post em HTML...</p>"
                rows={15}
                className="mt-1 font-mono text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="author">Autor *</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  required
                  placeholder="Nome do autor"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="category">Categoria *</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  placeholder="Marketing Digital"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="seo, marketing, imobiliário"
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="image">URL da Imagem</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="read_time">Tempo de Leitura</Label>
                <Input
                  id="read_time"
                  value={formData.read_time}
                  onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
                  placeholder="5 min"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="rounded-lg border border-border p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Headphones className="h-4 w-4 text-primary" />
                <Label htmlFor="audio_url" className="m-0">Áudio do post (opcional)</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Se houver um áudio, o player aparece no topo do post. Sem áudio, nada é exibido.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <input
                  id="audio_file"
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioUpload}
                  disabled={uploadingAudio}
                  className="text-sm"
                />
                {uploadingAudio && <span className="text-sm text-muted-foreground">Enviando...</span>}
              </div>
              <Input
                id="audio_url"
                value={formData.audio_url}
                onChange={(e) => setFormData({ ...formData, audio_url: e.target.value })}
                placeholder="ou cole aqui o link (https://...) de um arquivo de áudio"
              />
              {formData.audio_url && (
                <div className="space-y-2">
                  <audio controls preload="none" src={formData.audio_url} className="w-full" />
                  <Button type="button" variant="outline" size="sm" onClick={() => setFormData({ ...formData, audio_url: '' })}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remover áudio do post
                  </Button>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">Post em destaque</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">Publicar post</span>
              </label>
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {loading ? 'Salvando...' : (id ? 'Atualizar Post' : 'Criar Post')}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/posts')}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default PostEditor;
