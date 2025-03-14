declare namespace NodeJS {
  export interface ProcessEnv {
    NEXT_PUBLIC_SITE_URL?: string;

    NEXT_PRIVATE_GOOGLE_CLIENT_ID?: string;
    NEXT_PRIVATE_GOOGLE_CLIENT_SECRET?: string;

    NEXT_PRIVATE_DATABASE_URL: string;

    NEXT_PUBLIC_STRIPE_COMMUNITY_PLAN_MONTHLY_PRICE_ID: string;
    NEXT_PUBLIC_STRIPE_COMMUNITY_PLAN_YEARLY_PRICE_ID: string;

    NEXT_PRIVATE_STRIPE_API_KEY: string;
    NEXT_PRIVATE_STRIPE_WEBHOOK_SECRET: string;

    NEXT_PUBLIC_UPLOAD_TRANSPORT?: 'database' | 's3';
    NEXT_PRIVATE_UPLOAD_ENDPOINT?: string;
    NEXT_PRIVATE_UPLOAD_REGION?: string;
    NEXT_PRIVATE_UPLOAD_BUCKET?: string;
    NEXT_PRIVATE_UPLOAD_ACCESS_KEY_ID?: string;
    NEXT_PRIVATE_UPLOAD_SECRET_ACCESS_KEY?: string;

    NEXT_PRIVATE_SMTP_TRANSPORT?: 'mailchannels' | 'smtp-auth' | 'smtp-api';

    NEXT_PRIVATE_MAILCHANNELS_API_KEY?: string;
    NEXT_PRIVATE_MAILCHANNELS_DKIM_DOMAIN?: string;
    NEXT_PRIVATE_MAILCHANNELS_DKIM_SELECTOR?: string;
    NEXT_PRIVATE_MAILCHANNELS_DKIM_PRIVATE_KEY?: string;
    NEXT_PRIVATE_MAILCHANNELS_ENDPOINT?: string;

    NEXT_PRIVATE_SMTP_HOST?: string;
    NEXT_PRIVATE_SMTP_PORT?: string;
    NEXT_PRIVATE_SMTP_USERNAME?: string;
    NEXT_PRIVATE_SMTP_PASSWORD?: string;

    NEXT_PRIVATE_SMTP_APIKEY_USER?: string;
    NEXT_PRIVATE_SMTP_APIKEY?: string;

    NEXT_PRIVATE_SMTP_SECURE?: string;

    NEXT_PRIVATE_SMTP_FROM_NAME?: string;
    NEXT_PRIVATE_SMTP_FROM_ADDRESS?: string;
  }
}
