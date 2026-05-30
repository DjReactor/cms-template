import crypto from 'crypto';

export function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  if (!signature || !secret) return false;
  
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
    
  // Secure compare to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch (e) {
    return false; // Length mismatch
  }
}

export function authenticateWebhook(req: Request, payload: string, secret: string): boolean {
  if (!secret) return false;

  // 1. Check for standard HMAC Signature (Retell, Stripe, GitHub style)
  // Check common signature headers
  const signature = req.headers.get('x-hub-signature-256') || 
                    req.headers.get('x-retell-signature') || 
                    req.headers.get('stripe-signature');
                    
  if (signature && verifyWebhookSignature(payload, signature, secret)) {
    return true; // HMAC Success
  }

  // 2. Fallback to Simple Bearer Token (n8n, Make.com style)
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    if (token === secret) {
      return true; // Bearer Token Success
    }
  }

  // 3. Optional: Fallback to custom header like x-api-key
  const apiKey = req.headers.get('x-api-key');
  if (apiKey === secret) {
    return true;
  }

  return false; // All auth methods failed
}
