import React, { useEffect, useRef } from "react";
import "codemirror/mode/javascript/javascript";
import "codemirror/theme/dracula.css";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import "codemirror/lib/codemirror.css";
import CodeMirror from "codemirror";
import axios from "axios"; // For API requests
import { ACTIONS } from "../Actions";

function Editor({ socketRef, roomId, onCodeChange }) {
  const editorRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      const editor = CodeMirror.fromTextArea(
        document.getElementById("realtimeEditor"),
        {
          mode: { name: "javascript", json: true },
          theme: "dracula",
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
          scrollbarStyle: null, // Remove scrollbar
          lineWrapping: true, // Wrap long lines
        }
      );
      editorRef.current = editor;
      // Set editor size
      editor.setSize(null, "100%");

      // Handle changes in the editor
      editorRef.current.on("change", (instance, changes) => {
        const { origin } = changes;
        const code = instance.getValue();
        onCodeChange(code);
        if (origin !== "setValue") {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code,
          });
        }
      });

      // Fetch initial code from MongoDB
      try {
        const response = await axios.get(
          `http://localhost:5000/download/${roomId}`
        );
        if (response.status === 200 && response.data) {
          editor.setValue(response.data); // Set the pre-written code in the editor
        } else {
          console.log("Room does not exist or has no pre-written code.");
        }
      } catch (err) {
        console.error("Error fetching code:", err);
      }
    };

    init();
  }, [roomId, socketRef, onCodeChange]);

  // Listen for changes from the server and update the editor
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null && code !== editorRef.current.getValue()) {
          editorRef.current.setValue(code);
        }
      });
    }
    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    };
  }, [socketRef.current]);

  return (
    <div style={{ height: "750px", overflow: "hidden" }}>
      <textarea id="realtimeEditor"></textarea>
    </div>
  );
}

export default Editor;
