"use client";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

export interface PriavlRequest {
  id: string;
  hiker_username: string;
  hiker_id: string;
  guideId: string;
  trek_place: string;
  trek_date: string;
  trek_time: string;
  hiking_members: number;
}

interface NotificationPopupProps {
  requests: PriavlRequest[];
  onPriavlAccept: (request: PriavlRequest) => void;
  onPriavlReject: (request: PriavlRequest) => void;
}

const PriceAvailabilityPopup: React.FC<NotificationPopupProps> = ({
  requests,
  onPriavlAccept,
  onPriavlReject,
}) => {
  return (
    <div className="notification-popup-overlay">
      <div className="notification-popup">
        <div className="popup-header">
          <h3>Price And Availability Requests</h3>
        </div>
        <ul className="request-list">
          {requests.length === 0 ? (
            <li>No new requests</li>
          ) : (
            requests.map((req) => (
              <li key={req.id} className="request-item">
                <span>
                  {req.hiker_username} - {req.hiker_id} is requesting for
                  pricing and availability.
                </span>
                <div className="action-icons">
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="accept-icon"
                    onClick={() => onPriavlAccept(req)}
                  />
                  <FontAwesomeIcon
                    icon={faTimes}
                    className="reject-icon"
                    onClick={(e) => {
                      e.preventDefault();
                      onPriavlReject(req);
                    }}
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

export default PriceAvailabilityPopup;
