"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import "@/app/stylesheet/notification.css"

export interface ChatResponse {
  accepted: boolean;
  guide_whatsapp?: string;
  guide_username?: string;
  guide_id?: string;
  message?: string;
  hiker_id?: string;
}

interface HikerNotificationPopupProps {
  notifications: ChatResponse[];
  onOpenChat: (guide_whatsapp: string, guide_id?: string) => void;
  onDismiss: (guide_id?: string) => void;
}

const HikerNotificationPopup: React.FC<HikerNotificationPopupProps> = ({
  notifications,
  onOpenChat,
  onDismiss,
}) => {
  return (
    <div className="notification-popup-overlay">
      <div className="notification-popup">
        <div className="popup-header">
          <h3>Chat Responses</h3>
        </div>
        <ul className="request-list">
          {notifications.length === 0 ? (
            <li>No new notifications</li>
          ) : (
            notifications.map((notif, index) => (
              <li key={index} className="request-item">
                {notif.accepted ? (
                  <>
                    <span>
                      Your chat request was accepted by{" "}
                      <strong>{notif.guide_username}</strong> (Guide ID:{" "}
                      <strong>{notif.guide_id}</strong>)
                    </span>
                    <button
                      onClick={() => {
                        if (notif.guide_whatsapp)
                          onOpenChat(notif.guide_whatsapp, notif.guide_id);
                        onDismiss(notif.guide_id);
                      }}
                      className="chat-btn"
                    >
                      Open Chat
                    </button>
                    <button
                      onClick={() => {
                        onDismiss(notif.guide_id);
                      }}
                      className="dismiss-btn"
                    >
                      Dismiss
                    </button>
                  </>
                ) : (
                  <>
                    <span>
                      Your chat request was rejected by{" "}
                      <strong>{notif.guide_username}</strong> (Guide ID:{" "}
                      <strong>{notif.guide_id}</strong>)
                    </span>
                    <button onClick={() => onDismiss(notif.guide_id)}>
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </>
                )}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default HikerNotificationPopup;
