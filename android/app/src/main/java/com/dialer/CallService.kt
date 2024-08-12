package com.dialer

import android.app.Service
import android.content.Intent
import android.os.IBinder
import android.telecom.TelecomManager
import android.util.Log
import android.content.pm.PackageManager
import android.net.Uri
import androidx.core.content.ContextCompat
import android.Manifest

class CallService : Service() {

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        super.onStartCommand(intent, flags, startId)

        val action = intent?.action
        if (action == "START_CALL") {
            val phoneNumber = intent.getStringExtra("PHONE_NUMBER")
            phoneNumber?.let {
                initiateCall(it)
            }
        }
        return START_NOT_STICKY
    }

    private fun initiateCall(phoneNumber: String) {
        try {
            val telecomManager = getSystemService(TELECOM_SERVICE) as TelecomManager
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.CALL_PHONE) == PackageManager.PERMISSION_GRANTED) {
                telecomManager.placeCall(Uri.parse("tel:$phoneNumber"), null)
            } else {
                Log.e("CallService", "CALL_PHONE permission not granted")
            }
        } catch (e: Exception) {
            Log.e("CallService", "Failed to initiate call: ${e.message}")
        }
    }
}
