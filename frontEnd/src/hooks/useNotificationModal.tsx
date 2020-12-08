import React from "react";
import { NotificationModal } from "../components";
import { getLogger } from "../util/logger"

const logger = getLogger('Hooks::notificationModal')

export const useNotificationModal = (input?: {onCloseCallback?: Function, onButtonClickCallback?: Function}) => {

  const [notificationOpen, setNotificationOpen] = React.useState(false);
  const [notificationTitle, setNotificationTitle] = React.useState("");
  const [notificationText, setNotificationText] = React.useState("");
  const [notificationError, setNotificationError] = React.useState(false);

  const onClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
    setNotificationOpen(false);
    if (input?.onCloseCallback) {
      input.onCloseCallback();
    }
  }

  const onClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    setNotificationOpen(false);
    if (input?.onButtonClickCallback) {
      input.onButtonClickCallback();
    }
  }

  const notifyError = (reason: string, title?: string) => {
    setNotificationOpen(true);
    setNotificationError(true);
    setNotificationTitle(title ? title : "Error");
    setNotificationText(reason);
  }

  const notify = (reason: string, title?: string) => {
    setNotificationOpen(true);
    setNotificationError(false);
    setNotificationTitle(title ? title : "Notification");
    setNotificationText(reason);
  }

  return {
    setNotificationOpen,
    setNotificationTitle,
    setNotificationText,
    setNotificationError,
    notifyError,
    notify,
    modal: <NotificationModal 
      open={notificationOpen}
      contentText={notificationText}
      titleText={notificationTitle}
      error={notificationError}
      handleClose={onClose}
      onButtonClick={onClick}
    />
  }
}