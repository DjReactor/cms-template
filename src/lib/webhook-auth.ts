import crypto from 'crypto';
import PocketBase from 'pocketbase';

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

async function verifyUniversalApiKey(token: string): Promise<boolean> {
  if (!token) return false;

  try {
    const pb = new PocketBase(process.env['PB_URL'] || 'http://127.0.0.1:8090');
    
    // Auth as superuser using internal credentials to bypass null rules
    const email = process.env.PB_ADMIN_EMAIL;
    const password = process.env.PB_ADMIN_PASSWORD;
    if (!email || !password) return false;

    try {
      if (pb.collection('_superusers')) {
        await pb.collection('_superusers').authWithPassword(email, password);
      } else {
        await (pb as any).admins.authWithPassword(email, password);
      }
    } catch (e) {
      await (pb as any).admins.authWithPassword(email, password);
    }

    const keyRecord = await pb.collection('api_keys').getFirstListItem(`key="${token}"`);
    return !!keyRecord;
  } catch (error) {
    // Not found or error
    return false;
  }
}

export async function authenticateWebhook(req: Request, payload: string, secret: string): Promise<boolean> {
  // 1. Check for standard HMAC Signature (Retell, Stripe, GitHub style)
  // Check common signature headers
  const signature = req.headers.get('x-hub-signature-256') || 
                    req.headers.get('x-retell-signature') || 
                    req.headers.get('stripe-signature');
                    
  if (signature && secret && verifyWebhookSignature(payload, signature, secret)) {
    return true; // HMAC Success
  }

  // Extract possible token
  let token = '';
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else {
    token = req.headers.get('x-api-key') || '';
  }

  // 2. Fallback to Simple Bearer Token (n8n, Make.com style) against secret
  if (token && secret && token === secret) {
    return true; // Secret Match
  }

  // 3. Fallback to Universal API Keys
  if (token) {
    const isUniversalKey = await verifyUniversalApiKey(token);
    if (isUniversalKey) {
      return true;
    }
  }

  return false; // All auth methods failed
}
