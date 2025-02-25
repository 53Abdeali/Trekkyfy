"use client";

import React, { useState } from "react";
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
  hiker_username:string;
  trek_place: string;
  trek_date: string;
  trek_time: string;
}

interface HikerNotificationPopupProps {
  notifications: PriavlResponse[];
  onDismiss: (id?: string) => void;
  hiker_username: string;
}

interface ResponseModalProps {
  notification: PriavlResponse;
  hiker_username: string;
  onClose: () => void;
}

const ResponseModal: React.FC<ResponseModalProps> = ({
  notification,
  hiker_username,
  onClose,
}) => {
  let message = "";

  // Case 1: Partially available
  if (notification.availability === "Unavailable") {
    message = `Hey, ${hiker_username}, I ${notification.guide_username} - ${notification.guide_id} saw that you have requested the pricing and availability for ${notification.trek_place} on ${notification.trek_date} from ${notification.trek_time} to whole day. However, I will only be available for ${notification.partialTime}. Therefore, my charge for that period will be ${notification.price}.`;
  }
  // Case 2: Unavailable
  else if (
    notification.availability === "Unavailable" &&
    (notification.unavailableOption === "Time" ||
      notification.unavailableOption === "Week" ||
      notification.unavailableOption === "Month")
  ) {
    message = `Hey, ${hiker_username}, I ${notification.guide_username} - ${notification.guide_id} saw that you have requested the pricing and availability for ${notification.trek_place} on ${notification.trek_date} from ${notification.trek_time} to whole day. Unfortunately, I am unavailable because ${notification.unavailabilityReason}. ${notification.unavailableOption}.`;
  }
  // Default: Fully available
  else {
    message = `Hey, ${hiker_username}, I ${notification.guide_username} - ${notification.guide_id} saw that you have requested the pricing and availability for ${notification.trek_place} on ${notification.trek_date} from ${notification.trek_time} to whole day. So, for one day my charge will be ${notification.price} and I am available for the whole day.`;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <p>{message}</p>
      </div>
    </div>
  );
};

const PriavlNotificationPopup: React.FC<HikerNotificationPopupProps> = ({
  notifications,
  onDismiss,
  hiker_username,
}) => {
  const [selectedNotification, setSelectedNotification] =
    useState<PriavlResponse | null>(null);

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
            notifications.map((notif) => (
              <li key={notif.id} className="request-item">
                {notif.accepted ? (
                  <>
                    <span>
                      Your price and availability request was accepted by{" "}
                      <strong>{notif.guide_username}</strong> (Guide ID:{" "}
                      <strong>{notif.guide_id}</strong>)
                    </span>
                    <button
                      className="chat-btn"
                      onClick={() => setSelectedNotification(notif)}
                    >
                      View Response
                    </button>
                    <button
                      onClick={() => onDismiss(notif.id)}
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
                    <button
                      className="chat-btn"
                      onClick={() => onDismiss(notif.id)}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </>
                )}
              </li>
            ))
          )}
        </ul>
      </div>

      {selectedNotification && (
        <ResponseModal
          notification={selectedNotification}
          hiker_username={hiker_username}
          onClose={() => setSelectedNotification(null)}
        />
      )}
    </div>
  );
};

export default PriavlNotificationPopup;
