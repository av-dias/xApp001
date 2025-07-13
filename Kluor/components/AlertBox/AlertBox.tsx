import { eventEmitter, NotificationEvent } from "@/utility/eventEmitter";
import { ThemeMode, ThemeColor } from "@/utility/styling";
import { ReactNode, useEffect, useState } from "react";
import { Text, Modal, View } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Button } from "../Button/Button";

export type NotificationData = {
  title: string;
  message: string | ReactNode;
  confirmText: string;
  confirmCallback: () => any;
  cancelCallback: () => any;
};

export const notificationConf = (
  object: any,
  loadBody: string | ReactNode,
  confirmCallback: () => void,
  cancelCallback: () => void
): NotificationData => ({
  title: "Delete Item",
  message: loadBody,
  confirmText: "Delete",
  confirmCallback: confirmCallback,
  cancelCallback: cancelCallback,
});

export const AlertBox = () => {
  const themeMode: ThemeMode = "light";
  const theme = ThemeColor(themeMode);

  const [visible, setVisible] = useState(false);
  const [notification, setNotification] = useState<NotificationData>();

  useEffect(() => {
    const showNotification = (notification: NotificationData) => {
      setNotification(notification);
      setVisible(true);
    };

    eventEmitter.on(NotificationEvent, showNotification);
    return () => {
      eventEmitter.off(NotificationEvent, showNotification);
    };
  }, []);

  const cancelBtnCallback = () => {
    notification?.cancelCallback();
    setVisible(false);
  };

  const confirmBtnCallback = () => {
    notification?.confirmCallback();
    setVisible(false);
  };

  if (!visible || !notification) return null;

  return (
    <View
      style={{
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Modal
        visible={visible}
        style={{ justifyContent: "center", alignItems: "center" }}
        onRequestClose={() => {
          setVisible(false);
        }}
        transparent={true}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.blackout,
          }}
        >
          <View
            style={{
              width: "80%",
              height: "25%",
              padding: 20,
              borderRadius: 10,
              gap: 20,
              backgroundColor: theme.glassOpac,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-end",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: theme.textWhite,
                }}
              >
                {notification?.title}
              </Text>
              <AntDesign name="close" size={20} color={theme.textPrimary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.textWhite }}>
                {notification?.message}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-end",
                justifyContent: "space-between",
              }}
            >
              <Button text={"Cancel"} callback={cancelBtnCallback} />
              <Button
                color={theme.button}
                text={notification.confirmText}
                callback={confirmBtnCallback}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
