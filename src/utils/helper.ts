export const checkIfPublicAPIs = (path: string): boolean => {
  // const publicPaths = ['/api/health', '/docs'];
  const publicPaths = ['/api/health', '/docs/', '/swagger'];
  return publicPaths.includes(path) || path.startsWith('/docs');
};
