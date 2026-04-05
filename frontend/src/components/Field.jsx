import { useState } from "react";

function Field() {
  const [inputValue, setInputValue] = useState("");
  const [items, setItems] = useState([]);
  const handleAdd = async () => {
    const response = await fetch("http://localhost:5080/api/words", {
      method: "POST",
      headers: { "content-Type": "application/json" },
      body: JSON.stringify({ text: inputValue }),
    });

    if (response.ok) {
      setItems([...items, inputValue]);
      setInputValue("");
    }
  };
  return (
    <div>
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      ></input>{" "}
      <button onClick={handleAdd}>Add</button>
      <ul>
        {items.map((item) => {
          return <li>{item}</li>;
        })}
      </ul>
    </div>
  );
}

export default Field;
