export interface GetNotificationTemplatesResponse {
  success: boolean;
  message: string;
  status: number;
  data: {
    notificationTemplates: NotificationTemplateItem[];
  };
}

export interface NotificationTemplateItem {
  _id: string;
  type: string;
  subject: string;
  template: string;
  variables: string[];
  createdAt: string;
}

export interface UpdateNotificationTemplateResponse {
  success: boolean;
  message: string;
  status: number;
}
