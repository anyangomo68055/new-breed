// App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "./App.css";

const SERVER_CONFIG = {
  HOST: "localhost",
  PORT: "5000",
  get BASE_URL() {
    return `http://${this.HOST}:${this.PORT}`;
  },
};

// Enhanced AudioPlayer component
function AudioPlayer({ audio, darkMode }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      setCurrentTime(current);
      setProgress((current / audioRef.current.duration) * 100);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(100);
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e) => {
    if (audioRef.current) {
      const rect = e.target.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      audioRef.current.currentTime = percent * audioRef.current.duration;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div
      style={{
        background: darkMode ? "#2d2d2d" : "#f5f5f5",
        borderRadius: "8px",
        padding: "1rem",
        marginTop: "1rem",
      }}
    >
      <audio
        ref={audioRef}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        preload="metadata"
        style={{ display: "none" }}
      >
        <source src={audio.url} type="audio/mpeg" />
        <source src={audio.url} type="audio/wav" />
        <source src={audio.url} type="audio/ogg" />
        Your browser does not support the audio element.
      </audio>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "1rem",
          gap: "1rem",
        }}
      >
        <i
          className="fas fa-music"
          style={{
            fontSize: "2rem",
            color: "#1a4b84",
            minWidth: "40px",
          }}
        ></i>
        <div style={{ flex: 1 }}>
          <h4
            style={{
              margin: "0 0 0.5rem 0",
              color: darkMode ? "#f0f0f0" : "#333",
            }}
          >
            {audio.title}
          </h4>
          <p
            style={{
              margin: 0,
              color: darkMode ? "#ccc" : "#666",
              fontSize: "0.9rem",
            }}
          >
            {audio.speaker} | {audio.date}
          </p>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <button
          onClick={togglePlay}
          style={{
            background: "#1a4b84",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <i className={`fas fa-${isPlaying ? "pause" : "play"}`}></i>
        </button>

        <span
          style={{
            fontSize: "0.8rem",
            color: darkMode ? "#ccc" : "#666",
            minWidth: "50px",
          }}
        >
          {formatTime(currentTime)}
        </span>

        <div
          style={{
            flex: 1,
            height: "6px",
            background: darkMode ? "#444" : "#ddd",
            borderRadius: "3px",
            cursor: "pointer",
            position: "relative",
          }}
          onClick={handleSeek}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: "#1a4b84",
              borderRadius: "3px",
            }}
          />
        </div>

        <span
          style={{
            fontSize: "0.8rem",
            color: darkMode ? "#ccc" : "#666",
            minWidth: "50px",
            textAlign: "right",
          }}
        >
          {formatTime(duration)}
        </span>

        <button
          onClick={toggleMute}
          style={{
            background: "transparent",
            color: darkMode ? "#ccc" : "#666",
            border: "none",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          <i className={`fas fa-volume-${isMuted ? "mute" : "up"}`}></i>
        </button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
          style={{
            width: "60px",
          }}
        />
      </div>

      <p
        style={{
          fontSize: "0.9rem",
          color: "#666",
          marginTop: "0.5rem",
          fontStyle: "italic",
        }}
      >
        {audio.url.includes(SERVER_CONFIG.HOST)
          ? "Uploaded audio - may take a moment to load"
          : "Sample audio for demonstration"}
      </p>
    </div>
  );
}

// Enhanced VideoPlayer component
function VideoPlayer({ video, darkMode }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setProgress(
        (videoRef.current.currentTime / videoRef.current.duration) * 100
      );
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(100);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (e) => {
    if (videoRef.current) {
      const rect = e.target.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = percent * videoRef.current.duration;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div
      style={{
        background: darkMode ? "#2d2d2d" : "#f5f5f5",
        borderRadius: "8px",
        padding: "1rem",
        marginTop: "1rem",
      }}
    >
      <video
        ref={videoRef}
        style={{
          width: "100%",
          borderRadius: "8px",
          maxHeight: "400px",
          display: "block",
        }}
        poster={video.thumbnail}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        preload="metadata"
      >
        <source src={video.url} type="video/mp4" />
        <source src={video.url} type="video/webm" />
        Your browser does not support the video tag.
      </video>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: "0.5rem",
          gap: "0.5rem",
        }}
      >
        <button
          onClick={togglePlay}
          style={{
            background: "#1a4b84",
            color: "white",
            border: "none",
            borderRadius: "4px",
            padding: "0.5rem 1rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
          }}
        >
          <i className={`fas fa-${isPlaying ? "pause" : "play"}`}></i>
          {isPlaying ? "Pause" : "Play"}
        </button>

        <span
          style={{
            fontSize: "0.8rem",
            color: darkMode ? "#ccc" : "#666",
            minWidth: "80px",
          }}
        >
          {formatTime((progress / 100) * duration)}
        </span>

        <div
          style={{
            flex: 1,
            height: "6px",
            background: darkMode ? "#444" : "#ddd",
            borderRadius: "3px",
            cursor: "pointer",
            position: "relative",
          }}
          onClick={handleSeek}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: "#1a4b84",
              borderRadius: "3px",
            }}
          />
        </div>

        <span
          style={{
            fontSize: "0.8rem",
            color: darkMode ? "#ccc" : "#666",
            minWidth: "60px",
            textAlign: "right",
          }}
        >
          {formatTime(duration)}
        </span>

        <button
          onClick={toggleMute}
          style={{
            background: "transparent",
            color: darkMode ? "#ccc" : "#666",
            border: "none",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          <i className={`fas fa-volume-${isMuted ? "mute" : "up"}`}></i>
        </button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
          style={{
            width: "60px",
          }}
        />
      </div>

      <p
        style={{
          fontSize: "0.9rem",
          color: "#666",
          marginTop: "0.5rem",
          fontStyle: "italic",
        }}
      >
        {video.url.includes(SERVER_CONFIG.HOST)
          ? "Uploaded video - may take a moment to load"
          : "Sample video for demonstration"}
      </p>
    </div>
  );
}

// Home Component
function Home({ currentImage, darkMode }) {
  const heroBannerStyle = {
    textAlign: "center",
    padding: "3rem 1rem",
    color: "white",
    borderRadius: "10px",
    marginBottom: "2rem",
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${currentImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    transition: "background-image 1s ease-in-out",
  };

  const ctaButtonStyle = {
    backgroundColor: "#f4c430",
    color: "#1a4b84",
    border: "none",
    padding: "1rem 2rem",
    fontSize: "1.1rem",
    borderRadius: "50px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    fontWeight: "bold",
  };

  const featuresStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "2rem",
    marginTop: "3rem",
  };

  const featureCardStyle = {
    background: darkMode ? "#2d2d2d" : "white",
    padding: "2rem",
    borderRadius: "10px",
    textAlign: "center",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "all 0.3s ease",
    color: darkMode ? "#f0f0f0" : "#333",
  };

  return (
    <div style={{ animation: "fadeIn 0.5s ease-in" }}>
      <div style={heroBannerStyle}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
          Welcome to THE NEW BREED MINISTRIES WORLDWIDE
        </h1>
        <p style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>
          Transforming lives through the power of God's Word
        </p>
        <button style={ctaButtonStyle}>Join Us This Sunday</button>
      </div>

      <div style={featuresStyle}>
        <div style={featureCardStyle}>
          <i
            className="fas fa-church"
            style={{ fontSize: "3rem", color: "#1a4b84", marginBottom: "1rem" }}
          ></i>
          <h3 style={{ color: "#1a4b84", marginBottom: "1rem" }}>
            Worship Services
          </h3>
          <p>Sundays at 9:00 AM & 11:00 AM</p>
        </div>
        <div style={featureCardStyle}>
          <i
            className="fas fa-book-bible"
            style={{ fontSize: "3rem", color: "#1a4b84", marginBottom: "1rem" }}
          ></i>
          <h3 style={{ color: "#1a4b84", marginBottom: "1rem" }}>
            Bible Study
          </h3>
          <p>Wednesdays at 7:00 PM</p>
        </div>
        <div style={featureCardStyle}>
          <i
            className="fas fa-hands-helping"
            style={{ fontSize: "3rem", color: "#1a4b84", marginBottom: "1rem" }}
          ></i>
          <h3 style={{ color: "#1a4b84", marginBottom: "1rem" }}>
            Community Outreach
          </h3>
          <p>Making a difference in our community</p>
        </div>
      </div>
    </div>
  );
}

// About Component
function About({ darkMode }) {
  const aboutContentStyle = {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "2rem",
    marginTop: "2rem",
  };

  const aboutImageStyle = {
    width: "100%",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  };

  return (
    <div
      style={{
        animation: "fadeIn 0.5s ease-in",
        color: darkMode ? "#f0f0f0" : "#333",
      }}
    >
      <h2>About Our Ministry</h2>
      <div style={aboutContentStyle}>
        <div>
          <p>
            THE NEW BREED MINISTRIES WORLDWIDE was founded in 2020 with a
            mission to spread the Gospel and make disciples of all nations. We
            believe in the transformative power of God's Word and the work of
            the Holy Spirit.
          </p>
          <p>
            Our church is committed to serving the community, supporting
            families, and helping individuals grow in their relationship with
            Christ.
          </p>
          <h3 style={{ color: "#1a4b84", margin: "1.5rem 0 1rem" }}>
            Our Beliefs
          </h3>
          <ul style={{ listStylePosition: "inside", marginLeft: "1rem" }}>
            <li>We believe in the Trinity: Father, Son, and Holy Spirit</li>
            <li>We believe in the authority of Scripture</li>
            <li>We believe in salvation through Jesus Christ alone</li>
            <li>We believe in the power of prayer</li>
            <li>We believe in the Great Commission</li>
          </ul>
        </div>
        <div>
          <img
            src="https://images.unsplash.com/photo-1505506874110-6a7a69069a08?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
            alt="Church Building"
            style={aboutImageStyle}
          />
        </div>
      </div>
    </div>
  );
}

// Mission Component
function Mission({ darkMode }) {
  const missionContentStyle = {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "2rem",
    marginTop: "2rem",
  };

  const missionImageStyle = {
    width: "100%",
    borderRadius: "8px",
    marginBottom: "1.5rem",
  };

  return (
    <div
      style={{
        animation: "fadeIn 0.5s ease-in",
        color: darkMode ? "#f0f0f0" : "#333",
      }}
    >
      <h2>Our Mission</h2>
      <div style={missionContentStyle}>
        <div>
          <h3>The Great Commission</h3>
          <p>
            "Therefore go and make disciples of all nations, baptizing them in
            the name of the Father and of the Son and of the Holy Spirit, and
            teaching them to obey everything I have commanded you. And surely I
            am with you always, to the very end of the age." - Matthew 28:19-20
          </p>

          <h3>Our Mission Statement</h3>
          <p>
            THE NEW BREED MINISTRIES WORLDWIDE exists to glorify God by making
            disciples of all nations through the proclamation of the Gospel, the
            teaching of God's Word, and the demonstration of God's love in
            practical ways.
          </p>

          <h3>Our Core Objectives</h3>
          <ul style={{ color: darkMode ? "#f0f0f0" : "#333" }}>
            <li>
              <strong>Evangelism:</strong> To share the good news of Jesus
              Christ with everyone we encounter
            </li>
            <li>
              <strong>Discipleship:</strong> To help believers grow in their
              faith and become mature followers of Christ
            </li>
            <li>
              <strong>Worship:</strong> To glorify God through heartfelt worship
              and obedience
            </li>
            <li>
              <strong>Fellowship:</strong> To build a loving community where
              believers can encourage and support one another
            </li>
            <li>
              <strong>Service:</strong> To demonstrate God's love by serving our
              community and meeting practical needs
            </li>
          </ul>
        </div>
        <div>
          <img
            src="https://images.unsplash.com/photo-1542401886-65d6b61b4335?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
            alt="Mission Work"
            style={missionImageStyle}
          />
        </div>
      </div>
    </div>
  );
}

// Vision Component
function Vision({ darkMode }) {
  const visionContentStyle = {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "2rem",
    marginTop: "2rem",
  };

  const visionImageStyle = {
    width: "100%",
    borderRadius: "8px",
    marginBottom: "1.5rem",
  };

  return (
    <div
      style={{
        animation: "fadeIn 0.5s ease-in",
        color: darkMode ? "#f0f0f0" : "#333",
      }}
    >
      <h2>Our Vision</h2>
      <div style={visionContentStyle}>
        <div>
          <h3>Kingdom Vision</h3>
          <p>"Where there is no vision, the people perish." - Proverbs 29:18</p>

          <h3>Our Vision Statement</h3>
          <p>
            To be a transformative force in our world by raising up a new breed
            of believers who are grounded in God's Word, empowered by the Holy
            Spirit, and committed to advancing God's Kingdom in every sphere of
            society.
          </p>

          <h3>Our Future Direction</h3>
          <ul style={{ color: darkMode ? "#f0f0f0" : "#333" }}>
            <li>
              <strong>Spiritual Renewal:</strong> To see individuals, families,
              and communities transformed by the power of the Gospel
            </li>
            <li>
              <strong>Church Planting:</strong> To establish vibrant,
              reproducing churches in every community
            </li>
            <li>
              <strong>Leadership Development:</strong> To equip and empower the
              next generation of Christian leaders
            </li>
            <li>
              <strong>Cultural Impact:</strong> To positively influence every
              sector of society with Biblical values
            </li>
            <li>
              <strong>Global Reach:</strong> To extend our ministry impact to
              nations around the world
            </li>
          </ul>
        </div>
        <div>
          <img
            src="https://images.unsplash.com/photo-1542382257-80dedb725088?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
            alt="Vision for Future"
            style={visionImageStyle}
          />
        </div>
      </div>
    </div>
  );
}

// Commission Component
function Commission({ darkMode }) {
  const commissionContentStyle = {
    marginTop: "2rem",
  };

  const mandateCardStyle = {
    background: darkMode ? "#2d2d2d" : "white",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
    marginBottom: "2rem",
    color: darkMode ? "#f0f0f0" : "#333",
    border: "2px solid #f4c430",
  };

  const scriptureQuoteStyle = {
    background: darkMode ? "#1a4b84" : "#f0f8ff",
    padding: "1.5rem",
    borderRadius: "8px",
    margin: "1.5rem 0",
    fontStyle: "italic",
    fontSize: "1.1rem",
    borderLeft: "4px solid transparent",
    color: darkMode ? "white" : "#1a4b84",
  };

  const mandateListStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "1.5rem",
    marginTop: "2rem",
  };

  const mandateItemStyle = {
    background: darkMode ? "#3a3a3a" : "#f8f9fa",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    color: darkMode ? "#f0f0f0" : "#333",
  };

  return (
    <div
      style={{
        animation: "fadeIn 0.5s ease-in",
        color: darkMode ? "#f0f0f0" : "#333",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>
        The Great Commission Mandate
      </h2>
      <div style={commissionContentStyle}>
        <div style={mandateCardStyle}>
          <h3
            style={{
              color: "#1a4b84",
              textAlign: "center",
              fontSize: "2rem",
              marginBottom: "1rem",
            }}
          >
            Our Divine Mandate
          </h3>
          <div style={scriptureQuoteStyle}>
            "And Jesus came and spoke to them, saying, 'All authority has been
            given to Me in heaven and on earth. Go therefore and make disciples
            of all the nations, baptizing them in the name of the Father and of
            the Son and of the Holy Spirit, teaching them to observe all things
            that I have commanded you; and lo, I am with you always, even to the
            end of the age.' Amen."
            <br />
            <strong>- Matthew 28:18-20 (NKJV)</strong>
          </div>

          <h4 style={{ color: "#1a4b84", margin: "2rem 0 1rem" }}>
            The Five-Fold Commission
          </h4>
          <div style={mandateListStyle}>
            <div style={mandateItemStyle}>
              <h5 style={{ color: "#1a4b84", marginBottom: "1rem" }}>
                <i
                  className="fas fa-crown"
                  style={{ marginRight: "0.5rem" }}
                ></i>
                1. AUTHORITY
              </h5>
              <p>"All authority has been given to Me in heaven and on earth"</p>
              <p>
                <strong>Our Response:</strong> We operate under Christ's supreme
                authority, knowing that every power in heaven and earth is
                subject to Him.
              </p>
            </div>

            <div style={mandateItemStyle}>
              <h5 style={{ color: "#1a4b84", marginBottom: "1rem" }}>
                <i
                  className="fas fa-walking"
                  style={{ marginRight: "0.5rem" }}
                ></i>
                2. GO
              </h5>
              <p>"Go therefore..."</p>
              <p>
                <strong>Our Response:</strong> We are called to be mobile
                missionaries, not stationary spectators. Every believer is
                commissioned to GO and share the Gospel.
              </p>
            </div>

            <div style={mandateItemStyle}>
              <h5 style={{ color: "#1a4b84", marginBottom: "1rem" }}>
                <i
                  className="fas fa-user-graduate"
                  style={{ marginRight: "0.5rem" }}
                ></i>
                3. MAKE DISCIPLES
              </h5>
              <p>"...and make disciples of all the nations"</p>
              <p>
                <strong>Our Response:</strong> Our goal is not just conversion
                but transformation - creating mature followers of Christ who can
                reproduce themselves.
              </p>
            </div>

            <div style={mandateItemStyle}>
              <h5 style={{ color: "#1a4b84", marginBottom: "1rem" }}>
                <i
                  className="fas fa-cross"
                  style={{ marginRight: "0.5rem" }}
                ></i>
                4. BAPTIZE
              </h5>
              <p>
                "...baptizing them in the name of the Father and of the Son and
                of the Holy Spirit"
              </p>
              <p>
                <strong>Our Response:</strong> We practice water baptism as a
                public declaration of faith and identification with Christ's
                death and resurrection.
              </p>
            </div>

            <div style={mandateItemStyle}>
              <h5 style={{ color: "#1a4b84", marginBottom: "1rem" }}>
                <i
                  className="fas fa-book-open"
                  style={{ marginRight: "0.5rem" }}
                ></i>
                5. TEACH
              </h5>
              <p>
                "...teaching them to observe all things that I have commanded
                you"
              </p>
              <p>
                <strong>Our Response:</strong> We are committed to comprehensive
                biblical education and practical obedience to Christ's
                teachings.
              </p>
            </div>

            <div style={mandateItemStyle}>
              <h5 style={{ color: "#1a4b84", marginBottom: "1rem" }}>
                <i
                  className="fas fa-hands-praying"
                  style={{ marginRight: "0.5rem" }}
                ></i>
                6. DIVINE PRESENCE
              </h5>
              <p>
                "...and lo, I am with you always, even to the end of the age"
              </p>
              <p>
                <strong>Our Promise:</strong> We never go alone. Christ's
                presence empowers and sustains us in every aspect of ministry
                until He returns.
              </p>
            </div>
          </div>
        </div>

        <div style={mandateCardStyle}>
          <h3 style={{ color: "#1a4b84", marginBottom: "1rem" }}>
            Our Commission Implementation
          </h3>
          <div style={{ marginBottom: "1.5rem" }}>
            <h4 style={{ color: "#1a4b84" }}>Local Outreach</h4>
            <ul>
              <li>House-to-house evangelism in our community</li>
              <li>Street witnessing and public proclamation</li>
              <li>Community service projects and social outreach</li>
              <li>Prison ministry and hospital visitation</li>
            </ul>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <h4 style={{ color: "#1a4b84" }}>National Impact</h4>
            <ul>
              <li>Church planting in unreached areas</li>
              <li>Leadership training and mentorship programs</li>
              <li>Youth and children's ministry expansion</li>
              <li>Media evangelism and digital outreach</li>
            </ul>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <h4 style={{ color: "#1a4b84" }}>International Missions</h4>
            <ul>
              <li>Cross-cultural missionary sending</li>
              <li>International church partnerships</li>
              <li>Humanitarian aid and development</li>
              <li>Bible translation and distribution</li>
            </ul>
          </div>
        </div>

        <div style={scriptureQuoteStyle}>
          "The harvest truly is plentiful, but the laborers are few. Therefore
          pray the Lord of the harvest to send out laborers into His harvest."
          <br />
          <strong>- Matthew 9:37-38</strong>
        </div>

        <div style={{ ...mandateCardStyle, textAlign: "center" }}>
          <h3 style={{ color: "#1a4b84", marginBottom: "1rem" }}>
            Join The Commission
          </h3>
          <p style={{ fontSize: "1.1rem", marginBottom: "2rem" }}>
            Every believer is called to participate in the Great Commission.
            Whether you're called to go across the street or across the ocean,
            God has a role for you in His global mission.
          </p>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              style={{
                backgroundColor: "#1a4b84",
                color: "white",
                border: "none",
                padding: "1rem 2rem",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Volunteer for Missions
            </button>
            <button
              style={{
                backgroundColor: "#f4c430",
                color: "#1a4b84",
                border: "none",
                padding: "1rem 2rem",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Support Missionaries
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// BibleSearch Component
function BibleSearch({ bibleData, loading, error, fetchBibleData, darkMode }) {
  const [book, setBook] = useState("John");
  const [chapter, setChapter] = useState(3);
  const [verse, setVerse] = useState(16);

  const booksOfBible = [
    "Genesis",
    "Exodus",
    "Leviticus",
    "Numbers",
    "Deuteronomy",
    "Joshua",
    "Judges",
    "Ruth",
    "1 Samuel",
    "2 Samuel",
    "1 Kings",
    "2 Kings",
    "1 Chronicles",
    "2 Chronicles",
    "Ezra",
    "Nehemiah",
    "Esther",
    "Job",
    "Psalms",
    "Proverbs",
    "Ecclesiastes",
    "Song of Solomon",
    "Isaiah",
    "Jeremiah",
    "Lamentations",
    "Ezekiel",
    "Daniel",
    "Hosea",
    "Joel",
    "Amos",
    "Obadiah",
    "Jonah",
    "Micah",
    "Nahum",
    "Habakkuk",
    "Zephaniah",
    "Haggai",
    "Zechariah",
    "Malachi",
    "Matthew",
    "Mark",
    "Luke",
    "John",
    "Acts",
    "Romans",
    "1 Corinthians",
    "2 Corinthians",
    "Galatians",
    "Ephesians",
    "Philippians",
    "Colossians",
    "1 Thessalonians",
    "2 Thessalonians",
    "1 Timothy",
    "2 Timothy",
    "Titus",
    "Philemon",
    "Hebrews",
    "James",
    "1 Peter",
    "2 Peter",
    "1 John",
    "2 John",
    "3 John",
    "Jude",
    "Revelation",
  ];

  const handleSearch = () => {
    fetchBibleData(book, chapter, verse);
  };

  const searchControlsStyle = {
    display: "flex",
    gap: "1rem",
    marginBottom: "2rem",
    flexWrap: "wrap",
  };

  const searchInputStyle = {
    padding: "0.8rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "1rem",
    backgroundColor: darkMode ? "#2d2d2d" : "white",
    color: darkMode ? "#f0f0f0" : "#333",
  };

  const searchButtonStyle = {
    backgroundColor: "#1a4b84",
    color: "white",
    border: "none",
    padding: "0.8rem 1.5rem",
    borderRadius: "4px",
    cursor: "pointer",
  };

  const bibleVerseStyle = {
    background: darkMode ? "#2d2d2d" : "white",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    marginBottom: "1rem",
    color: darkMode ? "#f0f0f0" : "#333",
  };

  const booksGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: "1rem",
    marginTop: "1rem",
  };

  const bookItemStyle = {
    background: darkMode ? "#2d2d2d" : "white",
    padding: "1rem",
    borderRadius: "4px",
    textAlign: "center",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
    transition: "all 0.3s ease",
    color: darkMode ? "#f0f0f0" : "#333",
  };

  return (
    <div
      style={{
        animation: "fadeIn 0.5s ease-in",
        color: darkMode ? "#f0f0f0" : "#333",
      }}
    >
      <h2>Bible Search</h2>
      <div>
        <div style={searchControlsStyle}>
          <select
            value={book}
            onChange={(e) => setBook(e.target.value)}
            style={searchInputStyle}
          >
            {booksOfBible.map((book) => (
              <option key={book} value={book}>
                {book}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={chapter}
            onChange={(e) => setChapter(parseInt(e.target.value))}
            min="1"
            placeholder="Chapter"
            style={searchInputStyle}
          />
          <input
            type="number"
            value={verse}
            onChange={(e) => setVerse(parseInt(e.target.value))}
            min="1"
            placeholder="Verse"
            style={searchInputStyle}
          />
          <button onClick={handleSearch} style={searchButtonStyle}>
            Search
          </button>
        </div>

        <div>
          {loading && <p>Loading Bible verse...</p>}
          {error && (
            <p style={{ color: "#d9534f", fontWeight: "bold" }}>
              Error: {error}
            </p>
          )}
          {bibleData && !loading && (
            <div style={bibleVerseStyle}>
              <h3 style={{ color: "#1a4b84", marginBottom: "0.5rem" }}>
                {bibleData.reference}
              </h3>
              <p
                style={{
                  fontSize: "1.1rem",
                  lineHeight: "1.8",
                  marginBottom: "1rem",
                }}
              >
                {bibleData.text}
              </p>
              <p style={{ fontStyle: "italic", color: "#666" }}>
                Translation: {bibleData.translation_name}
              </p>
            </div>
          )}
          {!bibleData && !loading && !error && (
            <p>Use the search controls to find Bible verses</p>
          )}
        </div>

        <div>
          <h3 style={{ color: "#1a4b84", marginBottom: "1rem" }}>
            Books of the Bible
          </h3>
          <div style={booksGridStyle}>
            {booksOfBible.map((book) => (
              <div
                key={book}
                style={bookItemStyle}
                onClick={() => setBook(book)}
              >
                {book}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// BibleStudy Component
function BibleStudy({ darkMode }) {
  const bibleStudyContentStyle = {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "2rem",
    marginTop: "2rem",
  };

  const topicListStyle = {
    marginTop: "1rem",
  };

  const topicItemStyle = {
    background: darkMode ? "#2d2d2d" : "white",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    marginBottom: "1rem",
    color: darkMode ? "#f0f0f0" : "#333",
  };

  const studyResourcesStyle = {
    background: darkMode ? "#2d2d2d" : "white",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    height: "fit-content",
    color: darkMode ? "#f0f0f0" : "#333",
  };

  return (
    <div
      style={{
        animation: "fadeIn 0.5s ease-in",
        color: darkMode ? "#f0f0f0" : "#333",
      }}
    >
      <h2>Bible Study</h2>
      <div style={bibleStudyContentStyle}>
        <div>
          <h3>Weekly Study Topics</h3>
          <div style={topicListStyle}>
            <div style={topicItemStyle}>
              <h4 style={{ color: "#1a4b84", marginBottom: "0.5rem" }}>
                The Power of Prayer
              </h4>
              <p>Wednesdays at 7:00 PM</p>
              <p>
                Join us as we explore the importance of prayer in the Christian
                life.
              </p>
            </div>
            <div style={topicItemStyle}>
              <h4 style={{ color: "#1a4b84", marginBottom: "0.5rem" }}>
                Understanding Grace
              </h4>
              <p>Thursdays at 6:30 PM</p>
              <p>
                A deep dive into the concept of God's grace and how it
                transforms us.
              </p>
            </div>
            <div style={topicItemStyle}>
              <h4 style={{ color: "#1a4b84", marginBottom: "0.5rem" }}>
                Walking in Faith
              </h4>
              <p>Saturdays at 10:00 AM</p>
              <p>Learning to trust God in every circumstance of life.</p>
            </div>
          </div>
        </div>

        <div style={studyResourcesStyle}>
          <h3 style={{ color: "#1a4b84", marginBottom: "1rem" }}>
            Study Resources
          </h3>
          <ul style={{ listStylePosition: "inside" }}>
            <li>Downloadable study guides</li>
            <li>Audio recordings of past studies</li>
            <li>Recommended reading lists</li>
            <li>Online discussion forums</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// CommunityOutreach Component
function CommunityOutreach({ darkMode }) {
  const outreachContentStyle = {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "2rem",
    marginTop: "2rem",
  };

  const programGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "1.5rem",
    marginTop: "1rem",
  };

  const programItemStyle = {
    background: darkMode ? "#2d2d2d" : "white",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    color: darkMode ? "#f0f0f0" : "#333",
  };

  const volunteerFormStyle = {
    background: darkMode ? "#2d2d2d" : "white",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    height: "fit-content",
    color: darkMode ? "#f0f0f0" : "#333",
  };

  const formInputStyle = {
    width: "100%",
    padding: "0.8rem",
    marginBottom: "1rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "1rem",
    backgroundColor: darkMode ? "#1a1a1a" : "white",
    color: darkMode ? "#f0f0f0" : "#333",
  };

  return (
    <div
      style={{
        animation: "fadeIn 0.5s ease-in",
        color: darkMode ? "#f0f0f0" : "#333",
      }}
    >
      <h2>Community Outreach</h2>
      <div style={outreachContentStyle}>
        <div>
          <h3>Our Programs</h3>
          <div style={programGridStyle}>
            <div style={programItemStyle}>
              <h4 style={{ color: "#1a4b84", marginBottom: "0.5rem" }}>
                Food Pantry
              </h4>
              <p>Every Saturday 9AM-12PM</p>
              <p>Providing groceries for families in need</p>
            </div>
            <div style={programItemStyle}>
              <h4 style={{ color: "#1a4b84", marginBottom: "0.5rem" }}>
                Youth Mentoring
              </h4>
              <p>Mondays and Wednesdays 4PM-6PM</p>
              <p>Positive role models for at-risk youth</p>
            </div>
            <div style={programItemStyle}>
              <h4 style={{ color: "#1a4b84", marginBottom: "0.5rem" }}>
                Senior Visitation
              </h4>
              <p>Twice monthly</p>
              <p>Companionship and assistance for elderly community members</p>
            </div>
            <div style={programItemStyle}>
              <h4 style={{ color: "#1a4b84", marginBottom: "0.5rem" }}>
                Community Cleanup
              </h4>
              <p>First Saturday of each month</p>
              <p>Beautifying our neighborhood together</p>
            </div>
          </div>
        </div>

        <div style={volunteerFormStyle}>
          <h3 style={{ color: "#1a4b84", marginBottom: "1rem" }}>
            Volunteer Opportunities
          </h3>
          <form>
            <input type="text" placeholder="Your Name" style={formInputStyle} />
            <input
              type="email"
              placeholder="Your Email"
              style={formInputStyle}
            />
            <select style={formInputStyle}>
              <option>Select Program</option>
              <option>Food Pantry</option>
              <option>Youth Mentoring</option>
              <option>Senior Visitation</option>
              <option>Community Cleanup</option>
            </select>
            <textarea
              placeholder="Why are you interested in volunteering?"
              style={{
                ...formInputStyle,
                minHeight: "100px",
                resize: "vertical",
              }}
            ></textarea>
            <button
              type="submit"
              style={{
                backgroundColor: "#1a4b84",
                color: "white",
                border: "none",
                padding: "0.8rem 1.5rem",
                borderRadius: "4px",
                cursor: "pointer",
                width: "100%",
              }}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Gallery Component
function Gallery({ darkMode }) {
  const [images, setImages] = useState([
    "https://images.unsplash.com/photo-1505506874110-6a7a69069a08?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1534337621606-e3df5ee0e97f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    "https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
  ]);
  const [uploadStatus, setUploadStatus] = useState("");

  // Load persistent images on component mount
  useEffect(() => {
    const loadImages = async () => {
      if (SERVER_CONFIG.HOST === "localhost") {
        try {
          const response = await fetch(`${SERVER_CONFIG.BASE_URL}/api/images`);
          if (response.ok) {
            const data = await response.json();
            const imageUrls = data.map(
              (img) => `${SERVER_CONFIG.BASE_URL}${img.path}`
            );
            setImages((prev) => [...prev, ...imageUrls]);
          }
        } catch (error) {
          console.log("Server not available, using default images");
        }
      }
    };

    loadImages();
  }, []);

  // Enhanced upload function with better error handling
  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const file = formData.get("image");

    if (!file || file.size === 0) {
      setUploadStatus("Please select a file first");
      return;
    }

    try {
      setUploadStatus("Uploading...");

      const response = await fetch(
        `${SERVER_CONFIG.BASE_URL}/api/upload/image`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUploadStatus("Upload successful!");
        setImages((prev) => [
          ...prev,
          `${SERVER_CONFIG.BASE_URL}${data.file.path}`,
        ]);
        e.target.reset();
      } else {
        const errorData = await response.text();
        setUploadStatus(`Upload failed: ${errorData}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus(
        "Upload failed: Server not available. Please check your backend connection."
      );
    }
  };

  const galleryContentStyle = {
    marginTop: "2rem",
  };

  const uploadSectionStyle = {
    background: darkMode ? "#2d2d2d" : "white",
    padding: "2rem",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    marginBottom: "2rem",
    color: darkMode ? "#f0f0f0" : "#333",
  };

  const formInputStyle = {
    width: "100%",
    padding: "1rem",
    marginBottom: "1rem",
    border: "2px solid #e1e8ed",
    borderRadius: "8px",
    fontSize: "1rem",
    backgroundColor: darkMode ? "#1a1a1a" : "white",
    color: darkMode ? "#f0f0f0" : "#333",
  };

  const uploadButtonStyle = {
    background: "linear-gradient(135deg, #1a4b84 0%, #2c6eb5 100%)",
    color: "white",
    border: "none",
    padding: "1rem 2rem",
    borderRadius: "8px",
    fontSize: "1.1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginTop: "1rem",
    width: "100%",
  };

  const galleryGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "1.5rem",
    marginTop: "2rem",
  };

  const galleryItemStyle = {
    position: "relative",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    height: "250px",
    transition: "all 0.3s ease",
  };

  const galleryImageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.3s ease",
  };

  return (
    <div
      style={{
        animation: "fadeIn 0.5s ease-in",
        color: darkMode ? "#f0f0f0" : "#333",
      }}
    >
      <h2>Photo Gallery</h2>
      <div style={galleryContentStyle}>
        <div style={uploadSectionStyle}>
          <h3
            style={{
              color: "#1a4b84",
              marginBottom: "1.5rem",
              textAlign: "center",
              fontSize: "1.5rem",
            }}
          >
            Upload Image
          </h3>
          <form onSubmit={handleUpload}>
            <input
              type="file"
              name="image"
              accept="image/*"
              required
              style={formInputStyle}
            />
            <input
              type="text"
              name="title"
              placeholder="Image Title"
              style={formInputStyle}
            />
            <textarea
              name="description"
              placeholder="Image Description"
              style={{
                ...formInputStyle,
                minHeight: "100px",
                resize: "vertical",
              }}
            ></textarea>
            <button type="submit" style={uploadButtonStyle}>
              Upload
            </button>
          </form>
          {uploadStatus && (
            <p
              style={{
                padding: "1rem",
                borderRadius: "8px",
                marginTop: "1rem",
                textAlign: "center",
                fontWeight: "500",
                backgroundColor: uploadStatus.includes("success")
                  ? "#d4edda"
                  : uploadStatus.includes("failed")
                  ? "#f8d7da"
                  : "#cce5ff",
                color: uploadStatus.includes("success")
                  ? "#155724"
                  : uploadStatus.includes("failed")
                  ? "#721c24"
                  : "#004085",
                border: uploadStatus.includes("success")
                  ? "1px solid #c3e6cb"
                  : uploadStatus.includes("failed")
                  ? "1px solid #f5c6cb"
                  : "1px solid #b8daff",
              }}
            >
              {uploadStatus}
            </p>
          )}
        </div>

        <div style={galleryGridStyle}>
          {images.map((img, index) => (
            <div key={index} style={galleryItemStyle}>
              <img
                src={img}
                alt={`Church event ${index + 1}`}
                style={galleryImageStyle}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Sermons Component
function Sermons({ darkMode }) {
  const [uploadStatus, setUploadStatus] = useState("");
  const [videos, setVideos] = useState([
    {
      title: "The Power of Faith",
      pastor: "Pastor John Smith",
      date: "June 12, 2023",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      thumbnail:
        "https://images.unsplash.com/photo-1505506874110-6a7a69069a08?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    },
    {
      title: "Walking in Grace",
      pastor: "Pastor Sarah Johnson",
      date: "June 5, 2023",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      thumbnail:
        "https://images.unsplash.com/photo-1534337621606-e3df5ee0e97f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    },
    {
      title: "Finding Peace in Troubled Times",
      pastor: "Pastor John Smith",
      date: "May 29, 2023",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      thumbnail:
        "https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    },
  ]);

  // Load persistent videos on component mount
  useEffect(() => {
    const loadVideos = async () => {
      if (SERVER_CONFIG.HOST === "localhost") {
        try {
          const response = await fetch(`${SERVER_CONFIG.BASE_URL}/api/videos`);
          if (response.ok) {
            const data = await response.json();
            const videoData = data.map((video) => ({
              title: video.originalName || "Uploaded Sermon",
              pastor: "Unknown Pastor",
              date: new Date(video.uploadDate).toLocaleDateString(),
              url: `${SERVER_CONFIG.BASE_URL}${video.path}`,
              thumbnail:
                "https://images.unsplash.com/photo-1588072432839-8ffd4625f87d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            }));
            setVideos((prev) => [...prev, ...videoData]);
          }
        } catch (error) {
          console.log("Server not available, using default videos");
        }
      }
    };

    loadVideos();
  }, []);

  // Enhanced upload function
  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const file = formData.get("video");

    if (!file || file.size === 0) {
      setUploadStatus("Please select a file first");
      return;
    }

    try {
      setUploadStatus("Uploading...");

      const response = await fetch(
        `${SERVER_CONFIG.BASE_URL}/api/upload/video`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUploadStatus("Upload successful!");
        setVideos((prev) => [
          ...prev,
          {
            title: formData.get("title") || "New Sermon",
            pastor: formData.get("pastor") || "Guest Preacher",
            date: formData.get("date") || new Date().toLocaleDateString(),
            url: `${SERVER_CONFIG.BASE_URL}${data.file.path}`,
            thumbnail:
              "https://images.unsplash.com/photo-1588072432839-8ffd4625f87d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          },
        ]);
        e.target.reset();
      } else {
        const errorData = await response.text();
        setUploadStatus(`Upload failed: ${errorData}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus(
        "Upload failed: Server not available. Please check your backend connection."
      );
    }
  };

  const sermonsContentStyle = {
    marginTop: "2rem",
  };

  const uploadSectionStyle = {
    background: darkMode ? "#2d2d2d" : "white",
    padding: "2rem",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    marginBottom: "2rem",
    color: darkMode ? "#f0f0f0" : "#333",
  };

  const formInputStyle = {
    width: "100%",
    padding: "1rem",
    marginBottom: "1rem",
    border: "2px solid #e1e8ed",
    borderRadius: "8px",
    fontSize: "1rem",
    backgroundColor: darkMode ? "#1a1a1a" : "white",
    color: darkMode ? "#f0f0f0" : "#333",
  };

  const uploadButtonStyle = {
    background: "linear-gradient(135deg, #1a4b84 0%, #2c6eb5 100%)",
    color: "white",
    border: "none",
    padding: "1rem 2rem",
    borderRadius: "8px",
    fontSize: "1.1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginTop: "1rem",
    width: "100%",
  };

  const sermonsListStyle = {
    marginTop: "2rem",
  };

  const sermonItemStyle = {
    background: darkMode ? "#2d2d2d" : "white",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    marginBottom: "2rem",
    overflow: "hidden",
    transition: "all 0.3s ease",
    color: darkMode ? "#f0f0f0" : "#333",
  };

  const sermonDetailsStyle = {
    padding: "2rem",
  };

  return (
    <div
      style={{
        animation: "fadeIn 0.5s ease-in",
        color: darkMode ? "#f0f0f0" : "#333",
      }}
    >
      <h2>Video Sermons</h2>
      <div style={sermonsContentStyle}>
        <div style={uploadSectionStyle}>
          <h3
            style={{
              color: "#1a4b84",
              marginBottom: "1.5rem",
              textAlign: "center",
              fontSize: "1.5rem",
            }}
          >
            Upload Video Sermon
          </h3>
          <form onSubmit={handleUpload}>
            <input
              type="text"
              name="title"
              placeholder="Sermon Title"
              required
              style={formInputStyle}
            />
            <input
              type="text"
              name="pastor"
              placeholder="Preacher's Name"
              required
              style={formInputStyle}
            />
            <input type="date" name="date" required style={formInputStyle} />
            <input
              type="file"
              name="video"
              accept="video/*"
              required
              style={formInputStyle}
            />
            <button type="submit" style={uploadButtonStyle}>
              Upload
            </button>
          </form>
          {uploadStatus && (
            <p
              style={{
                padding: "1rem",
                borderRadius: "8px",
                marginTop: "1rem",
                textAlign: "center",
                fontWeight: "500",
                backgroundColor: uploadStatus.includes("success")
                  ? "#d4edda"
                  : uploadStatus.includes("failed")
                  ? "#f8d7da"
                  : "#cce5ff",
                color: uploadStatus.includes("success")
                  ? "#155724"
                  : uploadStatus.includes("failed")
                  ? "#721c24"
                  : "#004085",
                border: uploadStatus.includes("success")
                  ? "1px solid #c3e6cb"
                  : uploadStatus.includes("failed")
                  ? "1px solid #f5c6cb"
                  : "1px solid #b8daff",
              }}
            >
              {uploadStatus}
            </p>
          )}
        </div>

        <div style={sermonsListStyle}>
          {videos.map((video, index) => (
            <div key={index} style={sermonItemStyle}>
              <div style={sermonDetailsStyle}>
                <h3
                  style={{
                    color: "#1a4b84",
                    marginBottom: "0.8rem",
                    fontSize: "1.4rem",
                  }}
                >
                  {video.title}
                </h3>
                <p style={{ color: "#666", marginBottom: "1rem" }}>
                  {video.pastor} | {video.date}
                </p>
                <VideoPlayer video={video} darkMode={darkMode} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// AudioSermons Component
function AudioSermons({ darkMode }) {
  const [uploadStatus, setUploadStatus] = useState("");
  const [audios, setAudios] = useState([
    {
      title: "The Foundation of Faith",
      speaker: "Pastor Michael Brown",
      date: "December 15, 2024",
      url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      duration: "45:30",
    },
    {
      title: "Living in God's Grace",
      speaker: "Pastor Sarah Johnson",
      date: "December 8, 2024",
      url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      duration: "38:15",
    },
    {
      title: "Prayer and Fasting",
      speaker: "Prophet David Wilson",
      date: "December 1, 2024",
      url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
      duration: "52:22",
    },
  ]);

  // Load persistent audio files on component mount
  useEffect(() => {
    const loadAudios = async () => {
      if (SERVER_CONFIG.HOST === "localhost") {
        try {
          const response = await fetch(`${SERVER_CONFIG.BASE_URL}/api/audios`);
          if (response.ok) {
            const data = await response.json();
            const audioData = data.map((audio) => ({
              title: audio.originalName || "Uploaded Audio",
              speaker: "Unknown Speaker",
              date: new Date(audio.uploadDate).toLocaleDateString(),
              url: `${SERVER_CONFIG.BASE_URL}${audio.path}`,
              duration: "Unknown",
            }));
            setAudios((prev) => [...prev, ...audioData]);
          }
        } catch (error) {
          console.log("Server not available, using default audio files");
        }
      }
    };

    loadAudios();
  }, []);

  // Enhanced audio upload function
  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const file = formData.get("audio");

    if (!file || file.size === 0) {
      setUploadStatus("Please select an audio file first");
      return;
    }

    // Validate file type
    const validTypes = [
      "audio/mpeg",
      "audio/mp3",
      "audio/wav",
      "audio/ogg",
      "audio/m4a",
    ];
    if (!validTypes.includes(file.type)) {
      setUploadStatus("Please select a valid audio file (MP3, WAV, OGG, M4A)");
      return;
    }

    try {
      setUploadStatus("Uploading audio...");

      const response = await fetch(
        `${SERVER_CONFIG.BASE_URL}/api/upload/audio`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUploadStatus("Upload successful!");
        setAudios((prev) => [
          ...prev,
          {
            title: formData.get("title") || "New Audio Sermon",
            speaker: formData.get("speaker") || "Guest Speaker",
            date: formData.get("date") || new Date().toLocaleDateString(),
            url: `${SERVER_CONFIG.BASE_URL}${data.file.path}`,
            duration: "Unknown",
          },
        ]);
        e.target.reset();
      } else {
        const errorData = await response.text();
        setUploadStatus(`Upload failed: ${errorData}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus(
        "Upload failed: Server not available. Please check your backend connection."
      );
    }
  };

  const audioContentStyle = {
    marginTop: "2rem",
  };

  const uploadSectionStyle = {
    background: darkMode ? "#2d2d2d" : "white",
    padding: "2rem",
    borderRadius: "10px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    marginBottom: "2rem",
    color: darkMode ? "#f0f0f0" : "#333",
  };

  const formInputStyle = {
    width: "100%",
    padding: "1rem",
    marginBottom: "1rem",
    border: "2px solid #e1e8ed",
    borderRadius: "8px",
    fontSize: "1rem",
    backgroundColor: darkMode ? "#1a1a1a" : "white",
    color: darkMode ? "#f0f0f0" : "#333",
  };

  const uploadButtonStyle = {
    background: "linear-gradient(135deg, #1a4b84 0%, #2c6eb5 100%)",
    color: "white",
    border: "none",
    padding: "1rem 2rem",
    borderRadius: "8px",
    fontSize: "1.1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginTop: "1rem",
    width: "100%",
  };

  const audioListStyle = {
    marginTop: "2rem",
  };

  const audioItemStyle = {
    background: darkMode ? "#2d2d2d" : "white",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    marginBottom: "2rem",
    overflow: "hidden",
    transition: "all 0.3s ease",
    color: darkMode ? "#f0f0f0" : "#333",
  };

  const audioDetailsStyle = {
    padding: "2rem",
  };

  return (
    <div
      style={{
        animation: "fadeIn 0.5s ease-in",
        color: darkMode ? "#f0f0f0" : "#333",
      }}
    >
      <h2>Audio Sermons</h2>
      <div style={audioContentStyle}>
        <div style={uploadSectionStyle}>
          <h3
            style={{
              color: "#1a4b84",
              marginBottom: "1.5rem",
              textAlign: "center",
              fontSize: "1.5rem",
            }}
          >
            <i
              className="fas fa-microphone"
              style={{ marginRight: "0.5rem" }}
            ></i>
            Upload Audio Sermon
          </h3>
          <form onSubmit={handleUpload}>
            <input
              type="text"
              name="title"
              placeholder="Sermon/Teaching Title"
              required
              style={formInputStyle}
            />
            <input
              type="text"
              name="speaker"
              placeholder="Speaker/Preacher Name"
              required
              style={formInputStyle}
            />
            <input type="date" name="date" required style={formInputStyle} />
            <input
              type="text"
              name="category"
              placeholder="Category (Sermon, Teaching, Testimony, etc.)"
              style={formInputStyle}
            />
            <textarea
              name="description"
              placeholder="Brief description of the audio content"
              style={{
                ...formInputStyle,
                minHeight: "100px",
                resize: "vertical",
              }}
            ></textarea>
            <input
              type="file"
              name="audio"
              accept="audio/*,.mp3,.wav,.ogg,.m4a"
              required
              style={formInputStyle}
            />
            <div
              style={{
                fontSize: "0.9rem",
                color: darkMode ? "#ccc" : "#666",
                marginBottom: "1rem",
              }}
            >
              Supported formats: MP3, WAV, OGG, M4A (Max size: 100MB)
            </div>
            <button type="submit" style={uploadButtonStyle}>
              <i
                className="fas fa-upload"
                style={{ marginRight: "0.5rem" }}
              ></i>
              Upload Audio
            </button>
          </form>
          {uploadStatus && (
            <p
              style={{
                padding: "1rem",
                borderRadius: "8px",
                marginTop: "1rem",
                textAlign: "center",
                fontWeight: "500",
                backgroundColor: uploadStatus.includes("success")
                  ? "#d4edda"
                  : uploadStatus.includes("failed")
                  ? "#f8d7da"
                  : "#cce5ff",
                color: uploadStatus.includes("success")
                  ? "#155724"
                  : uploadStatus.includes("failed")
                  ? "#721c24"
                  : "#004085",
                border: uploadStatus.includes("success")
                  ? "1px solid #c3e6cb"
                  : uploadStatus.includes("failed")
                  ? "1px solid #f5c6cb"
                  : "1px solid #b8daff",
              }}
            >
              {uploadStatus}
            </p>
          )}
        </div>

        <div style={audioListStyle}>
          <h3 style={{ color: "#1a4b84", marginBottom: "1.5rem" }}>
            <i
              className="fas fa-headphones"
              style={{ marginRight: "0.5rem" }}
            ></i>
            Available Audio Messages
          </h3>
          {audios.map((audio, index) => (
            <div key={index} style={audioItemStyle}>
              <div style={audioDetailsStyle}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <i
                    className="fas fa-play-circle"
                    style={{
                      fontSize: "2rem",
                      color: "#1a4b84",
                      marginRight: "1rem",
                    }}
                  ></i>
                  <div>
                    <h4
                      style={{
                        color: "#1a4b84",
                        marginBottom: "0.5rem",
                        fontSize: "1.3rem",
                      }}
                    >
                      {audio.title}
                    </h4>
                    <p style={{ color: "#666", margin: 0 }}>
                      <i
                        className="fas fa-user"
                        style={{ marginRight: "0.5rem" }}
                      ></i>
                      {audio.speaker} |
                      <i
                        className="fas fa-calendar"
                        style={{ margin: "0 0.5rem" }}
                      ></i>
                      {audio.date} |
                      <i
                        className="fas fa-clock"
                        style={{ margin: "0 0.5rem" }}
                      ></i>
                      {audio.duration}
                    </p>
                  </div>
                </div>
                <AudioPlayer audio={audio} darkMode={darkMode} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ ...uploadSectionStyle, marginTop: "2rem" }}>
          <h3 style={{ color: "#1a4b84", marginBottom: "1rem" }}>
            Audio Ministry Information
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1.5rem",
            }}
          >
            <div>
              <h4 style={{ color: "#1a4b84" }}>Types of Audio Content</h4>
              <ul>
                <li>Sunday Sermons</li>
                <li>Midweek Bible Studies</li>
                <li>Prayer Meeting Messages</li>
                <li>Special Event Teachings</li>
                <li>Testimonies and Life Stories</li>
                <li>Worship and Praise Sessions</li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: "#1a4b84" }}>Audio Quality Guidelines</h4>
              <ul>
                <li>High-quality recordings (44.1kHz/16-bit minimum)</li>
                <li>Clear speech without background noise</li>
                <li>Consistent volume levels</li>
                <li>Professional sound editing when possible</li>
                <li>Multiple format support for compatibility</li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: "#1a4b84" }}>Download & Sharing</h4>
              <ul>
                <li>Free downloads for personal use</li>
                <li>Share with friends and family</li>
                <li>Use in small group studies</li>
                <li>Available on mobile devices</li>
                <li>Offline listening capability</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Contact Component
function Contact({ darkMode }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitStatus, setSubmitStatus] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitStatus("Sending...");
      const response = await fetch(`${SERVER_CONFIG.BASE_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // const data = await response.json();
        setSubmitStatus("Message sent successfully!");
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setSubmitStatus(""), 3000);
      } else {
        const errorData = await response.text();
        setSubmitStatus("Failed to send message: " + errorData);
      }
    } catch (error) {
      setSubmitStatus("Failed to send message: Server not available");
    }
  };

  const contactContentStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 2fr",
    gap: "2rem",
    marginTop: "2rem",
  };

  const contactInfoStyle = {
    background: darkMode ? "#2d2d2d" : "white",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    height: "fit-content",
    color: darkMode ? "#f0f0f0" : "#333",
  };

  const socialLinksStyle = {
    display: "flex",
    gap: "1rem",
    marginTop: "1.5rem",
  };

  const socialLinkStyle = {
    width: "40px",
    height: "40px",
    background: "#1a4b84",
    color: "white",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    transition: "all 0.3s ease",
  };

  const contactFormStyle = {
    background: darkMode ? "#2d2d2d" : "white",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    color: darkMode ? "#f0f0f0" : "#333",
  };

  const formInputStyle = {
    width: "100%",
    padding: "0.8rem",
    marginBottom: "1rem",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "1rem",
    backgroundColor: darkMode ? "#1a1a1a" : "white",
    color: darkMode ? "#f0f0f0" : "#333",
  };

  const statusStyle = {
    padding: "1rem",
    borderRadius: "8px",
    marginTop: "1rem",
    textAlign: "center",
    fontWeight: "500",
    backgroundColor: submitStatus.includes("success")
      ? "#d4edda"
      : submitStatus.includes("Failed")
      ? "#f8d7da"
      : "#cce5ff",
    color: submitStatus.includes("success")
      ? "#155724"
      : submitStatus.includes("Failed")
      ? "#721c24"
      : "#004085",
    border: submitStatus.includes("success")
      ? "1px solid #c3e6cb"
      : submitStatus.includes("Failed")
      ? "1px solid #f5c6cb"
      : "1px solid #b8daff",
  };

  return (
    <div
      style={{
        animation: "fadeIn 0.5s ease-in",
        color: darkMode ? "#f0f0f0" : "#333",
      }}
    >
      <h2>Contact Us</h2>
      <div style={contactContentStyle}>
        <div style={contactInfoStyle}>
          <h3 style={{ color: "#1a4b84", marginBottom: "1rem" }}>
            Get In Touch
          </h3>
          <p
            style={{
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            <i
              className="fas fa-map-marker-alt"
              style={{ marginRight: "0.5rem", color: "#1a4b84" }}
            ></i>
            123 Church Street, City, State 12345
          </p>
          <p
            style={{
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            <i
              className="fas fa-phone"
              style={{ marginRight: "0.5rem", color: "#1a4b84" }}
            ></i>
            (555) 123-4567
          </p>
          <p
            style={{
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            <i
              className="fas fa-envelope"
              style={{ marginRight: "0.5rem", color: "#1a4b84" }}
            ></i>
            info@newbreedministries.org
          </p>

          <h4
            style={{
              color: "#1a4b84",
              marginTop: "2rem",
              marginBottom: "1rem",
            }}
          >
            Service Times
          </h4>
          <p
            style={{
              marginBottom: "0.5rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            <i
              className="fas fa-clock"
              style={{ marginRight: "0.5rem", color: "#1a4b84" }}
            ></i>
            Sunday Service: 9:00 AM & 11:00 AM
          </p>
          <p
            style={{
              marginBottom: "0.5rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            <i
              className="fas fa-clock"
              style={{ marginRight: "0.5rem", color: "#1a4b84" }}
            ></i>
            Wednesday Bible Study: 7:00 PM
          </p>
          <p
            style={{
              marginBottom: "0.5rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            <i
              className="fas fa-clock"
              style={{ marginRight: "0.5rem", color: "#1a4b84" }}
            ></i>
            Friday Prayer Meeting: 6:30 PM
          </p>

          <div style={socialLinksStyle}>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              style={socialLinkStyle}
            >
              <i className="fab fa-facebook"></i>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              style={socialLinkStyle}
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              style={socialLinkStyle}
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              style={socialLinkStyle}
            >
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>

        <form style={contactFormStyle} onSubmit={handleSubmit}>
          <h3 style={{ color: "#1a4b84", marginBottom: "1rem" }}>
            Send us a Message
          </h3>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            style={formInputStyle}
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
            style={formInputStyle}
          />
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
            style={formInputStyle}
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            required
            style={{
              ...formInputStyle,
              minHeight: "150px",
              resize: "vertical",
            }}
          ></textarea>
          <button
            type="submit"
            style={{
              backgroundColor: "#1a4b84",
              color: "white",
              border: "none",
              padding: "0.8rem 1.5rem",
              borderRadius: "4px",
              cursor: "pointer",
              width: "100%",
              fontSize: "1rem",
              fontWeight: "600",
            }}
          >
            <i
              className="fas fa-paper-plane"
              style={{ marginRight: "0.5rem" }}
            ></i>
            Send Message
          </button>

          {submitStatus && <div style={statusStyle}>{submitStatus}</div>}
        </form>
      </div>

      <div
        style={{
          background: darkMode ? "#2d2d2d" : "white",
          padding: "2rem",
          borderRadius: "10px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          marginTop: "2rem",
          textAlign: "center",
          color: darkMode ? "#f0f0f0" : "#333",
        }}
      >
        <h3 style={{ color: "#1a4b84", marginBottom: "1rem" }}>Visit Us</h3>
        <p style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
          We'd love to meet you in person! Join us for any of our services or
          events.
        </p>
        <p style={{ fontStyle: "italic", color: darkMode ? "#ccc" : "#666" }}>
          "For where two or three gather in my name, there am I with them." -
          Matthew 18:20
        </p>
      </div>
    </div>
  );
}

// Header Component
function Header({ darkMode }) {
  const headerStyle = {
    background: darkMode
      ? "linear-gradient(135deg, #0d2b4b 0%, #1a4b84 100%)"
      : "linear-gradient(135deg, #1a4b84 0%, #2c6eb5 100%)",
    color: "white",
    textAlign: "center",
    padding: "2rem 0",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  };

  const headerContentStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 1rem",
  };

  return (
    <header style={headerStyle}>
      <div style={headerContentStyle}>
        <h1
          style={{
            fontSize: "2.5rem",
            marginBottom: "0.5rem",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)",
          }}
        >
          THE NEW BREED MINISTRIES WORLDWIDE
        </h1>
        <p style={{ fontSize: "1.2rem", fontStyle: "italic" }}>
          Transforming Lives Through God's Word
        </p>
      </div>
    </header>
  );
}

// Moving Banner Component
function MovingBanner({ darkMode }) {
  const bannerStyle = {
    backgroundColor: darkMode ? "#2d2d2d" : "#f4c430",
    color: darkMode ? "#f4c430" : "#1a4b84",
    padding: "0.8rem 0",
    overflow: "hidden",
    position: "relative",
    fontWeight: "bold",
    fontSize: "1.2rem",
    borderBottom: darkMode ? "1px solid #444" : "none",
  };

  const bannerContentStyle = {
    display: "inline-block",
    whiteSpace: "nowrap",
    animation: "moveBanner 20s linear infinite",
  };

  return (
    <div style={bannerStyle}>
      <div style={bannerContentStyle}>
        <span>
          "I am the way, the truth, and the life. No one comes to the Father
          except through me." - John 14:6
        </span>
      </div>
    </div>
  );
}

// Navbar Component
function Navbar({ darkMode }) {
  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Mission", path: "/mission" },
    { name: "Vision", path: "/vision" },
    { name: "Commission", path: "/commission" },
    { name: "Bible", path: "/bible" },
    { name: "Bible Study", path: "/bible-study" },
    { name: "Community", path: "/community" },
    { name: "Gallery", path: "/gallery" },
    { name: "Sermons", path: "/sermons" },
    { name: "Audio", path: "/audio" },
    { name: "Contact", path: "/contact" },
  ];

  const navbarStyle = {
    backgroundColor: darkMode ? "#2d2d2d" : "#2c6eb5",
    padding: "0.5rem 0",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    borderBottom: darkMode ? "1px solid #444" : "none",
  };

  const navContainerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 1rem",
  };

  const navListStyle = {
    display: "flex",
    listStyle: "none",
    justifyContent: "center",
    flexWrap: "wrap",
  };

  const navItemStyle = {
    margin: "0 0.5rem",
  };

  const navLinkStyle = {
    background: "none",
    border: "none",
    padding: "0.8rem 1.2rem",
    textDecoration: "none",
    textTransform: "capitalize",
    fontWeight: 500,
    borderRadius: "4px",
    transition: "all 0.3s ease",
    cursor: "pointer",
    backgroundColor: "transparent",
    color: "white",
  };

  return (
    <nav style={navbarStyle}>
      <div style={navContainerStyle}>
        <ul style={navListStyle}>
          {navItems.map((item) => (
            <li key={item.path} style={navItemStyle}>
              <a href={item.path} style={navLinkStyle}>
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

// Footer Component
function Footer({ darkMode }) {
  const footerStyle = {
    background: darkMode ? "#0d2b4b" : "#1a4b84",
    color: "white",
    padding: "2rem 0 0",
    marginTop: "3rem",
    borderTop: darkMode ? "1px solid #444" : "none",
  };

  const footerContentStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 1rem",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "2rem",
  };

  const footerSectionStyle = {
    marginBottom: "1.5rem",
  };

  const socialIconsStyle = {
    display: "flex",
    gap: "1rem",
  };

  const socialIconStyle = {
    color: "white",
    fontSize: "1.5rem",
    transition: "all 0.3s ease",
  };

  const footerBottomStyle = {
    textAlign: "center",
    padding: "1rem 0",
    marginTop: "2rem",
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
  };

  return (
    <footer style={footerStyle}>
      <div style={footerContentStyle}>
        <div style={footerSectionStyle}>
          <h3>THE NEW BREED MINISTRIES WORLDWIDE</h3>
          <p>Transforming lives through the power of God's Word</p>
        </div>
        <div style={footerSectionStyle}>
          <h4>Connect With Us</h4>
          <div style={socialIconsStyle}>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              style={socialIconStyle}
            >
              <i className="fab fa-facebook"></i>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              style={socialIconStyle}
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              style={socialIconStyle}
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              style={socialIconStyle}
            >
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>
        <div style={footerSectionStyle}>
          <h4>Contact Info</h4>
          <p>123 Church Street, City, State 12345</p>
          <p>Phone: (555) 123-4567</p>
          <p>Email: info@newbreedministries.org</p>
        </div>
      </div>
      <div style={footerBottomStyle}>
        <p>
          &copy; {new Date().getFullYear()} THE NEW BREED MINISTRIES WORLDWIDE.
          All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

// Main App Component
function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [serverStatus, setServerStatus] = useState("checking...");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [bibleData, setBibleData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const churchImages = [
    "https://images.unsplash.com/photo-1505506874110-6a7a69069a08?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1534337621606-e3df5ee0e97f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1588072432839-8ffd4625f87d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  ];

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Enhanced server health check with fallback options
  useEffect(() => {
    const checkServerHealth = async () => {
      const endpoints = [
        `${SERVER_CONFIG.BASE_URL}/api/health`,
        `${SERVER_CONFIG.BASE_URL}/health`,
        `http://localhost:5000/api/health`,
        `http://127.0.0.1:5000/api/health`,
      ];

      for (const endpoint of endpoints) {
        try {
          console.log(`Attempting to connect to: ${endpoint}`);

          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000);

          const response = await fetch(endpoint, {
            method: "GET",
            signal: controller.signal,
            headers: {
              "Content-Type": "application/json",
            },
            mode: "cors",
          });

          clearTimeout(timeoutId);

          if (response.ok) {
            const data = await response.json();
            console.log("Server health:", data);
            setServerStatus("connected");
            // Update SERVER_CONFIG if different endpoint worked
            if (!endpoint.includes(SERVER_CONFIG.BASE_URL)) {
              const url = new URL(endpoint);
              SERVER_CONFIG.HOST = url.hostname;
              SERVER_CONFIG.PORT = url.port;
            }
            return;
          }
        } catch (error) {
          console.error(`Failed to connect to ${endpoint}:`, error.message);
        }
      }

      setServerStatus("disconnected");
      console.log("All connection attempts failed");
    };

    checkServerHealth();
  }, []);

  // Rotate images every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % churchImages.length
      );
    }, 60000);

    return () => clearInterval(interval);
  }, [churchImages.length]);

  // Apply dark mode styles to document
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  // Function to fetch Bible data from API
  const fetchBibleData = async (book, chapter, verse) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://bible-api.com/${book}+${chapter}:${verse}?translation=kjv`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch Bible verse");
      }

      const data = await response.json();
      setBibleData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const appStyle = {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    lineHeight: 1.6,
    color: darkMode ? "#f0f0f0" : "#333",
    backgroundColor: darkMode ? "#1a1a1a" : "#f9f9f9",
    transition: "all 0.3s ease",
  };

  return (
    <Router>
      <div style={appStyle}>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .dark-mode {
            --bg-color: #1a1a1a;
            --text-color: #f0f0f0;
            --card-bg: #2d2d2d;
            --border-color: #444;
          }
          .spinning-logo {
            animation: spin 5s linear infinite;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(135deg, #1a4b84 0%, #2c6eb5 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            fontWeight: bold;
            font-size: 16px;
            position: fixed;
            top: 15px;
            right: 15px;
            z-index: 1001;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes moveBanner {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
        `}</style>

        {/* Spinning Logo */}
        <div className="spinning-logo">NB</div>

        {/* Server Status Indicator with IP info */}
        <div
          style={{
            position: "fixed",
            top: "10px",
            right: "70px",
            padding: "8px 12px",
            backgroundColor:
              serverStatus === "connected" ? "#4CAF50" : "#f44336",
            color: "white",
            borderRadius: "6px",
            fontSize: "11px",
            zIndex: 1000,
            textAlign: "center",
            minWidth: "120px",
          }}
        >
          <div style={{ fontWeight: "bold" }}>Server: {serverStatus}</div>
          <div style={{ fontSize: "10px", opacity: 0.9 }}>
            {SERVER_CONFIG.HOST}:{SERVER_CONFIG.PORT}
          </div>
        </div>

        {/* Connection Status Banner */}
        {serverStatus === "disconnected" && (
          <div
            style={{
              position: "fixed",
              top: "60px",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "#ff4444",
              color: "white",
              padding: "10px 20px",
              borderRadius: "8px",
              zIndex: 1000,
              textAlign: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              fontSize: "14px",
            }}
          >
            <div style={{ fontWeight: "bold" }}>
              ⚠️ Server Connection Failed
            </div>
            <div style={{ fontSize: "12px", marginTop: "4px" }}>
              App running in offline mode. Start your backend server for full
              functionality.
            </div>
          </div>
        )}

        {/* Dark Mode Toggle */}
        <div
          style={{
            position: "fixed",
            top: "10px",
            left: "15px",
            zIndex: 1000,
          }}
        >
          <button
            onClick={toggleDarkMode}
            style={{
              padding: "8px 15px",
              backgroundColor: darkMode ? "#f4c430" : "#1a4b84",
              color: darkMode ? "#1a4b84" : "white",
              border: "none",
              borderRadius: "20px",
              cursor: "pointer",
              fontWeight: "bold",
              boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
            }}
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        <Header darkMode={darkMode} />
        <MovingBanner darkMode={darkMode} />
        <Navbar darkMode={darkMode} />
        <main
          style={{
            flex: 1,
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "2rem 1rem",
            width: "100%",
          }}
        >
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  currentImage={churchImages[currentImageIndex]}
                  darkMode={darkMode}
                />
              }
            />
            <Route path="/about" element={<About darkMode={darkMode} />} />
            <Route path="/mission" element={<Mission darkMode={darkMode} />} />
            <Route path="/vision" element={<Vision darkMode={darkMode} />} />
            <Route
              path="/commission"
              element={<Commission darkMode={darkMode} />}
            />
            <Route
              path="/bible"
              element={
                <BibleSearch
                  bibleData={bibleData}
                  loading={loading}
                  error={error}
                  fetchBibleData={fetchBibleData}
                  darkMode={darkMode}
                />
              }
            />
            <Route
              path="/bible-study"
              element={<BibleStudy darkMode={darkMode} />}
            />
            <Route
              path="/community"
              element={<CommunityOutreach darkMode={darkMode} />}
            />
            <Route path="/gallery" element={<Gallery darkMode={darkMode} />} />
            <Route path="/sermons" element={<Sermons darkMode={darkMode} />} />
            <Route
              path="/audio"
              element={<AudioSermons darkMode={darkMode} />}
            />
            <Route path="/contact" element={<Contact darkMode={darkMode} />} />
          </Routes>
        </main>
        <Footer darkMode={darkMode} />
      </div>
    </Router>
  );
}

export default App;
