import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchFavorites, updateFavoriteComment } from "../store/favoritesSlice";
import { useNavigate } from "react-router-dom";

const Favorites = () => {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);
  const status = useAppSelector((state) => state.favorites.status);
  const token = useAppSelector((state) => state.user.token);
  const navigate = useNavigate();
  // generated-by-copilot: local comment state keyed by bookId for controlled textarea
  const [comments, setComments] = useState({});

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    dispatch(fetchFavorites(token));
  }, [dispatch, token, navigate]);

  useEffect(() => {
    const initial = {};
    favorites.forEach((f) => {
      initial[f.id] = f.comment || "";
    });
    setComments(initial);
  }, [favorites]);

  if (status === "loading") return <div>Loading...</div>;
  if (status === "failed") return <div>Failed to load favorites.</div>;

  return (
    <div>
      <h2>My Favorite Books</h2>
      {favorites.length === 0 ? (
        <div
          style={{
            background: "#fff",
            padding: "2rem",
            borderRadius: "8px",
            maxWidth: "400px",
            margin: "2rem auto",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            textAlign: "center",
            color: "#888",
          }}
        >
          <p>No favorite books yet.</p>
          <p>
            Go to the{" "}
            <a
              href="/books"
              onClick={(e) => {
                e.preventDefault();
                navigate("/books");
              }}
            >
              book list
            </a>{" "}
            to add some!
          </p>
        </div>
      ) : (
        <ul>
          {favorites.map((book) => (
            <li key={book.id}>
              <strong>{book.title}</strong> by {book.author}
              <br />
              {/* generated-by-copilot: inline comment textarea, saves on blur */}
              <textarea
                rows={2}
                placeholder="Add a comment..."
                value={comments[book.id] ?? ""}
                onChange={(e) =>
                  setComments((prev) => ({
                    ...prev,
                    [book.id]: e.target.value,
                  }))
                }
                onBlur={() =>
                  dispatch(
                    updateFavoriteComment({
                      token,
                      bookId: book.id,
                      comment: comments[book.id] ?? "",
                    })
                  )
                }
                style={{
                  marginTop: "0.4rem",
                  width: "100%",
                  resize: "none",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  padding: "0.4rem",
                  fontFamily: "inherit",
                  fontSize: "0.9rem",
                }}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Favorites;
