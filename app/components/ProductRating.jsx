import {useEffect, useState} from 'react';

export default function ProductRating({defaultValue = 1}) {
  const ratingBtns = [];
  const [currentRating, setCurrentRating] = useState(defaultValue);

  useEffect(() => {
    setCurrentRating(localStorage.getItem('rating') ?? defaultValue);
  }, [defaultValue]);

  for (let i = 1; i <= 5; i++) {
    ratingBtns.push(
      <button
        onClick={() => {
          setCurrentRating(i);
          localStorage.setItem('rating', i);
        }}
        className={`${
          parseInt(currentRating) === i ? 'bg-primary' : 'bg-white'
        } w-[20px] h-[20px] border-1 border-primary rounded-full cursor-pointer`}
      ></button>,
    );
  }
  return (
    <div className="flex flex-col gap-2 items-center">
      <h3 className="font-medium tracking-wide">Évaluer le produit:</h3>
      <div className="flex gap-3 self-center">
        {ratingBtns}
        <span>{currentRating}</span>
      </div>
    </div>
  );
}
