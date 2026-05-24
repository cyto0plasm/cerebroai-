export function normalizeAuthEmail(email) {
  return String(email || '').trim().toLowerCase();
}

export function mapAuthError(error) {
  const msg = String(error?.message || '');
  const code = String(error?.code || '');
  const lower = msg.toLowerCase();

  if (lower.includes('invalid login credentials') || code === 'invalid_credentials') {
    return 'Incorrect email or password. If you just registered, confirm your email first.';
  }
  if (lower.includes('email not confirmed') || code === 'email_not_confirmed') {
    return 'Confirm your email before signing in (check inbox and spam).';
  }
  if (lower.includes('user already registered')) {
    return 'An account with this email already exists. Sign in instead.';
  }
  if (lower.includes('password') && lower.includes('weak')) {
    return 'Use a stronger password (at least 8 characters).';
  }
  if (lower.includes('rate limit') || code === 'over_request_rate_limit') {
    return 'Too many attempts. Wait a minute and try again.';
  }
  if (lower.includes('network') || lower.includes('fetch')) {
    return 'Could not reach the auth service. Check your connection and try again.';
  }

  return msg || 'Authentication failed. Please try again.';
}
