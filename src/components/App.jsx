import React, { useState, useEffect } from "react";
import "./App.css";
import { GoogleGenerativeAI } from "@google/generative-ai";

const getAIResponse = async (message) => {
  try {
    const genAI = new GoogleGenerativeAI(
      "AIzaSyCNt8TIrSmLOUXCjSjy7XcvbUWq6YelJNI"
    );
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(message);
    return result.response.text();
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return "Sorry, something went wrong! Try using VPN.";
  }
};

const Library = () => {
  const [Input, SetInput] = useState("");
  const [Topics, Settopics] = useState(() => {
    const storedTopics = localStorage.getItem("topics");
    return storedTopics ? JSON.parse(storedTopics) : [];
  });

  useEffect(() => {
    localStorage.setItem("topics", JSON.stringify(Topics));
  }, [Topics]);

  const [Response, GetResponse] = useState(() => {
    const storedResponse = localStorage.getItem("response");
    return storedResponse ? JSON.parse(storedResponse) : "";
  });

  useEffect(() => {
    localStorage.setItem("response", JSON.stringify(Response));
  }, [Response]);

  function AddTopic() {
    if (!Input.trim() || Topics.includes(Input)) return;
    Settopics([...Topics, Input]);
    SetInput("");
  }

  function DelTopic(x) {
    Settopics(Topics.filter((item) => item !== x));
  }

  async function Generate() {
    if (Topics.length === 0) {
      GetResponse("Please add at least one topic!");
      return;
    }

    GetResponse("Generating recommendations...");

    const aiResponse = await getAIResponse(
      `(Use Html Tags to break lines and style the text, Use h2 as biggest. Do not wrap with html or triple backticks.) Suggest some books relevant to these topics: ${Topics.join(
        ", "
      )}`
    );
    GetResponse(aiResponse);
  }

  return (
    <div className="app">
      <div className="header">
        <img src="/LibraryPro/library-pro-logo.png" alt="Library Pro Logo" />
        <p>Library Pro</p>
      </div>
      <div className="body">
        <div className="input-bar">
          <input
            type="text"
            placeholder="e.g. romance"
            value={Input}
            onChange={(e) => SetInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                AddTopic();
              }
            }}
          />
          <div className="add-tag" onClick={AddTopic}>
            + Add Tag
          </div>
        </div>

        <div className="topics">
          <h2>Interested Topics:</h2>
          <ul>
            {Topics.map((x, index) => (
              <li key={index}>
                <div className="topic">
                  <p>{x}</p>
                  <button onClick={() => DelTopic(x)}>×</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="banner">
          <div className="banner-content">
            <h2>Ready for your book?</h2>
            <p>Get a book suggestion based on your interests.</p>
          </div>
          <button className="generate" onClick={Generate}>
            Get Suggestion
          </button>
        </div>

        <div
          className="output"
          dangerouslySetInnerHTML={{ __html: Response }}
        />
      </div>
    </div>
  );
};

export default Library;
