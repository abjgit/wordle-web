import { ethers } from 'ethers';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Inicializar Firebase Admin si no está inicializado
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { address, signature, payload } = req.body;

    if (!address || !signature || !payload) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verificar la firma
    const message = payload;
    const recoveredAddress = ethers.verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Crear un token personalizado de Firebase
    const auth = getAuth();
    const token = await auth.createCustomToken(address);

    // Devolver el token al cliente
    return res.status(200).json({ token });
  } catch (error) {
    console.error('Error in MetaMask authentication:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
