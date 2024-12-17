import {defer} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link} from '@remix-run/react';
import {Suspense, useState} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import IconWithText from '~/components/IconWithText';
import earth from '~/assets/earth.svg';
import recycle from '~/assets/recycle.svg';
import truck from '~/assets/truck.svg';
import {LuArrowLeft, LuArrowRight} from 'react-icons/lu';
import banner from '~/assets/banner.png';
import AddToWishlist from '~/components/AddToWishlist';

/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [{title: 'AuraBeats | Accueil'}];
};

/**
 * @param {LoaderFunctionArgs} args
 */
export async function loader(args) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return defer({...deferredData, ...criticalData});
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 * @param {LoaderFunctionArgs}
 */
async function loadCriticalData({context}) {
  const [{collections}] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {
    featuredCollection: collections.nodes[0],
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {LoaderFunctionArgs}
 */
function loadDeferredData({context}) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  const data = context.storefront.query(SLIDER_QUERY);

  return {
    recommendedProducts,
    sliders: data,
  };
}

export default function Homepage() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();
  return (
    <div className="flex flex-col gap-16 lg:gap-24">
      <div className="grid md:grid-cols-2 items-center gap-20 w-full self-center md:border-b-3 border-primary md:max-h-[600px]">
        <div>
          <img
            src={`${banner}`}
            alt="Bannière, représant des écouteurs sans-fil."
            className="md:max-h-[595px] object-cover"
          />
        </div>
        <div>
          <Suspense fallback={<div>Chargement du slider...</div>}>
            <Await resolve={data.sliders}>
              {(sliders) => <TextSlider sliders={sliders.metaobjects.nodes} />}
            </Await>
          </Suspense>
        </div>
      </div>

      <div className="flex items-start justify-between gap-4 w-full max-w-[768px] self-center p-4 pt-8">
        <IconWithText text="Partout dans le monde.">
          <img src={earth} alt="Icone de la planète terre" />
        </IconWithText>
        <IconWithText text="2-5 jours ouvrables.">
          <img src={truck} alt="Icone de camion" />
        </IconWithText>

        <IconWithText text="85% de matière recyclé.">
          <img src={recycle} alt="Icone de recyclage" />
        </IconWithText>
      </div>
      <div className="px-4 pb-16 flex flex-col items-center justify-center gap-16 self-center max-w-[1280px]">
        <RecommendedProducts products={data.recommendedProducts} />
        <FeaturedCollection collection={data.featuredCollection} />
      </div>
    </div>
  );
}

function TextSlider({sliders}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % sliders.length);
  };
  const nextSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + sliders.length) % sliders.length,
    );
  };

  return (
    <div className="flex flex-col gap-8 items-center max-w-[520px] w-full p-4 text-primary">
      <div className="p-4 flex flex-col gap-4 max-w-[520px]">
        <h2 className="font-semibold text-5xl">
          {sliders[currentIndex].title.value}
        </h2>
        <p className="font-light text-xl">
          {sliders[currentIndex].texte.value}
        </p>
        <a
          className="text-lg tracking-wide border-1 border-primary py-2 px-6 w-fit"
          href="/collections"
        >
          {sliders[currentIndex].cta.value}
        </a>
      </div>
      <div className="flex items-center justify-between px-8 w-full">
        <button onClick={prevSlide} className="scale-200 cursor-pointer">
          <LuArrowLeft />
        </button>
        <button onClick={nextSlide} className="scale-200 cursor-pointer">
          <LuArrowRight />
        </button>
      </div>
    </div>
  );
}

/**
 * @param {{
 *   collection: FeaturedCollectionFragment;
 * }}
 */
function FeaturedCollection({collection}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <Link to={`/collections/${collection.handle}`}>
      <div className="p-2">
        <h1 className="font-thin text-2xl p-4 border-2 bg-primary text-white border-primary uppercase tracking-wide text-center">
          Collection: <span className="font-light">{collection.title}</span>
        </h1>
        {image && (
          <div>
            <Image data={image} sizes="100vw" />
          </div>
        )}
      </div>
    </Link>
  );
}

/**
 * @param {{
 *   products: Promise<RecommendedProductsQuery | null>;
 * }}
 */
function RecommendedProducts({products}) {
  return (
    <div className="flex flex-col gap-8 text-primary">
      <h2 className="text-2xl font-medium tracking-wide self-center">
        Produits Populaires
      </h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div className="grid md:grid-cols-2 lg:gap-16 gap-8 ">
              {response
                ? response.products.nodes.map((product) => (
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
                  ))
                : null}
            </div>
          )}
        </Await>
      </Suspense>
      <br />
    </div>
  );
}

const SLIDER_QUERY = `#graphql 
query slider {
  metaobjects (type:"slider", first: 10){
    nodes{
      title: field(key:"titre"){
        value
      }
      texte: field(key:"texte"){
        value
      }
      cta: field(key:"cta"){
        value
      }
    }
  }
}`;

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
`;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 1) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('storefrontapi.generated').FeaturedCollectionFragment} FeaturedCollectionFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductsQuery} RecommendedProductsQuery */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
