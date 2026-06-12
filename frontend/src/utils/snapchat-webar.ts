interface SnapLensOptions {
  lensId: string;
  apiToken?: string; // Optional: If you need authentication
}

export function launchSnapLens(options: SnapLensOptions): void {
  const { lensId } = options;
  
  // Construct the WebAR URL for the specific lens
  const lensUrl = `https://lens.snapchat.com/experience/${lensId}`;
  
  // Open in a new window/tab
  window.open(lensUrl, '_blank');
}