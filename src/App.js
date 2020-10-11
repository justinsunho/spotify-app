import React from "react";

function App() {
    return (
        <div className="App">
            <a
                href={`https://accounts.spotify.com/authorize?response_type=token&client_id=${encodeURIComponent(
                    process.env.REACT_APP_SPOTIFY_CLIENT_ID
                )}&redirect_uri=http://localhost:3000`}
            >
                Button
            </a>
        </div>
    );
}

export default App;
