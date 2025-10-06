import { useState } from "react";
import { Bell, Target, Lightbulb, Building2, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface Notification {
  id: string;
  type: "goal" | "insight" | "account" | "family";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const NOTIFICATION_CONFIG = {
  goal: {
    icon: Target,
    color: "text-chart-3",
  },
  insight: {
    icon: Lightbulb,
    color: "text-chart-1",
  },
  account: {
    icon: Building2,
    color: "text-chart-2",
  },
  family: {
    icon: Users,
    color: "text-chart-4",
  },
};

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "goal",
      title: "House Deposit Goal Updated",
      message: "You're £83 ahead of schedule this month!",
      timestamp: "2 hours ago",
      read: false,
    },
    {
      id: "2",
      type: "insight",
      title: "New Spending Insight",
      message: "Eating Out spending is £150 higher than average",
      timestamp: "5 hours ago",
      read: false,
    },
    {
      id: "3",
      type: "account",
      title: "New Account Added",
      message: "Barclays Personal Savings has been linked",
      timestamp: "1 day ago",
      read: false,
    },
    {
      id: "4",
      type: "family",
      title: "Family Invitation Accepted",
      message: "Sam joined your family account",
      timestamp: "2 days ago",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          data-testid="button-notifications"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span
              className="absolute top-0 right-0 h-5 min-w-5 flex items-center justify-center px-1 text-xs font-medium bg-destructive text-destructive-foreground rounded-full"
              data-testid="badge-notification-count"
            >
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end" data-testid="popover-notifications">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-heading font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              data-testid="button-mark-all-read"
            >
              Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">No notifications</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => {
                const config = NOTIFICATION_CONFIG[notification.type];
                const Icon = config.icon;
                
                return (
                  <div
                    key={notification.id}
                    className={`p-4 hover-elevate cursor-pointer group ${
                      !notification.read ? "bg-accent/5" : ""
                    }`}
                    onClick={() => markAsRead(notification.id)}
                    data-testid={`notification-${notification.id}`}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-lg bg-card border flex items-center justify-center">
                          <Icon className={`h-5 w-5 ${config.color}`} />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="font-medium text-sm leading-tight">
                              {notification.title}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {notification.timestamp}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notification.id);
                            }}
                            data-testid={`button-remove-${notification.id}`}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        {!notification.read && (
                          <div className="absolute right-4 top-4">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
