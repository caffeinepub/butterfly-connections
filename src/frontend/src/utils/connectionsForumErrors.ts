export function normalizeForumError(error: unknown): string {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    
    if (message.includes('unauthorized') || message.includes('only users can')) {
      return 'You must be logged in to perform this action.';
    }
    
    if (message.includes('forbidden') || message.includes('only view threads from your connections')) {
      return 'You can only view threads from your connections.';
    }
    
    if (message.includes('thread not found')) {
      return 'This thread could not be found.';
    }
    
    if (message.includes('connection request already sent')) {
      return 'Connection request already sent.';
    }
    
    if (message.includes('network') || message.includes('fetch')) {
      return 'Network error. Please check your connection and try again.';
    }
    
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
}
