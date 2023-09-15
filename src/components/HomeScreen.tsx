import reloadSfx from "../assets/sound/reload.mp3";

interface HomeScreenInterface {
  playAudio: (clip: string) => void;
}

const HomeScreen = ({ playAudio }: HomeScreenInterface) => {
  const handleStartGame = () => {
    const homeScreen = document.querySelector("#home-screen") as HTMLElement;
    homeScreen.classList.add("hide");
    const gameScreen = document.querySelector("#game-screen") as HTMLElement;
    gameScreen.classList.remove("hide");

    // play sound-effect
    playAudio(reloadSfx);

    // animate tile, then remove animation class when completed
    document.querySelectorAll(".tile-instance").forEach((item: Element) => {
      setInterval(() => {
        item.classList.toggle("shine");
      }, 1000);
    });
  };

  return (
    <section id="home-screen" className="page">
      <div className="row">
        <div className="small-12 columns">
          <div className="panel-container">
            <div className="panel center">
              <div className="content">
                <h1>
                  Welcome to <span>The Bee Game</span>
                </h1>
                <p>Click the &apos;Hit a Bee!&apos; button repeatedly.</p>
                <p>
                  Get lucky and hit the Queen enough times to take out the whole
                  Hive at once!
                </p>
                <p>
                  The object is to defeat the Hive in the least amount of hits.
                  Score below 90 hits for a different end rank!
                </p>
                <button className="rounded" onClick={() => handleStartGame()}>
                  Start game
                </button>
              </div>
              <div className="background"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default HomeScreen;
