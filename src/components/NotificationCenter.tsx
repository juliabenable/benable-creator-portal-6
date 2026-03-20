import { useState } from 'react';
import { Bell, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { useCreator } from '@/context/CreatorContext';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

function NotificationList({ onSelect }: { onSelect?: () => void }) {
  const { notifications, markNotificationRead, markAllNotificationsRead, unreadCount } = useCreator();
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex items-center justify-between px-3 py-2">
        <p className="text-sm font-semibold">Notifications</p>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" className="text-xs h-7" onClick={markAllNotificationsRead}>
            Mark all read
          </Button>
        )}
      </div>
      <ScrollArea className="max-h-60">
        <div className="space-y-0.5 px-1">
          {notifications.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No notifications</p>
          ) : (
            notifications.map((notif) => (
              <button
                key={notif.id}
                className={cn(
                  'w-full text-left px-3 py-2.5 rounded-lg transition-colors',
                  !notif.read ? 'bg-primary/5' : 'hover:bg-muted'
                )}
                onClick={() => {
                  markNotificationRead(notif.id);
                  if (notif.actionUrl) navigate(notif.actionUrl);
                  onSelect?.();
                }}
              >
                <div className="flex items-start gap-2">
                  {!notif.read && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />}
                  <div className={cn(!notif.read ? '' : 'ml-4')}>
                    <p className="text-sm font-medium">{notif.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{notif.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(notif.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

/**
 * NotificationCenter — two modes:
 * - `inline` (default false): renders as a collapsible section inside a menu
 * - standalone (no inline): renders the old bell icon with sheet/popover
 */
export function NotificationCenter({ inline }: { inline?: boolean }) {
  const { unreadCount } = useCreator();
  const [open, setOpen] = useState(false);

  if (inline) {
    return (
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-muted transition-colors text-left">
            <div className="relative">
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            <span className="flex-1">Notifications</span>
            {unreadCount > 0 && (
              <span className="text-xs text-primary font-medium">{unreadCount} new</span>
            )}
            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <NotificationList />
        </CollapsibleContent>
      </Collapsible>
    );
  }

  // Standalone bell button (fallback, not currently used)
  return (
    <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
      <Bell className="w-5 h-5" />
      {unreadCount > 0 && (
        <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
}
