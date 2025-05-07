import React, { useState, useRef, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { LIVESTREAM_APP_ID, LIVESTREAM_SECRET } from "../Config";
import "./streamroom.css";

function randomID(len) {
  let result = '';
  if (result) return result;
  var chars = '12345qwertyuiopasdfgh67890jklmnbvcxzMNBVCZXASDQWERTYHGFUIOLKJP',
    maxPos = chars.length,
    i;
  len = len || 5;
  for (i = 0; i < len; i++) {
    result += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return result;
}

function StreamRoom() {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const zpRef = useRef(null);
  const videoContainerRef = useRef(null);
  const { name, role } = location.state || { name: "GUEST", role: "Audience" }

  const roleCondition =
    role === 'Host'
      ? ZegoUIKitPrebuilt.Host
      : ZegoUIKitPrebuilt.Audience;

  const sharedLinks = [
    {
      name: 'Join as Audience',
      url: `${window.location.origin}/stream/${roomId}`
    },
  ];


  const appID = LIVESTREAM_APP_ID;
  const serverSecret = LIVESTREAM_SECRET;
  const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomId, randomID(5), name);

  // start the call
  const myMeeting = () => {
    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zpRef.current = zp;

    zp.joinRoom({
      container: videoContainerRef.current,
      scenario: {
        mode: ZegoUIKitPrebuilt.LiveStreaming,
        config: {
          role: roleCondition,
        },
      },
      sharedLinks,
      onLeaveRoom: () => handleExit(),
      onUserLeave: () => handleExit(),
      onLiveEnd: () => handleExit(),
      onReturnToHomeScreenClicked: () => handleExit(),
    });
  };

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
      navigate("/home/live");
    }, 100); // 100ms delay
  };

  useEffect(() => {
    myMeeting();

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

  }, []);


  return (
    <div
      className="myCallContainer"
      ref={myMeeting}
      style={{ width: '100vw', height: '100vh' }}
    ></div>
  );
}
export default StreamRoom;