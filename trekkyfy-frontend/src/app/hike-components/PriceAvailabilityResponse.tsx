"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import "@/app/stylesheet/notification.css";

export interface PriavlResponse {
  id: string;
  accepted: boolean;
  guide_username?: string;
  guide_id?: string;
  price: string;
  hiker_id?: string;
  availability: string;
  partialTime: string;
  unavailableOption: string;
  unavailabilityReason: string;
}

interface HikerNotificationPopupProps {
  notifications: PriavlResponse[];
  onDismiss: (id?: string) => void;
}

const PriavlNotificationPopup: React.FC<HikerNotificationPopupProps> = ({
  notifications,
  onDismiss,
}) => {
  return (
    <div className="notification-popup-overlay">
      <div className="notification-popup">
        <div className="popup-header">
          <h3>Price and Availability Responses</h3>
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
                      Your price and availability request was accepted by{" "}
                      <strong>{notif.guide_username}</strong> (Guide ID:{" "}
                      <strong>{notif.guide_id}</strong>)
                    </span>
                    <button className="chat-btn">View Response</button>
                    <button
                      onClick={() => {
                        onDismiss(notif.id);
                      }}
                      className="dismiss-btn"
                    >
                      Dismiss
                    </button>
                  </>
                ) : (
                  <>
                    <span>
                      Your price and availability request was rejected by{" "}
                      <strong>{notif.guide_username}</strong> (Guide ID:{" "}
                      <strong>{notif.guide_id}</strong>)
                    </span>
                    <button onClick={() => onDismiss(notif.id)}>
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

export default PriavlNotificationPopup;
