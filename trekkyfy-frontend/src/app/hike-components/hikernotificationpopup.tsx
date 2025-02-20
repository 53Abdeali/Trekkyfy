"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export interface ChatResponse {
  accepted: boolean;
  guide_whatsApp?: string;
  message?: string;
  hiker_id?: string;
}

interface HikerNotificationPopupProps {
  notifications: ChatResponse[];
  onOpenChat: (guide_whatsapp: string) => void;
  onDismiss: (index: number) => void;
  onClose: () => void;
}

const HikerNotificationPopup: React.FC<HikerNotificationPopupProps> = ({
  notifications,
  onOpenChat,
  onDismiss,
  onClose,
}) => {
  return (
    <div className="notification-popup-overlay">
      <div className="notification-popup">
        <div className="popup-header">
          <h3>Chat Responses</h3>
          <button onClick={onClose}>Close</button>
        </div>
        <ul className="request-list">
          {notifications.length === 0 ? (
            <li>No new notifications</li>
          ) : (
            notifications.map((notif, index) => (
              <li key={index} className="request-item">
                {notif.accepted ? (
                  <>
                    <span>Your chat request was accepted!</span>
                    <button
                      onClick={() => {
                        if (notif.guide_whatsApp)
                          onOpenChat(notif.guide_whatsApp);
                        onDismiss(index);
                      }}
                    >
                      Open Chat
                    </button>
                  </>
                ) : (
                  <>
                    <span>Your chat request was rejected.</span>
                    <button onClick={() => onDismiss(index)}>
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
