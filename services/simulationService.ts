
import { TrolleyState, TrolleyStatus, ControlMode, PIDParameters } from '../types';

export class PIDController {
  private integral = 0;
  private lastError = 0;

  calculate(error: number, params: PIDParameters, dt: number): number {
    this.integral += error * dt;
    const derivative = (error - this.lastError) / dt;
    this.lastError = error;
    
    if (Math.abs(this.integral) > 100) this.integral = Math.sign(this.integral) * 100;
    
    return (params.kp * error) + (params.ki * this.integral) + (params.kd * derivative);
  }

  reset() {
    this.integral = 0;
    this.lastError = 0;
  }
}

export class TrolleySimulator {
  private state: TrolleyState;
  private pid: PIDController;
  private pidParams: PIDParameters;
  private lastTime: number;

  constructor() {
    this.pid = new PIDController();
    this.pidParams = { kp: 1.2, ki: 0.1, kd: 0.5 };
    this.lastTime = Date.now();
    this.state = {
      currentDistance: 150,
      targetDistance: 100,
      error: 50,
      motorSpeed: 0,
      pidOutput: 0,
      status: TrolleyStatus.IDLE,
      mode: ControlMode.AUTO,
      batteryLevel: 85,
      temperature: 32,
      obstacleDetected: false,
      latitude: 40.7128,
      longitude: -74.0060,
      gsmSignal: 88,
      satelliteCount: 12
    };
  }

  update(humanPosition: number): TrolleyState {
    const now = Date.now();
    const dt = (now - this.lastTime) / 1000;
    this.lastTime = now;

    if (this.state.status === TrolleyStatus.EMERGENCY_STOP || this.state.status === TrolleyStatus.IDLE) {
      this.state.motorSpeed = 0;
      this.state.pidOutput = 0;
      // Coordinates still drift slightly even when idle
      this.state.latitude += (Math.random() - 0.5) * 0.000001;
      this.state.longitude += (Math.random() - 0.5) * 0.000001;
      return { ...this.state };
    }

    this.state.error = this.state.currentDistance - this.state.targetDistance;
    
    if (this.state.mode === ControlMode.AUTO) {
      this.state.pidOutput = this.pid.calculate(this.state.error, this.pidParams, dt);
      const targetSpeed = Math.max(-100, Math.min(100, this.state.pidOutput));
      this.state.motorSpeed += (targetSpeed - this.state.motorSpeed) * dt * 5;
      
      const movement = this.state.motorSpeed * dt * 0.5;
      this.state.currentDistance -= movement;

      // Update GPS coordinates based on motor movement
      // Roughly mapping motor speed to lat/long changes
      this.state.latitude += movement * 0.000001;
      this.state.longitude += (Math.random() - 0.5) * 0.000002;
    }

    this.state.obstacleDetected = Math.random() < 0.01;
    if (this.state.currentDistance < 20) {
      this.state.obstacleDetected = true;
    }
    
    if (this.state.currentDistance > 400) {
      this.state.status = TrolleyStatus.LOST;
    } else {
      this.state.status = TrolleyStatus.TRACKING;
    }

    this.state.batteryLevel = Math.max(0, this.state.batteryLevel - 0.0001);
    this.state.temperature = 30 + (Math.abs(this.state.motorSpeed) / 10) + Math.random() * 0.5;

    // GSM and Satellite simulation
    this.state.gsmSignal = 70 + Math.random() * 20;
    this.state.satelliteCount = 8 + Math.floor(Math.random() * 6);

    return { ...this.state };
  }

  setPID(params: PIDParameters) {
    this.pidParams = params;
    this.pid.reset();
  }

  setTarget(dist: number) {
    this.state.targetDistance = dist;
  }

  setMode(mode: ControlMode) {
    this.state.mode = mode;
  }

  setStatus(status: TrolleyStatus) {
    this.state.status = status;
    if (status === TrolleyStatus.IDLE) this.pid.reset();
  }
}
