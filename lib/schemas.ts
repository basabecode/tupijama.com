// lib/schemas.ts
import { z } from 'zod'
import { Json } from '@/types/database'

// Helper para transformar arrays de strings a un tipo compatible con Json de Supabase
const StringArrayAsJson = z.array(z.string()).transform(val => val as Json)
const StringUrlArrayAsJson = z
  .array(z.string().url('Debe ser una URL válida.'))
  .transform(val => val as Json)

export const ProductSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres.'),
  description: z.string().optional(),
  price: z.preprocess(
    val => (typeof val === 'string' ? parseFloat(val) : val),
    z.number().positive('El precio debe ser un número positivo.')
  ),
  stock: z.preprocess(
    val => (typeof val === 'string' ? parseInt(val, 10) : val),
    z.number().int().min(0, 'El stock no puede ser negativo.')
  ),
  category: z.string().optional(),
  sizes: StringArrayAsJson.optional().default([]),
  colors: StringArrayAsJson.optional().default([]),
  images: StringUrlArrayAsJson.optional().default([]),
  is_featured: z.boolean().optional().default(false),
  status: z.enum(['active', 'archived']).optional().default('active'),
})

export type ProductFormValues = z.infer<typeof ProductSchema>

// Schema para updates parciales (PATCH)
export const ProductUpdateSchema = z.object({
  name: z.string().min(3).optional(),
  description: z.string().nullable().optional(),
  price: z
    .preprocess(
      val => (typeof val === 'string' ? parseFloat(val) : val),
      z.number().positive()
    )
    .optional(),
  stock: z
    .preprocess(
      val => (typeof val === 'string' ? parseInt(val, 10) : val),
      z.number().int().min(0)
    )
    .optional(),
  category: z.string().nullable().optional(),
  sizes: StringArrayAsJson.nullable().optional(),
  colors: StringArrayAsJson.nullable().optional(),
  images: StringUrlArrayAsJson.nullable().optional(),
  is_featured: z.boolean().optional(),
  status: z.enum(['active', 'archived']).optional(),
})

export type ProductUpdateValues = z.infer<typeof ProductUpdateSchema>
