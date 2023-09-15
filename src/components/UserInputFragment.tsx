import { MutableRefObject } from "react";

import reloadSfx from "../assets/sound/reload.mp3";
import swatSfx from "../assets/sound/swat.mp3";
import deadBeeSfx from "../assets/sound/dead_bee.mp3";
import hitQueenSfx from "../assets/sound/hit_queen.mp3";
import youWinSfx from "../assets/sound/you_win.mp3";

interface UserInputFragmentInterface {
  setHitCounter: (value: number) => void;
  pauseAudio: (clip: string) => void;
  playAudio: (clip: string) => void;
  queenBeeImpactRef: MutableRefObject<HTMLElement | null>;
  setGameOver: (value: boolean) => void;
  hitCounter: number;
  gameOver: boolean;
}

const UserInputFragment = ({
  setHitCounter,
  pauseAudio,
  playAudio,
  queenBeeImpactRef,
  setGameOver,
  hitCounter,
  gameOver,
}: UserInputFragmentInterface) => {
  const handleHitBeeClick = () => {
    // update hitCount
    setHitCounter(hitCounter + 1);

    // calculate 'hive' array - find tile-instances not disabled
    const hive = document.querySelectorAll(
      "#gameplay .tile-instance:not(.disabled)"
    );
    const singleBee = hive[Math.floor(Math.random() * hive.length)];

    // standard tile-instance calculations
    const thisCounter = singleBee.querySelector(
      ".counter span:first-of-type"
    ) as Element;
    const thisNumber = Number(thisCounter.innerHTML);

    // animate bee when hit, then remove animation class when completed
    singleBee.classList.add("activated", "wobble");
    const finishWobble = () => {
      singleBee.classList.remove("wobble");
    };
    singleBee.addEventListener("transitionend", finishWobble);

    switch (true) {
      // Queen Bee increment only if not disabled
      case singleBee.matches("#queen-bee") &&
        !singleBee.classList.contains("disabled"):
        // pause sound-effect
        pauseAudio(swatSfx);
        // play sound-effect
        playAudio(hitQueenSfx);

        thisCounter.innerHTML = (thisNumber - 8).toString();

        // update impact animation
        if (queenBeeImpactRef.current) {
          const queenBeeImpact = queenBeeImpactRef.current;
          // animate bee when hit, then remove transition class when completed
          queenBeeImpact.classList.add("animate");
          const finishAnimate = () => {
            queenBeeImpact.classList.remove("animate");
          };
          queenBeeImpact.addEventListener("transitionend", finishAnimate);
        }
        break;
      // Worker Bee increment only if not disabled
      case singleBee.matches(".worker-bee") &&
        !singleBee.classList.contains("disabled"):
        // play sound-effect
        playAudio(swatSfx);

        thisCounter.innerHTML = (thisNumber - 10).toString();
        break;
      // Drone Bee increment only if not disabled
      case singleBee.matches(".drone-bee") &&
        !singleBee.classList.contains("disabled"):
        // play sound-effect
        playAudio(swatSfx);

        thisCounter.innerHTML = (thisNumber - 12).toString();
        break;
      default:
    }

    // Kill bee
    if (Number(thisCounter.innerHTML) <= 0) {
      // Game over
      if (singleBee.matches("#queen-bee")) {
        // update game state
        setGameOver(true);

        // pause sound-effect
        pauseAudio(hitQueenSfx);
        pauseAudio(swatSfx);
        // play sound-effect
        playAudio(youWinSfx);

        // kill all remaining bees
        document.querySelectorAll(".tile-instance").forEach((item: Element) => {
          item.classList.add("activated", "disabled");
          item.classList.remove("wobble");
          const thisCounter = item.querySelector(
            ".counter span:first-of-type"
          ) as Element;
          thisCounter.innerHTML = "Defeated!";
        });
      } else {
        // pause sound-effect
        pauseAudio(swatSfx);
        // play sound-effect
        playAudio(deadBeeSfx);

        singleBee.classList.add("disabled");
        singleBee.classList.remove("wobble");
        thisCounter.innerHTML = "Defeated!";
      }
    }
  };

  const handleRestartGame = () => {
    // update game state
    setGameOver(false);
    // update hitCount
    setHitCounter(0);

    const queenBeeSpan = document.querySelector(
      "#queen-bee .counter span:first-of-type"
    ) as Element;
    queenBeeSpan.innerHTML = "100";

    document
      .querySelectorAll(".worker-bee .counter span:first-of-type")
      .forEach((item: Element) => {
        item.innerHTML = "75";
      });

    document
      .querySelectorAll(".drone-bee .counter span:first-of-type")
      .forEach((item: Element) => {
        item.innerHTML = "50";
      });

    // update impact animation
    if (queenBeeImpactRef.current) {
      const queenBeeImpact = queenBeeImpactRef.current;
      queenBeeImpact.classList.remove("animate");
    }

    // remove animation classes, fade in tiles
    document.querySelectorAll(".tile-instance").forEach((item: Element) => {
      item.classList.remove("activated", "disabled");
    });

    // play sound-effect
    playAudio(reloadSfx);
  };

  return (
    <>
      <div className="hit-bee">
        <div className="hit-counter">
          Hit count: <span>{hitCounter}</span>
        </div>
        {!gameOver && (
          <button onClick={() => handleHitBeeClick()}>Hit a Bee!</button>
        )}
      </div>
      {gameOver && (
        <div className="restart center">
          <p className="winning-message">
            {hitCounter < 90 && "RANK: SWAT-KING"}
            {hitCounter >= 90 && "RANK: AMATEUR BEE CLEANER"}
          </p>
          <button className="rounded" onClick={() => handleRestartGame()}>
            Restart game?
          </button>
        </div>
      )}
    </>
  );
};
export default UserInputFragment;
