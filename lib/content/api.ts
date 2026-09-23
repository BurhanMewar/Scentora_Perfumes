const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "");

export function isCmsConfigured() {
  return Boolean(apiBaseUrl);
}

export async function fetchCms<T>(
  path: string,
  init?: RequestInit,
): Promise<T | null> {
  if (!apiBaseUrl) {
    return null;
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`CMS request failed (${response.status}) for ${path}`);
  }

  return (await response.json()) as T;
}
