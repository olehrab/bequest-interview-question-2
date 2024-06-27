import React, { useEffect, useState } from "react";
import { ec } from "elliptic";

const API_URL = "http://localhost:8080";
const ecCurve = "secp256k1";

function App() {
  const [data, setData] = useState<string>();
  const [signature, setSignature] = useState<string>();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const response = await fetch(API_URL);
    const { data } = await response.json();
    setData(data);
    setSignature(signature);
  };

  const updateData = async () => {
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ data }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    await getData();
  };

  const verifyData = async () => {
    const ecKey = ec.keyFromPublic(ecCurve, process.env.PUBLIC_KEY);
    const isValid = ecKey.verify(data, signature);
    if (!isValid) {
      console.error("Data has been tampered with!");
      // Request original data from server
      const originalDataResponse = await fetch(API_URL + "/original");
      const originalData = await originalDataResponse.json();
      setData(originalData);
    } else {
      console.log("Data is valid");
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        position: "absolute",
        padding: 0,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "20px",
        fontSize: "30px",
      }}
    >
      <div>Saved Data</div>
      <input
        style={{ fontSize: "30px" }}
        type="text"
        value={data}
        onChange={(e) => setData(e.target.value)}
      />

      <div style={{ display: "flex", gap: "10px" }}>
        <button style={{ fontSize: "20px" }} onClick={updateData}>
          Update Data
        </button>
        <button style={{ fontSize: "20px" }} onClick={verifyData}>
          Verify Data
        </button>
      </div>
    </div>
  );
}

export default App;
