const GOOGLE_AUTH_ENDPOINT = 'https://accounts.google.com/o/oauth2/v2/auth';
const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.readonly';

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  thumbnailLink?: string;
}

export function initiateGoogleAuth(clientId: string, emailHint?: string) {
  const redirectUri = `${window.location.origin}/oauth-callback.html`;
  
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'token',
    scope: DRIVE_SCOPE,
    include_granted_scopes: 'true',
    state: 'pass-through value',
  });

  if (emailHint) {
    params.append('login_hint', emailHint);
  }

  const authUrl = `${GOOGLE_AUTH_ENDPOINT}?${params.toString()}`;
  
  // Open popup
  const width = 500;
  const height = 600;
  const left = window.screen.width / 2 - width / 2;
  const top = window.screen.height / 2 - height / 2;
  
  window.open(
    authUrl,
    'google_auth',
    `width=${width},height=${height},top=${top},left=${left}`
  );
}

export async function searchDriveFiles(accessToken: string, query: string = ""): Promise<DriveFile[]> {
  // Search for PDFs and Images
  const q = "(mimeType = 'application/pdf' or mimeType contains 'image/') and trashed = false";
  
  const response = await fetch(`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(q)}&fields=files(id,name,mimeType,thumbnailLink)&pageSize=20`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Drive files');
  }

  const data = await response.json();
  return data.files || [];
}

export async function downloadDriveFile(accessToken: string, fileId: string): Promise<Blob> {
  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to download file');
  }

  return await response.blob();
}
