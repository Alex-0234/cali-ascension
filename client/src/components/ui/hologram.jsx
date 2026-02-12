import './hologram.css'

const Hologram = ({ videoSrc }) => {
  return (
    <div className="video-container" >
      <video
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        className="hologram-video"
        // Přidáme klíč, aby se video restartovalo při změně zdroje
        key={videoSrc} 
      />
    </div>
  );
};

export default Hologram;