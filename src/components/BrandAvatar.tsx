import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { Campaign } from '@/types';

interface BrandAvatarProps {
  campaign: Pick<Campaign, 'brandName' | 'brandColor'>;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_CLASSES = { sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-12 w-12' };
const TEXT_SIZES = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' };

export function BrandAvatar({ campaign, size = 'md' }: BrandAvatarProps) {
  const initials = campaign.brandName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2);

  return (
    <Avatar className={SIZE_CLASSES[size]}>
      <AvatarFallback
        className={`${TEXT_SIZES[size]} font-bold text-white`}
        style={{ backgroundColor: campaign.brandColor || '#9B6B4A' }}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
