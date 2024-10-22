// api/reservations.ts
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/app/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const reservations = await prisma.reservation.findMany({
      orderBy: { timestamp: 'desc' },
      take: 3, // Take the latest 3 records
    });
    res.status(200).json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ error: 'Error fetching reservations' });
  }
}