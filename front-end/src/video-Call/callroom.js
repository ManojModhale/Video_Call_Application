import React, { useRef, useState, useEffect } from "react";
import "./callroom.css";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { VIDEOCALL_APP_ID, VIDEOCALL_SECRET } from "../Config";

function CallRoom() {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const zpRef = useRef(null);
  const videoContainerRef = useRef(null);
  const [joined, setJoined] = useState(false);
  const [callType, setCallType] = useState(""); // State to store the call type

  // Initialize ZegoUIKit and join room on component mount
  const myMeeting = (type) => {
    if (zpRef.current) {
      zpRef.current.destroy(); // Clean up any existing instance before initializing a new one
      zpRef.current = null;
    }

    if (!videoContainerRef.current) {
      console.error("Video container is null!");
      return;
    }

    if (!roomId) {
      console.error("Invalid Room ID!");
      return;
    }

    const appID = VIDEOCALL_APP_ID;
    const serverSecret = VIDEOCALL_SECRET;
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomId,
      Date.now().toString(),
      "Your Name"
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zpRef.current = zp;

    zp.joinRoom({
      container: videoContainerRef.current,
      sharedLinks: [
        {
          name: "Video Call Link",
          url: `${window.location.protocol}//${window.location.host}${window.location.pathname}?type=${encodeURIComponent(type)}`,
          
        },
      ],
      scenario: {
        mode:
          type === "one-on-one"
            ? ZegoUIKitPrebuilt.OneONoneCall
            : ZegoUIKitPrebuilt.GroupCall,
      },
      maxUsers: type === "one-on-one" ? 2 : 10,
      onJoinRoom: () => {
        setJoined(true);
      },
      onLeaveRoom: () => handleExit(),
      onReturnToHomeScreenClicked: () => handleExit(),
    });
  };

  // Handle exit from the room
  const handleExit = () => {
    if (zpRef.current) {
      try {
        zpRef.current.destroy(); // Destroy the ZegoUIKitPrebuilt instance
        zpRef.current = null;
      } catch (err) {
        console.error("Error during zpRef destroy:", err);
      }
    }
    // Add a slight delay before navigating to ensure cleanup is complete
    setTimeout(() => {
      navigate("/home");
    }, 100); // 100ms delay
  };

  // On component mount, extract call type from location and initialize meeting
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const type = query.get("type");

    setCallType(type); // Update state with call type
  }, [location.search]);

  // Initialize meeting after callType state is set
  useEffect(() => {
    if (callType) {
      myMeeting(callType);
    }

    // Cleanup function for component unmount
    return () => {
      if (zpRef.current) {
        try {
          zpRef.current.destroy(); // Safely destroy the instance
          zpRef.current = null;
        } catch (err) {
          console.error("Error during cleanup:", err); // Log cleanup errors
        }
      }
    };
  }, [callType, roomId]); //, navigate

  return (
    <div className="room-container">
      {!joined && (
        <>
          <header className="room-header">
            {callType === "one-on-one"
              ? "One-on-One Video Call"
              : "Group Video Call"}
          </header>
          <button className="exit-button" onClick={handleExit}>
            Exit
          </button>
        </>
      )}
      <div ref={videoContainerRef} className="video-container" />
    </div>
  );
}

export default CallRoom;