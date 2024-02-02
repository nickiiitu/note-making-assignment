import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
const Home = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
    getNotes();
  }, []);

  const [data, setData] = useState({
    title: "",
    desc: "",
  });
  const [error, setError] = useState("");
  const [notes, setNotes] = useState([]);
  const noteRef = useRef(null);

  const handleChange = (e) => {
    setError("");
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const getNotes = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/notes/${user._id}`
      );

      if (res.data) {
        setNotes(res.data);
      } else {
        handleLogout();
      }
    } catch (error) {
      handleLogout();
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data.title === "") {
      setError("Title can't be empty");
    } else if (data.desc === "") {
      setError("Desc can't be empty");
    } else {
      try {
        const res = await axios.post("http://localhost:5000/api/notes", {
          ...data,
          id: user._id,
        });
        if (res.data) {
          getNotes();
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setData({
          title: "",
          desc: "",
        });
      }
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };
  const handleDelete = async (e) => {
    try {
      const res = await axios.delete(
        `http://localhost:5000/api/notes/${e._id}`
      );
      if (res.data) {
        getNotes();
      }
    } catch (error) {}
  };
  return (
    <div>
      {/* header */}
      <div className="header-div flex justify-between px-4 font-bold">
        <div className="text-center items-center flex ">
          <p className="text-white text-xl">Stable Money Notes Making App</p>
        </div>
        <div>
          <button
            className="border rounded font-bold my-2 mt-4 p-2 color-blue text-white"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
      {/* addNotes */}
      <div className="add-notes flex justify-center" id="note" ref={noteRef}>
        <form className="flex flex-col w-1/2">
          <label htmlFor="title" className="font-bold my-2">
            Title
          </label>
          <input
            id="title"
            onChange={handleChange}
            name="title"
            className="border rounded border-black p-1"
            value={data.title || ""}
            required
          ></input>
          <label htmlFor="desc" className="font-bold my-2">
            Description
          </label>
          <textarea
            id="desc"
            required
            onChange={handleChange}
            name="desc"
            className="border rounded border-black p-1"
            value={data.desc || ""}
          ></textarea>
          <button
            className="border rounded font-bold my-2 mt-4 p-2 color-blue text-white"
            type="submit"
            onClick={handleSubmit}
          >
            Add
          </button>
          {error && <span className="text-red-600 font-semibold">{error}</span>}
        </form>
      </div>
      {/* displayNotes */}
      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl-grid-cols-4 2xl-grid-cols-5 mb-4">
          {notes.map((e, i) => {
            return (
              <div
                className="rounded shadow-lg mx-2 max-sm:my-2"
                key={i}
              >
                <div className="px-2 py-4 text-center max-sm:w-full">
                  <div
                    className="font-bold text-xl mb-2 text-white color-blue py-2 rounded 
                    flex 
                  px-4
                  "
                  >
                    <div className="w-5/6">{e.title}</div>

                    <div className="w-1/6 flex justify-between">
                      <span
                        className="cursor-pointer"
                        title="Delete"
                        onClick={() => handleDelete(e)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </span>
                      <span
                        className="cursor-pointer "
                        title="Edit"
                        onClick={() => {
                          setData({
                            title: e.title,
                            desc: e.desc,
                            noteId: e._id,
                          });
                          noteRef.current.scrollIntoView({
                            behavior: "smooth",
                          });
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-700 text-base">{e.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      
    </div>
  );
};

export default Home;
