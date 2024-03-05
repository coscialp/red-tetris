function NotFound() {

  return (
    <>
      <div style={
        {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          fontFamily: "sans-serif",
        }
      }>
        <h1>
          😭
        </h1>
        <h1>
          404
        </h1>
        <p>Page not found</p>

      </div>
    </>
  );
}

export default NotFound;
