import {useLoaderData} from '@remix-run/react';
import Pagetitle from '~/components/PageTitle';

export async function loader({context}) {
  const data = await context.storefront.query(PARTENAIRES_QUERY);
  return {
    partenaires: data.metaobjects.nodes,
  };
}

export default function Partenaires() {
  const loaderdata = useLoaderData();
  const partenaires = loaderdata.partenaires;
  return (
    <section className="flex flex-col gap-16 p-10 text-primary">
      <Pagetitle title={'Nos Partenaires'} />
      <div className="grid grid-cols-2 gap-10 self-center items-center justify-center">
        {partenaires.map(({index, name, logo}) => {
          const partenaire = {name}.name.value;
          const image = {logo}.logo.reference.previewImage.url;
          return (
            <section
              key={index}
              className="w-fit flex flex-col items-center max-w-[120px]"
            >
              <i>
                <img src={image} alt={partenaire} className="scale-80" />
              </i>
              <h2 className="font-medium text-center tracking-wide text-lg">
                {partenaire}
              </h2>
            </section>
          );
        })}
      </div>
    </section>
  );
}

const PARTENAIRES_QUERY = `#graphql 
query partenaire{
  metaobjects(type: "partenaire", first: 10) {
    nodes {
      logo: field(key: "logo") {
        reference {
          ... on MediaImage{
            previewImage{
              url
            }
          }
        }
      }
      name: field(key: "name") {
        value
      }
    }
  }
}`;
