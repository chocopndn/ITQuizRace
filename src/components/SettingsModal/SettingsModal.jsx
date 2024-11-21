import React from "react";
import "./SettingsModal.css";

import MuteIcon from "../../assets/icons/mute.svg";
import UnmuteIcon from "../../assets/icons/unmute.svg";
import CloseButton from "../../assets/icons/xbutton.svg";

const musicOptions = [
  {
    title: "Space Cadet Training Montage",
    path: "/sounds/music/space_cadet_training_montage.wav",
  },
  {
    title: "Winning The Race",
    path: "/sounds/music/WinningTheRace.ogg",
  },
];

const SettingsModal = ({
  onClose,
  onChangeMusic,
  onToggleBgMusicMute,
  onToggleFxMute,
  bgMusicMuted,
  fxMuted,
  bgVolume,
  onChangeBgVolume,
  fxVolume,
  onChangeFxVolume,
  currentMusic,
}) => {
  return (
    <div className="settings-modal-overlay">
      <div className="settings-modal-container">
        <div className="modal-header">
          <h2 className="modal-title">Settings</h2>
          <button className="close-button" onClick={onClose}>
            <img src={CloseButton} alt="Close" />
          </button>
        </div>
        <div className="modal-section">
          <h3>Audio Settings</h3>
          <div className="mute-unmute">
            <div className="modal-option">
              <button
                onClick={onToggleBgMusicMute}
                className="mute-toggle-button"
              >
                <img
                  src={bgMusicMuted ? MuteIcon : UnmuteIcon}
                  alt={bgMusicMuted ? "Muted" : "Unmuted"}
                  className="mute-icon"
                />
                Background Music
              </button>
            </div>
            <div className="modal-option">
              <button onClick={onToggleFxMute} className="mute-toggle-button">
                <img
                  src={fxMuted ? MuteIcon : UnmuteIcon}
                  alt={fxMuted ? "Muted" : "Unmuted"}
                  className="mute-icon"
                />
                Sound Effects (FX)
              </button>
            </div>
          </div>
          <div className="modal-option">
            <label>
              Background Music Volume
              <input
                type="range"
                min="0"
                max="100"
                value={bgVolume}
                onChange={(e) => onChangeBgVolume(parseInt(e.target.value, 10))}
              />
            </label>
          </div>
          <div className="modal-option">
            <label>
              Sound Effects Volume
              <input
                type="range"
                min="0"
                max="100"
                value={fxVolume}
                onChange={(e) => onChangeFxVolume(parseInt(e.target.value, 10))}
              />
            </label>
          </div>
          <div className="modal-option">
            <label>
              Select Background Music
              <select
                value={currentMusic}
                onChange={(e) => onChangeMusic(e.target.value)}
                className="music-dropdown"
              >
                {musicOptions.map((music, index) => (
                  <option key={index} value={music.path}>
                    {music.title}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
