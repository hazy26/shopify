import {useLoaderData} from '@remix-run/react';
import {useState} from 'react';
import Pagetitle from '~/components/PageTitle';

export async function loader({context}) {
  const data = await context.storefront.query(FAQ_QUERY);
  return {
    faq: data.metaobjects.nodes,
  };
}

export default function Contact() {
  const loaderdata = useLoaderData();
  const faq = loaderdata.faq;
  const [isOpen, setOpen] = useState(false);

  return (
    <section className="flex flex-col gap-8 p-10 text-primary">
      <Pagetitle title={'FAQ'} />
      <div className="flex flex-col self-center">
        {faq.map(({index, question, reponse}, id) => {
          return (
            <div key={index} className="flex flex-col gap-3 p-2 max-w-[680px]">
              <div className="flex gap-4 items-center justify-between p-4">
                <h2 className="text-lg p-1 font-medium tracking-wide">
                  {question.value}
                </h2>
                <button
                  className="p-2 w-fit h-fit cursor-pointer scale-150"
                  onClick={() => {
                    setOpen(isOpen === id ? false : id);
                  }}
                >
                  {isOpen === id ? '-' : '+'}
                </button>
              </div>
              <p
                className={`${
                  isOpen === id ? 'inline' : 'hidden'
                } p-4 font-light tracking-wide`}
              >
                {reponse.value}
              </p>
              <div className="bg-primary h-[1px] w-full"></div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

const FAQ_QUERY = `#graphql 
query faq {
  metaobjects(type: "faq", first: 20) {
    nodes {
      question: field(key: "question") {
        value
      }
      reponse: field(key: "reponse") {
        value
      }
    }
  }
}`;
