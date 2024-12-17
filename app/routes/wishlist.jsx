import {Link, useLoaderData} from '@remix-run/react';
import {Money, Image} from '@shopify/hydrogen';
import AddToWishlist from '~/components/AddToWishlist';
import Pagetitle from '~/components/PageTitle';

export async function loader({context, request}) {
  const cookie = request.headers
    .get('Cookie')
    .split(';')
    .map((cookie) => cookie.split('='));

  const wishlist = cookie.find((item) => item[0] === 'wishlist');

  if (wishlist) {
    const wishlistValue = JSON.parse(decodeURIComponent(wishlist[1]));
    const productIds = Object.keys(wishlistValue);

    const data = await context.storefront.query(PRODUCTS_QUERY, {
      variables: {ids: productIds},
    });

    return {products: data.nodes};
  }

  return {products: []};
}

export default function Wishlist() {
  const data = useLoaderData();
  const products = data.products;

  return (
    <section className="flex flex-col p-10 gap-12">
      <Pagetitle title={'Liste de souhaits'} />
      <div className="flex flex-col gap-20 items-center justify-center p-10 text-primary">
        {products.map((product) => (
          <Link
            key={product.id}
            className="flex gap-8 p-2"
            to={`/products/${product.handle}`}
          >
            <Image
              data={product.images.nodes[0]}
              aspectRatio="1/1"
              width={600}
              height={600}
              className="object-cover w-[120px] h-[160px] border-2 border-primary shadow-[6px_6px_0_0_rgba(4,138,129)]"
            />
            <section className="flex flex-col items-start justify-center gap-2 p-2">
              <h4 className="text-lg font-light tracking-wider">
                {product.title}
              </h4>
              <small className="font-semibold text-sm tracking-wide pb-4">
                <Money data={product.priceRange.minVariantPrice} />
              </small>
              <div className="flex flex-row-reverse justify-center gap-4">
                <AddToWishlist productId={product.id} />
                <button className="w-fit bg-white px-4 py-1 tracking-wide font-light text-small border-1 border-primary cursor-pointer">
                  Voir le produit
                </button>
              </div>
            </section>
          </Link>
        ))}
      </div>
    </section>
  );
}

const PRODUCTS_QUERY = `#graphql
fragment MoneyProductItem on MoneyV2 {
  amount
  currencyCode
}

query Products($ids: [ID!]!) {
  nodes(ids: $ids) {
    ... on Product {
      id
      title
      handle
      featuredImage {
        url(transform: {maxHeight: 200, maxWidth: 200})
      }
      priceRange {
        minVariantPrice {
          ...MoneyProductItem
        }
        maxVariantPrice {
          ...MoneyProductItem
        }
      }
    }
  }
}`;
