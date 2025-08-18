export interface FcmNotification {
  title?: string;
  body?: string;
  imageUrl?: string;
}

export interface FcmData {
  [key: string]: string;
}

export interface FcmAndroidConfig {
  priority?: 'normal' | 'high';
  ttl?: number;
  notification?: {
    title?: string;
    body?: string;
    icon?: string;
    color?: string;
    sound?: string;
    tag?: string;
    clickAction?: string;
  };
}

export interface FcmApnsConfig {
  headers?: {
    [key: string]: string;
  };
  payload?: {
    aps: {
      alert?: {
        title?: string;
        body?: string;
      };
      badge?: number;
      sound?: string;
      'content-available'?: number;
      'mutable-content'?: number;
    };
  };
}

export interface FcmWebpushConfig {
  headers?: {
    [key: string]: string;
  };
  data?: {
    [key: string]: string;
  };
  notification?: {
    title?: string;
    body?: string;
    icon?: string;
    badge?: string;
    image?: string;
    actions?: Array<{
      action: string;
      title: string;
      icon?: string;
    }>;
  };
}

export interface FcmMessage {
  notification?: FcmNotification;
  data?: FcmData;
  android?: FcmAndroidConfig;
  apns?: FcmApnsConfig;
  webpush?: FcmWebpushConfig;
}