import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  
  const gestiones = await prisma.gestion.findMany({
    where: search ? { descripcion: { contains: search, mode: 'insensitive' } } : {},
    include: { contacto: true },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(gestiones);
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const gestion = await prisma.gestion.create({
    data: {
      contactoId: data.contactoId,
      tipo: data.tipo,
      descripcion: data.descripcion,
      userId: 'default-user',
    }
  });
  return NextResponse.json(gestion);
}
