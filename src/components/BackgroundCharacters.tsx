import queenBeeImage from "../assets/images/queen-bee.svg";
import workerBeeImage from "../assets/images/worker-bee.svg";
import droneBeeImage from "../assets/images/drone-bee.svg";

const BackgroundCharacters = () => {
    return (
      <>
        <figure className="bee-character">
          <img src={queenBeeImage} alt="Queen Bee" />
        </figure>
        <figure className="bee-character">
          <img src={workerBeeImage} alt="Worker Bee" />
        </figure>
        <figure className="bee-character">
          <img src={droneBeeImage} alt="Drone Bee" />
        </figure>
      </>
    );
  };
  export default BackgroundCharacters;