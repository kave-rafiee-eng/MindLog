import { useEffect, useRef, useState } from "react";

export function WebSocketTest() {
  const socketRef = useRef(null);
  const [data, setData] = useState("");

  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:3001");
    socketRef.current.binaryType = "arraybuffer";
    socketRef.current.onopen = () => {
      console.log("connected to server");
      //socketRef.current.send("hello server");
    };

    socketRef.current.onmessage = (event) => {
      console.log("server:");
      console.log(event.data);

      const bytes = new Uint8Array(event.data);
      console.log(bytes);
      //setData(event.data);
    };

    socketRef.current.onclose = () => {
      console.log("disconnected");
    };

    socketRef.current.onerror = (err) => {
      console.log("error:", err);
    };

    return () => {
      socketRef.current.close();
    };
  }, []);

  const sendData = () => {
    console.log("sendData");
    const pId = 0x01;
    const add = 0x01;
    const type = 0x00;
    const rA = 0x01;
    const crcL = 0x00;
    const crcH = 0x00;

    const bytes = new Uint8Array([pId, add, type, rA, crcL, crcH]);
    socketRef.current.send(bytes);
  };

  return (
    <div>
      <h2>WebSocket Test</h2>
      <div>server msg: {data}</div>

      <button onClick={() => sendData()}>send</button>
    </div>
  );
}
