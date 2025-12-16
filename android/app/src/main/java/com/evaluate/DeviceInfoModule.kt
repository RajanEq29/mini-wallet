
package com.evaluate

import android.content.Context
import android.os.BatteryManager
import android.net.ConnectivityManager
import android.net.NetworkCapabilities
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class DeviceInfoModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
    return "DeviceInfo"
  }

  @ReactMethod
  fun getBatteryLevel(promise: Promise) {
    try {
      val batteryManager = reactApplicationContext.getSystemService(Context.BATTERY_SERVICE) as BatteryManager
      val percentage = batteryManager.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY)
      promise.resolve(percentage)
    } catch (e: Exception) {
      promise.reject("BATTERY_ERROR", e)
    }
  }

  @ReactMethod
  fun getNetworkType(promise: Promise) {
    try {
      val cm = reactApplicationContext.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
      val network = cm.activeNetwork
      val capabilities = cm.getNetworkCapabilities(network)
      
      var type = "UNKNOWN"
      if (capabilities != null) {
          if (capabilities.hasTransport(NetworkCapabilities.TRANSPORT_WIFI)) {
              type = "WIFI"
          } else if (capabilities.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR)) {
              type = "CELLULAR"
          } else if (capabilities.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET)) {
              type = "ETHERNET"
          }
      }
      promise.resolve(type)
    } catch (e: Exception) {
      promise.reject("NETWORK_ERROR", e)
    }
  }
}
