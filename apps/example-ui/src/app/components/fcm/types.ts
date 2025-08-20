export interface ReceivedMessage {
  id: string;
  title: string;
  body: string;
  timestamp: Date;
  data?: { [key: string]: string };
}

export interface NotificationPayload {
  title: string;
  body: string;
  data?: { [key: string]: string };
}

export interface CurlCommandProps {
  command: string;
  onCopy: () => void;
  disabled?: boolean;
}

export interface DeviceTokenDisplayProps {
  token: string;
}

export interface MessageListenerProps {
  messages: ReceivedMessage[];
}