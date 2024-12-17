/* import {useEffect, useState} from 'react';
import Pagetitle from '~/components/PageTitle';

function Cellule({className, onClick}) {
  return (
    <button className={`rounded-full ${className}`} onClick={onClick}></button>
  );
}

export default function Examen({savedColor = ''}) {
  const colors = ['bg-green-700', 'bg-yellow-500', 'bg-red-700'];
  const cellules = [];
  const savedCellules = [];
  const savedColors = [];
  const [savedPatterns, setSavedPatterns] = useState([]);

  const [currentCellColor, setCurrentCellColor] = useState(
    new Array(cellules.length).fill(colors[0]),
  );

  const [currentSavedColor, setCurrentSavedColor] = useState(
    new Array(cellules.length).fill(savedColors[0]),
  );

  const switchColor = (id) => {
    const newCellColor = [...currentCellColor];
    const currentColorIndex = colors.indexOf(newCellColor[id]);
    const nextColorIndex = (currentColorIndex + 1) % colors.length;
    newCellColor[id] = colors[nextColorIndex];
    setCurrentCellColor(newCellColor);
  };

  useEffect(() => {
    const savedPattern = JSON.parse(localStorage.getItem('Pattern'));
    if (savedPattern) {
      setCurrentSavedColor(savedPattern);
      setCurrentCellColor(savedPattern);
    }
  }, []);

  const savePattern = () => {
    //localStorage.setItem('Pattern', JSON.stringify(currentCellColor));
    setCurrentSavedColor(currentCellColor);
    savedPatterns.push(currentCellColor);

    setSavedPatterns([...savedPatterns]);
    console.log(savedPatterns);
  };

  const reset = () => {
    setCurrentCellColor(new Array(cellules.length).fill(colors[0]));
  };

  for (let i = 0; i < 9; i++) {
    cellules.push(
      <Cellule
        className={`${currentCellColor[i]} cursor-pointer w-[60px] h-[60px] hover:opacity-[80%]`}
        onClick={() => {
          switchColor(i);
        }}
      />,
    );

    savedCellules.push(
      <Cellule className={`${currentSavedColor[i]} w-[25px] h-[25px]`} />,
    );

    for (let i = 0; i < savedPatterns.length; i++) {}
  }

  return (
    <div className="flex flex-col gap-12 items-center justify-center p-12">
      <Pagetitle title={'Examen'} />
      <div className="flex gap-6">
        <button className="underline cursor-pointer" onClick={savePattern}>
          SAVE
        </button>
        <button className="underline cursor-pointer" onClick={reset}>
          RESET
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4">{cellules}</div>
      <div className="flex flex-col gap-6 items-center justify-center">
        <h2 className="font-light text-sm">Pattern Sauvegardé</h2>
        <div className="grid grid-cols-3 gap-2 items-center justify-center">
          {savedPatterns}
        </div>
      </div>
    </div>
  );
}
 */
