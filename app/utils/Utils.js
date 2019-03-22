import * as _ from 'underscore'
import moment from 'moment'
import Cache from './Cache'

//import DeviceInfo from 'react-native-device-info';

//const UNIQUE_ID = DeviceInfo.getUniqueID()

class UtilService {

    static async saveLocalStringData(key, strValue) {
        await sessionStorage.setItem('@gogo:' + key, strValue);
        return true;
    }

    static async saveLocalObjectData(key, obj) {
        await sessionStorage.setItem('@gogo:' + key, JSON.stringify(obj));
    }

    static async getLocalStringData(key) {
        let ret = await sessionStorage.getItem('@gogo:' + key);

        return ret
    }

    static async getLocalObjectData(key) {
        let ret = await sessionStorage.getItem('@gogo:' + key);
        if (ret != null) {
            return JSON.parse(ret)
        } else {
            return null
        }
    }

    static async removeLocalObjectData(key) {
        let ret = await sessionStorage.removeItem('@gogo:' + key);
        return true
    }

}

export default UtilService
