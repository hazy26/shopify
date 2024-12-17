import {useLoaderData} from '@remix-run/react';
import {CiFacebook, CiInstagram} from 'react-icons/ci';
import Pagetitle from '~/components/PageTitle';

export async function loader({context}) {
  const data = await context.storefront.query(CONTACT_QUERY);
  return {
    contact: data.metaobjects.nodes,
  };
}

export default function Contact() {
  const loaderdata = useLoaderData();
  const contact = loaderdata.contact;
  return (
    <section className="flex flex-col gap-12 p-10 text-primary">
      <Pagetitle title={'Nous Joindre'} />
      <div className="flex gap-12 self-center">
        {contact.map(({index, email, phone, facebook, instagram}) => {
          return (
            <div key={index} className="flex flex-col items-center gap-16">
              <div className="flex flex-col gap-6 items-center text-center">
                <div className="flex flex-col gap-1">
                  <h2 className="text-lg font-semibold uppercase tracking-wider">
                    Courriel
                  </h2>
                  <h3 className="text-lg tracking-wide font-light">
                    {email.value}
                  </h3>
                </div>
                <div>
                  <h2 className="text-lg font-semibold uppercase tracking-wider">
                    Téléphone
                  </h2>
                  <h3 className="text-lg tracking-wide font-light">
                    {phone.value}
                  </h3>
                </div>
                <div className="flex gap-4">
                  <a href={facebook.value} target="_blank" rel="noreferrer">
                    <CiFacebook size={'50px'} />
                  </a>
                  <a href={instagram.value} target="_blank" rel="noreferrer">
                    <CiInstagram size={'50px'} />
                  </a>
                </div>
              </div>
              <section className="flex flex-col gap-4">
                <h2 className="text-2xl tracking-wide font-semibold">
                  Vous avez des questions?
                </h2>
                <form
                  action=""
                  className="flex flex-col gap-8 p-4 outline-primary"
                >
                  <fieldset className="flex flex-col gap-1">
                    <label
                      htmlFor="name"
                      className="text-lg tracking-wide font-light"
                    >
                      Nom:
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      placeholder="John Doe"
                      className="p-2"
                    />
                  </fieldset>
                  <fieldset className="flex flex-col gap-1">
                    <label
                      htmlFor="courriel"
                      className="text-lg tracking-wide font-light"
                    >
                      Courriel:
                    </label>
                    <input
                      type="text"
                      name="courriel"
                      id="courriel"
                      placeholder="johndoe@courriel.ca"
                      className="p-2"
                    />
                  </fieldset>
                  <fieldset className="pb-4 flex flex-col gap-1">
                    <label
                      htmlFor="message"
                      className="text-lg tracking-wide font-light"
                    >
                      Message:
                    </label>
                    <textarea
                      type="text"
                      name="message"
                      id="message"
                      placeholder="Votre message..."
                      className="p-2"
                    />
                  </fieldset>
                  <button className="w-fit self-center bg-primary text-white px-8 py-2 tracking-wide">
                    Envoyer
                  </button>
                </form>
              </section>
            </div>
          );
        })}
      </div>
    </section>
  );
}

const CONTACT_QUERY = `#graphql 
query contact {
  metaobjects(type: "contact", first: 5) {
    nodes {
      email: field(key: "email") {
        value
      }
      phone: field(key: "phone") {
        value
      }
      facebook: field(key: "facebook") {
        value
      }
      instagram: field(key: "instagram") {
        value
      }
    }
  }
}`;
