export const LableTitle = ({ title }: { title: string }) => {
  return (
    <div
      style={{
        fontWeight: 800,
        margin: "0px auto",
        textAlign: "center",
        fontSize: "20px",
        fontFamily: '"M PLUS Rounded 1c", sans-serif',
        width: "80%",
        paddingBlock: "15px",
      }}
    >
      {title}
    </div>
  );
};

export const Badge = ({ value }: { value: string }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      padding: "3px 10px",
      borderRadius: "4px",
      textTransform: "uppercase",
      color: "#fff",
      // backgroundColor: "#4a90e2",
      backgroundColor: "rgb(18 156 27)",
      // width: '-moz-fit-content',
      width: "fit-content",
      fontWeight: 500,
      fontSize: "12px",
      lineHeight: "16px",
    }}
  >
    <span>{value}</span>
  </div>
);
