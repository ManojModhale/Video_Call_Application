import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
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
    const { name, role } = location.state || {name:"GUEST", role:"Audience"}

    const roleCondition =
        role === 'Host'
            ? ZegoUIKitPrebuilt.Host
            : ZegoUIKitPrebuilt.Audience;

    const sharedLinks = [
        {
            name: 'Join as Audience',
            url: `${window.location.origin}/room/${roomId}`
        },
    ];


    const appID = LIVESTREAM_APP_ID;
    const serverSecret = LIVESTREAM_SECRET;
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, roomId, randomID(5), name);

    // start the call
    let myMeeting = async (element) => {
        // Create instance object from Kit Token.
        const zp = ZegoUIKitPrebuilt.create(kitToken);
        // start the call
        zp.joinRoom({
            container: element,
            scenario: {
                mode: ZegoUIKitPrebuilt.LiveStreaming,
                config: {
                   role: roleCondition,
                },
            },
            sharedLinks,
        });
    };


    return (
        <div
        className="myCallContainer"
        ref={myMeeting}
        style={{ width: '100vw', height: '100vh' }}
      ></div>
    );
}
export default StreamRoom;