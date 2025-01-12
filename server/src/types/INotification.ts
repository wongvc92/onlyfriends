export interface INotification {
  id: string;
  recipient_id: string;
  type: string;
  content: string;
  source_id: string;
  is_read: boolean;
  created_at: Date;
}

export interface IUnOpenNotification {
  id: string;
  user_id: string;
  unopen_notification_count: number;
  created_at: string;
  updated_at: string;
}

export interface INotificationSocket {
  action: "increment" | "decrement";
  type: "post";
  details: { id: string; name: string; recipient_id: string };
  notificationData?: INotification;
}
