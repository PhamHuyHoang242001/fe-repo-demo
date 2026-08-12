// Save an authenticated API response as a browser download.
//
// WHY not a plain <a href> anchor: the skill/prompt download endpoints are BearerGuard-protected.
// An anchor navigation omits the Authorization header the global axios interceptor injects, so it
// would 401. We instead fetch the bytes as a blob through the authenticated axios client and save
// them client-side via a transient object URL.
//
// NOTE on auth failures: a genuine 401 here is caught by the global axios-auth-refresh interceptor
// (utils/http.ts), which may refresh the token or redirect to /login — it will NOT necessarily
// surface to the caller's catch block. Callers' transient error state covers network errors and
// post-refresh 4xx (e.g. 403/404), not a hard auth redirect.

import type { AxiosResponse } from 'axios';

// Parse the download filename from the response's Content-Disposition header, falling back to a
// caller-supplied default when the header is absent or unparseable. Handles both the plain
// `filename="x"` form and the RFC 5987 `filename*=UTF-8''x` form.
function filenameFromResponse(res: AxiosResponse, fallback: string): string {
  const cd = (res.headers['content-disposition'] ?? res.headers['Content-Disposition'] ?? '') as string;
  const match = /filename\*?=(?:UTF-8'')?"?([^"';]+)"?/i.exec(cd);
  if (!match) return fallback;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

// Trigger a file download from an axios blob response via a synthetic anchor click.
export function saveBlobResponse(res: AxiosResponse<Blob>, fallbackName: string): void {
  const filename = filenameFromResponse(res, fallbackName);
  const objectUrl = URL.createObjectURL(res.data);
  const a = document.createElement('a');
  a.href = objectUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Revoke on the next tick so the click has already initiated the download.
  setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
}
