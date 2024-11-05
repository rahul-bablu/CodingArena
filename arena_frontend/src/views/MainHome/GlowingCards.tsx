import "./glowing-card.css";
const GlowingCards = () => {
  return (
    <div style={{backgroundColor: 'var(--bg-color)',paddingBlock: '100px'}}>

    <div className="__theme-change-dark" style={{margin: 'auto', width: 'max-content', }}>
    <div
      
      onMouseMove={(e) => {
        for (const date of document.getElementsByClassName(
          "box"
        ) as HTMLCollectionOf<HTMLElement>) {
          const rect = date.getBoundingClientRect(),
            x = e.clientX - rect.left,
            y = e.clientY - rect.top;

          date.style.setProperty("--mouse-x", `${x}px`);
          date.style.setProperty("--mouse-y", `${y}px`);
        }
      }}
    >
      <div className="container">
        {/* <div style={{backgroundColor: 'var(--text-color)', opacity: 0.1}}> */}

        <div className="box">
          <div className="box-content">Lorem Ipsum</div>
        </div>
        {/* </div> */}
        <div className="box">
          <div className="box-content">Lorem Ipsum</div>
        </div>
        <div className="box">
          <div className="box-content">Lorem Ipsum</div>
        </div>
        <div className="box">
          <div className="box-content">Lorem Ipsum</div>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
};

export default GlowingCards;
