import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Mail, MapPin } from 'lucide-react';
import { useCreator } from '@/context/CreatorContext';

export default function ProfilePage() {
  const { creatorName, creatorStatus } = useCreator();

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
      <h1 className="text-xl font-bold">Profile</h1>

      <Card>
        <CardContent className="py-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">{creatorName || 'Creator'}</h2>
              <Badge
                variant="secondary"
                className={
                  creatorStatus === 'accepted'
                    ? 'bg-primary/10 text-primary'
                    : creatorStatus === 'pending'
                    ? 'bg-amber-100 text-amber-700'
                    : ''
                }
              >
                {creatorStatus === 'accepted'
                  ? 'Active Creator'
                  : creatorStatus === 'pending'
                  ? 'Pending Review'
                  : 'Not Applied'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="py-4 space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Account Details
          </p>
          <div className="flex items-center gap-3 text-sm">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span>creator@example.com</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span>Shipping address on file</span>
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-center text-muted-foreground pt-4">
        This is a prototype. Profile editing will be available in the full version.
      </p>
    </div>
  );
}
