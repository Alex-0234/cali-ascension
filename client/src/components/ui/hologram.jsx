
const Hologram = ({ videoSrc }) => {
  return (
    <div className="video-container" >
      <video
        height='auto'
        width='50%'
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        className="hologram-video"
        key={videoSrc} 
      />
    </div>
  );
};

export default Hologram;