
import { NativeModules } from 'react-native';

const { DeviceInfo } = NativeModules;

interface DeviceInfoInterface {
    getBatteryLevel(): Promise<number>;
    getNetworkType(): Promise<string>;
}

export default DeviceInfo as DeviceInfoInterface;
