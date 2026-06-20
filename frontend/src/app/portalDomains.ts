export type PortalKey = 'customer' | 'reception' | 'admin';

const domainConfig: Record<PortalKey, string | undefined> = {
  customer: import.meta.env.VITE_CUSTOMER_DOMAIN,
  reception: import.meta.env.VITE_RECEPTION_DOMAIN,
  admin: import.meta.env.VITE_ADMIN_DOMAIN,
};

const normalizeHost = (value?: string) =>
  value?.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');

export const resolvePortalFromHost = (host = window.location.hostname): PortalKey | null => {
  const currentHost = normalizeHost(host);

  for (const [portal, configuredHost] of Object.entries(domainConfig)) {
    if (currentHost && currentHost === normalizeHost(configuredHost)) {
      return portal as PortalKey;
    }
  }

  return null;
};

export const getPortalUrl = (portal: PortalKey) => {
  const configuredHost = normalizeHost(domainConfig[portal]);

  if (!configuredHost) {
    return portal === 'customer' ? '/' : `/${portal}`;
  }

  return `https://${configuredHost}`;
};
