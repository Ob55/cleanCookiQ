import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, Loader2, AlertCircle, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function NotificationBell() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [detailNotification, setDetailNotification] = useState<any | null>(null);

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);
      return data ?? [];
    },
    enabled: !!user,
    refetchInterval: 15000,
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markRead = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("notifications").update({ read: true }).eq("id", id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] }),
  });

  const markAllRead = useMutation({
    mutationFn: async () => {
      if (!user) return;
      await supabase.from("notifications").update({ read: true }).eq("user_id", user.id).eq("read", false);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications", user?.id] }),
  });

  const handleNotificationClick = (n: any) => {
    if (!n.read) markRead.mutate(n.id);
    setDetailNotification(n);
    setOpen(false);
  };

  // Parse missing fields from the notification body
  const parseMissingFields = (body: string): string[] => {
    const match = body.match(/following missing details:\s*(.+?)\.\s*Complete/);
    if (match) {
      return match[1].split(",").map(f => f.trim()).filter(Boolean);
    }
    return [];
  };

  const isProfileRequest = detailNotification?.title === "Please Complete Your Profile";
  const missingFields = isProfileRequest ? parseMissingFields(detailNotification.body) : [];

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-accent text-[10px] font-bold flex items-center justify-center text-accent-foreground">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80 p-0">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                disabled={markAllRead.isPending}
                onClick={() => markAllRead.mutate()}
              >
                Mark all read
              </Button>
            )}
          </div>
          <ScrollArea className="max-h-80">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : notifications.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No notifications yet</p>
            ) : (
              <div className="divide-y divide-border">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    className={`px-4 py-3 text-sm cursor-pointer hover:bg-muted/50 transition-colors ${!n.read ? "bg-accent/5" : ""}`}
                    onClick={() => handleNotificationClick(n)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className={`font-medium text-xs ${!n.read ? "text-foreground" : "text-muted-foreground"}`}>
                        {n.title}
                      </p>
                      {!n.read && <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" />}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{n.body}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1.5">
                      {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </PopoverContent>
      </Popover>

      {/* Notification Detail Dialog */}
      <Dialog open={!!detailNotification} onOpenChange={(v) => { if (!v) setDetailNotification(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {isProfileRequest && <AlertCircle className="h-5 w-5 text-primary" />}
              {detailNotification?.title}
            </DialogTitle>
            {detailNotification && (
              <DialogDescription className="text-xs">
                {formatDistanceToNow(new Date(detailNotification.created_at), { addSuffix: true })}
              </DialogDescription>
            )}
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{detailNotification?.body}</p>

            {isProfileRequest && missingFields.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-semibold">Details requested:</p>
                <div className="space-y-1.5">
                  {missingFields.map(field => (
                    <div key={field} className="flex items-center gap-2 py-2 px-3 rounded-lg bg-destructive/5 border border-destructive/10">
                      <AlertCircle className="h-3.5 w-3.5 text-destructive shrink-0" />
                      <span className="text-sm">{field}</span>
                    </div>
                  ))}
                </div>
                <Button
                  className="w-full mt-3 gap-2"
                  onClick={() => {
                    setDetailNotification(null);
                    navigate("/institution/profile");
                  }}
                >
                  Go to My Profile to Update
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
