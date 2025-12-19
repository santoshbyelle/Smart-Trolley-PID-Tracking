
export enum TrolleyStatus {
  TRACKING = 'TRACKING',
  IDLE = 'IDLE',
  LOST = 'LOST',
  EMERGENCY_STOP = 'EMERGENCY_STOP'
}

export enum ControlMode {
  AUTO = 'AUTO',
  MANUAL = 'MANUAL'
}

export interface PIDParameters {
  kp: number;
  ki: number;
  kd: number;
}

export interface TrolleyState {
  currentDistance: number;
  targetDistance: number;
  error: number;
  motorSpeed: number;
  pidOutput: number;
  status: TrolleyStatus;
  mode: ControlMode;
  batteryLevel: number;
  temperature: number;
  obstacleDetected: boolean;
  // GPS & GSM Telemetry
  latitude: number;
  longitude: number;
  gsmSignal: number; // 0-100%
  satelliteCount: number;
}

export interface LogEntry {
  timestamp: string;
  distance: number;
  setpoint: number;
  error: number;
  output: number;
}

export interface Alert {
  id: string;
  type: 'info' | 'warning' | 'error';
  message: string;
  timestamp: string;
}
