export type SensorTypeValue = "temperature" | "humidity" | "wind" | "light";

export type SensorReadingPoint = {
  value: number;
  unit: string;
  measured_at: string;
};

export type Sensor = {
  id: number;
  name: string;
  location: string;
  type: SensorTypeValue;
  type_label: string;
  reading: string;
  readings: SensorReadingPoint[];
  active: boolean;
};

export type SensorTypeOption = {
  value: SensorTypeValue;
  label: string;
};

export type SensorsChartProps = {
  sensors?: Sensor[];
  sensor_types?: SensorTypeOption[];
};

export type HomeProps = SensorsChartProps;

export type SensorFormData = {
  name: string;
  location: string;
  type: SensorTypeValue;
};
