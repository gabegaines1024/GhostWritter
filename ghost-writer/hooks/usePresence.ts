/**
 * usePresence Hook
 *
 * Track user presence and see other collaborators in real-time.
 *
 * TODO: Implement after setting up Convex provider
 */

"use client";

import { useEffect, useRef } from "react";
// import { useMutation, useQuery } from "convex/react";
// import { api } from "@/convex/_generated/api";

const HEARTBEAT_INTERVAL = 10 * 1000; // 10 seconds

export interface UsePresenceOptions {
  scriptId: string;
  userId: string;
  userName: string;
  userColor: string;
}

export function usePresence({
  scriptId,
  userId,
  userName,
  userColor,
}: UsePresenceOptions) {
  const heartbeatRef = useRef<NodeJS.Timeout | null>(null);

  // TODO: Subscribe to active users
  // const activeUsers = useQuery(api.presence.getActiveUsers, { scriptId });

  // TODO: Heartbeat mutation
  // const heartbeat = useMutation(api.presence.heartbeat);

  // TODO: Leave mutation
  // const leave = useMutation(api.presence.leave);

  // Send heartbeat on mount and interval
  useEffect(() => {
    const sendHeartbeat = () => {
      console.log(`Sending heartbeat for ${userName} in script ${scriptId}`);
      // heartbeat({ scriptId, userId, userName, userColor });
    };

    // Initial heartbeat
    sendHeartbeat();

    // Set up interval
    heartbeatRef.current = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL);

    // Cleanup: send leave and clear interval
    return () => {
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
      }
      // leave({ userId });
      console.log(`User ${userName} left script ${scriptId}`);
    };
  }, [scriptId, userId, userName, userColor]);

  return {
    activeUsers: [], // Replace with actual active users from Convex
    isConnected: false,
  };
}

