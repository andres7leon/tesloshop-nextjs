import { getProductBySlug, getCategories } from '@/actions';
import { Title } from '@/components';
import { redirect } from 'next/navigation';
import React from 'react'
import { ProductForm } from './ui/ProductForm';

interface Props {
  params: {
    slug: string
  }
}

export default async function ProductPage({params}: Props) {

  const { slug } = params;

  const product = await getProductBySlug(slug);

  const categories = await getCategories();

  if (!product && slug !== 'new') {
    redirect('/admin/products')
  }

  const title = (slug === 'new') ? 'Nuevo Producto' : 'Editar Producto'

  return (
    <>
      <Title title={title} /> 

      <ProductForm product={product || {}} categories={categories} title={''} slug={''} description={''} price={0} tags={''} gender={'men'} categoryId={''}/>
    </>
  )
}

