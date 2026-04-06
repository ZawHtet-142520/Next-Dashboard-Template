export interface EmailSetting {
  _id: string;
  host: string;
  port: number;
  secure: boolean;
  authUser: string;
  authPass: string;
  from: string;
  email: string;
  createdAt: string;
}

export interface EmailSettingResponse {
  success: boolean;
  message: string;
  status: boolean;
  data: {
    emailSetting: EmailSetting;
  };
}

export interface EmailSettingUpdateResponse {
  success: boolean;
  message: string;
  status: boolean;
}

export interface EmailTestResponse {
  success: boolean;
  message: string;
  status: boolean;
}
