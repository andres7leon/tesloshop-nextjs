"use client";

import { createUpdateProduct, deleteProductImage } from "@/actions";
import { Product } from "@/interfaces";
import { iCategories, iProductImage } from "@/interfaces/categories.interface";
import clsx from "clsx";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

interface Props {
  product: Partial<Product> & { ProductImage?: iProductImage[] };
  categories: iCategories[];
}

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

interface Props {
  title: string;
  slug: string;
  description: string;
  price: number;
  tags: string;
  gender: 'men'|'women'|'kid'|'unisex';
  categoryId: string;
  // Images Todo
  images?: FileList;
}

export const ProductForm = ({ product, categories }: Props) => {

  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: {isValid},
    getValues,
    setValue,
    watch,
  } = useForm<any>(
    {
      defaultValues: {
        ...product,
        tags: product.tags?.join(', '),
        sizes: product.sizes || [],

        images: undefined,
      }
    }
  );

  watch('sizes');

  const onChangeSize = (size: string) => {
    const sizes = new Set(getValues('sizes'));

    sizes.has(size) ? sizes.delete(size) : sizes.add(size);

    setValue('sizes', Array.from(sizes));
  }

  const onSubmit = async(data: any) => {
    console.log({data})

    const formData = new FormData();

    const {images,...productToSave} = data; 

    if (productToSave.id) {
      formData.append('id', productToSave.id || '');
    }

    formData.append('title', productToSave.title);
    formData.append('slug', productToSave.slug);
    formData.append('description', productToSave.description);
    formData.append('price', productToSave.price.toString());
    formData.append('inStock', productToSave.inStock.toString());
    formData.append("sizes", productToSave.sizes.toString());
    formData.append('tags', productToSave.tags);
    formData.append("categoryId", productToSave.categoryId);
    formData.append("gender", productToSave.gender);

    if ( images ) {
      for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
      }
    }

    const {ok, product} = await createUpdateProduct(formData);
    console.log('ook', ok)


    if (!ok) {
      alert('EL producto no se pudo actualzizar');
      return;
    }

    router.replace(`/admin/product/${product?.slug}`);	

  }

  return (
    <form onSubmit={ handleSubmit(onSubmit)} className="grid px-5 mb-16 grid-cols-1 sm:px-0 sm:grid-cols-2 gap-3">
      {/* Textos */}
      <div className="w-full">
        <div className="flex flex-col mb-2">
          <span>Título</span>
          <input type="text" className="p-2 border rounded-md bg-gray-200" {...register('title', {required: true})} />
        </div>

        <div className="flex flex-col mb-2">
          <span>Slug</span>
          <input type="text" className="p-2 border rounded-md bg-gray-200" {...register('slug', {required: true})}/>
        </div>

        <div className="flex flex-col mb-2">
          <span>Descripción</span>
          <textarea
            rows={5}
            className="p-2 border rounded-md bg-gray-200" {...register('description', {required: true})}
          ></textarea>
        </div>

        <div className="flex flex-col mb-2">
          <span>Price</span>
          <input type="number" className="p-2 border rounded-md bg-gray-200" {...register('price', {required: true})} />
        </div>

        <div className="flex flex-col mb-2">
          <span>Tags</span>
          <input type="text" className="p-2 border rounded-md bg-gray-200" {...register('tags', {required: true})}/>
        </div>

        <div className="flex flex-col mb-2">
          <span>Gender</span>
          <select className="p-2 border rounded-md bg-gray-200" {...register('gender', {required: true})}>
            <option value="">[Seleccione]</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kid">Kid</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>

        <div className="flex flex-col mb-2">
          <span>Categoria</span>
          <select className="p-2 border rounded-md bg-gray-200" {...register('categoryId', {required: true})}>
            <option value="">Seleccione una opcion</option>
            {
              categories.map( item => (
                <option key={ item.id } value={ item.id }>{ item.name }</option>
              ))
            }
          </select>
        </div>

        <button className="btn-primary w-full">
          Guardar
        </button>
      </div>

      {/* Selector de tallas y fotos */}
      <div className="w-full">
        {/* As checkboxes */}

        <div className="flex flex-col mb-2">
          <span>Stock</span>
          <input type="number" className="p-2 border rounded-md bg-gray-200" {...register('inStock', {required: true})} />
        </div>

        <div className="flex flex-col">

          <span>Tallas</span>
          <div className="flex flex-wrap">
            
            {
              sizes.map( size => (
                // bg-blue-500 text-white <--- si está seleccionado
                <div key={ size } 
                  onClick={() => {onChangeSize(size)}}
                  className={clsx(
                    "flex items-center justify-center w-10 h-10 mr-2 border rounded-md",
                    {
                      'bg-blue-500 text-white': getValues('sizes').includes(size)
                    }
                  )}>
                  <span>{ size }</span>
                </div>
              ))
            }

          </div>


          <div className="flex flex-col mb-2">

            <span>Fotos</span>
            <input 
              type="file"
              {...register('images')}
              multiple 
              className="p-2 border rounded-md bg-gray-200" 
              accept="image/png, image/jpeg"
            />

          </div>

          <div className="flex mt-5">
            {

              product.ProductImage?.map( image => { 
                const imageUrl = image.url.includes('https') ? `${image.url.trim()}` : `/products/${image.url}` ;
                return (
                  <div key={image.id} className="mr-5">
                    <Image src={imageUrl} width={100} height={100} alt="img"/>
                    <button type="button" className="btn-primary w-full" onClick={() => deleteProductImage(image.id,image.url)}>Eliminar</button>
                  </div>
                )
              })

            }

          </div>

        </div>
      </div>
    </form>
  );
};