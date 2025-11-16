import { Button } from '@/components/ui/button';
import { Facebook, Linkedin, MessageCircle } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  url: string;
}

const ShareButtons = ({ title, url }: ShareButtonsProps) => {
  const shareOnWhatsApp = () => {
    const text = encodeURIComponent(`Confira este artigo: ${title}`);
    const shareUrl = encodeURIComponent(url);
    window.open(`https://wa.me/?text=${text}%20${shareUrl}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    const shareUrl = encodeURIComponent(url);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`, '_blank');
  };

  const shareOnFacebook = () => {
    const shareUrl = encodeURIComponent(url);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank');
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-6 border-y border-border">
      <span className="text-sm font-semibold text-muted-foreground">
        Compartilhe este artigo:
      </span>
      <div className="flex gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={shareOnWhatsApp}
          className="gap-2 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={shareOnLinkedIn}
          className="gap-2 hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] transition-colors"
        >
          <Linkedin className="w-4 h-4" />
          LinkedIn
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={shareOnFacebook}
          className="gap-2 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-colors"
        >
          <Facebook className="w-4 h-4" />
          Facebook
        </Button>
      </div>
    </div>
  );
};

export default ShareButtons;
