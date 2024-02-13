import "./register.scss";
import { io, Socket } from "socket.io-client";
import { useEffect, useState } from "react";

function Home() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isError, setIsError] = useState(false);
  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const url = window.location.href;
    const regex = /#(\w+)\[(\w+)]/;
    const matches = url.match(regex);

    if (matches) {
      setRoom(matches[1]);
      setUsername(matches[2])

      setSocket(io(`ws://localhost:3001`, { transports: ['websocket'] }));
    }
    else {
      console.log("Invalid URL");
      setIsError(true);
    }
  }, []);

  if (isError) {
    return (
      <>
        <p>Invalid URL</p>
      </>
    )
  }

  if (!socket) {
    return (
      <>
        <p>Loading...</p>
      </>
    )
  }

  socket.on("connect", () => {
    console.log("Connected to server");
    socket.emit("join", { room, username });
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from server");
  });

  return (
    <>
      <p>Hello there { username }. Welcome to room { room }</p>
    </>
  )
}

export default Home;
