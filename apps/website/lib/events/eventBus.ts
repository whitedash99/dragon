import { EventEmitter } from "events";
import { prisma } from "@/lib/prisma";

export type EventType =
  | "USER_CREATED"
  | "CONTENT_UPDATED"
  | "GAME_CREATED"
  | "TICKET_CREATED"
  | "DOWNLOAD_ADDED"
  | "SYSTEM_ALERT";

export interface SystemEventPayload {
  type: EventType;
  actor: string;
  module: string;
  details: string;
  oldValue?: string;
  newValue?: string;
  timestamp?: Date;
}

class EnterpriseEventBus extends EventEmitter {
  constructor() {
    super();
    this.on("event", this.handleEvent.bind(this));
  }

  public dispatch(payload: SystemEventPayload) {
    const timestamp = payload.timestamp || new Date();
    this.emit("event", { ...payload, timestamp });
  }

  private async handleEvent(payload: SystemEventPayload) {
    try {
      await prisma.auditLog.create({
        data: {
          action: payload.type,
          userEmail: payload.actor || "System",
          details: `${payload.module}: ${payload.details}`,
        },
      });
    } catch (e) {
      console.error("EventBus AuditLog error:", e);
    }
  }
}

export const eventBus = new EnterpriseEventBus();
