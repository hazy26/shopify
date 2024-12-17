import {Suspense, useEffect} from 'react';
import {Await, NavLink} from '@remix-run/react';
import logo from '~/assets/logo-white.svg';
import {CiFacebook, CiInstagram} from 'react-icons/ci';
import {FaArrowRight} from 'react-icons/fa';

/**
 * @param {FooterProps}
 */
export function Footer({footer: footerPromise, header, publicStoreDomain}) {
  const emails = [];
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => (
          <footer className="bg-primary h-dvh flex flex-col px-4 py-4 justify-between">
            <NavLink
              className={'w-fit self-center pt-12 scale-150'}
              prefetch="intent"
              to="/"
              end
            >
              <img src={logo} alt="Logo AuraBeats" />
            </NavLink>
            <div className="flex flex-col gap-20">
              <section className="self-center flex flex-col gap-4">
                <h3 className="text-white text-center tracking-wide font-light text-xl">
                  Nous Suivre
                </h3>
                <div className="text-white flex gap-4">
                  <a
                    href="https://www.facebook.com"
                    rel="noreferrer"
                    target="_blank"
                    className="text-white"
                  >
                    <CiFacebook size={'60px'} />
                  </a>
                  <a
                    href="https://www.instagram.com"
                    rel="noreferrer"
                    target="_blank"
                    className="text-white"
                  >
                    <CiInstagram size={'60px'} />
                  </a>
                </div>
              </section>
              <section className="self-center flex flex-col gap-4">
                <h3 className="text-white text-lg font-light tracking-wide">
                  S'inscrire à notre infolettre:
                </h3>
                <div className="bg-white flex items-center p-2">
                  <input
                    id="infolettre"
                    type="text"
                    className="bg-white border-none h-[30px]"
                  />
                  <button
                    className="text-black cursor-pointer w-fit h-fit"
                    onClick={() => {
                      const emailValue =
                        document.getElementById('infolettre').value;
                      emails.push(emailValue);
                      localStorage.setItem(
                        'Infolettre',
                        JSON.stringify(emails),
                      );
                    }}
                  >
                    <FaArrowRight className="text-primary" size={'25px'} />
                  </button>
                </div>
              </section>
            </div>

            <p className="text-white self-center tracking-widest font-thin text-xs">
              © copyright {new Date().getFullYear()} AuraBeats
            </p>
          </footer>
        )}
      </Await>
    </Suspense>
  );
}

/**
 * @typedef {Object} FooterProps
 * @property {Promise<FooterQuery|null>} footer
 * @property {HeaderQuery} header
 * @property {string} publicStoreDomain
 */

/** @typedef {import('storefrontapi.generated').FooterQuery} FooterQuery */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
