"use client";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

export interface ChatRequest {
  hiker_username: string;
  hiker_id: string;
  guideId: string;
}

interface NotificationPopupProps {
  requests: ChatRequest[];
  onAccept: (request: ChatRequest) => void;
  onReject: (request: ChatRequest) => void;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({
  requests,
  onAccept,
  onReject,
}) => {
  return (
    <div className="notification-popup-overlay">
      <div className="notification-popup">
        <div className="popup-header">
          <h3>Chat Requests</h3>
        </div>
        <ul className="request-list">
          {requests.length === 0 ? (
            <li>No new requests</li>
          ) : (
            requests.map((req) => (
              <li key={req.hiker_id} className="request-item">
                <span>{req.hiker_username} - {req.hiker_id} is requesting for chat</span>
                <div className="action-icons">
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="accept-icon"
                    onClick={() => onAccept(req)}
                  />
                  <FontAwesomeIcon
                    icon={faTimes}
                    className="reject-icon"
                    onClick={() => onReject(req)}
                  />
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default NotificationPopup;
