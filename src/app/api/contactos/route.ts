import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  
  const contactos = await prisma.contacto.findMany({
    where: search ? {
      OR: [
        { nombre: { contains: search, mode: 'insensitive' } },
        { notas: { contains: search, mode: 'insensitive' } },
        { ubicacion: { contains: search, mode: 'insensitive' } },
      ]
    } : {},
    orderBy: { nombre: 'asc' }
  });
  return NextResponse.json(contactos);
}

export async function POST(request: NextRequest) {
  const data = await request.json();
  const contacto = await prisma.contacto.create({
    data: {
      nombre: data.nombre,
      telefonos: JSON.stringify([data.telefono]),
      email: data.email || null,
      etiquetas: JSON.stringify(data.etiquetas || []),
      nivel: data.nivel || 3,
      ubicacion: data.ubicacion || null,
      notas: data.notas || null,
      comoNosConocimos: data.comoNosConocimos || null,
      confidencial: data.confidencial || false,
      userId: 'default-user', // TODO: Get from session
    }
  });
  return NextResponse.json(contacto);
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
  await prisma.contacto.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
