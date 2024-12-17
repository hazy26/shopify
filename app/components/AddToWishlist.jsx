import {useEffect, useState} from 'react';
import {FaRegStar, FaStar} from 'react-icons/fa';
import Cookies from 'js-cookie';

export default function AddToWishlist({productId}) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const wishlist = getWishlist();

    setIsActive(wishlist[productId] === true);
  }, [productId]);

  function getWishlist() {
    return JSON.parse(Cookies.get('wishlist') ?? '{}');
  }

  function setWishlist(wishlist) {
    Cookies.set('wishlist', JSON.stringify(wishlist), {
      expires: 7,
      sameSite: 'strict',
    });
  }

  function onAdd(e) {
    e.preventDefault();
    const wishlist = getWishlist();

    wishlist[productId] = true;
    setWishlist(wishlist);
    setIsActive(true);
  }

  function onRemove(e) {
    e.preventDefault();
    const wishlist = getWishlist();

    delete wishlist[productId];
    setWishlist(wishlist);
    setIsActive(false);
  }

  return isActive ? (
    <button onClick={onRemove} className="cursor-pointer self-center">
      <FaStar size={'30px'} />
    </button>
  ) : (
    <button onClick={onAdd} className="cursor-pointer self-center">
      <FaRegStar size={'30px'} />
    </button>
  );
}
