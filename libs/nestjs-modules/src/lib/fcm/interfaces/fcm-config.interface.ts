export interface FcmConfig {
  projectId: string;
  clientEmail: string;
  privateKey: string;
}

export interface FcmModuleOptions {
  config?: FcmConfig;
  serviceAccountPath?: string;
}