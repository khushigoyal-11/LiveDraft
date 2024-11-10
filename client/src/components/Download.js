import React, { useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Download = () => {
  const { roomId } = useParams();

  useEffect(() => {
    const downloadText = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/download/${roomId}`,
          {
            responseType: "blob",
          }
        );
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "text.txt");
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (err) {
        console.error("Error downloading text:", err);
      }
    };

    downloadText();
  }, [roomId]);

  return (
    <div>
      <h1>Downloading...</h1>
    </div>
  );
};

export default Download;
