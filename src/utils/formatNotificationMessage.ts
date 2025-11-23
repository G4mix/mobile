import { NotificationDto } from "@/features/notifications/notificationsSlice";

export function formatNotificationMessage(
  notification: NotificationDto,
): string {
  const actorName = notification.actorProfile?.displayName || null;

  if (
    notification.type === "Invite" &&
    notification.relatedEntityType === "COLLABORATION_REQUEST"
  ) {
    if (notification.title === "REQUEST_COLLABORATION_APPROVED") {
      if (notification.ideaTitle) {
        return `${actorName || "Um usuário"} aceitou sua solicitação de colaboração na ideia "${notification.ideaTitle}"`;
      }
      return actorName
        ? `${actorName} aceitou sua solicitação de colaboração`
        : "Sua solicitação de colaboração foi aceita";
    }

    if (notification.title === "REQUEST_COLLABORATION_REJECTED") {
      if (notification.ideaTitle) {
        return `${actorName || "Um usuário"} recusou sua solicitação de colaboração na ideia "${notification.ideaTitle}"`;
      }
      return actorName
        ? `${actorName} recusou sua solicitação de colaboração`
        : "Sua solicitação de colaboração foi recusada";
    }

    if (notification.ideaTitle) {
      return `${actorName || "Um usuário"} deseja colaborar na ideia "${notification.ideaTitle}"`;
    }
    return actorName
      ? `${actorName} deseja colaborar em uma ideia`
      : "Um usuário deseja colaborar em uma ideia";
  }

  if (notification.type === "Comment") {
    return actorName
      ? `${actorName} comentou em sua ideia: "${notification.message}"`
      : `Alguém comentou em sua ideia: "${notification.message}"`;
  }

  if (notification.type === "Like") {
    return actorName
      ? `${actorName} curtiu sua ideia: "${notification.message}"`
      : `Alguém curtiu sua ideia: "${notification.message}"`;
  }

  if (notification.type === "Follow") {
    return actorName
      ? `${actorName} começou a te seguir`
      : "Alguém começou a te seguir";
  }

  return notification.message;
}
