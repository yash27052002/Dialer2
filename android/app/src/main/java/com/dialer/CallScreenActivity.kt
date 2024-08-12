package com.dialer

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.telecom.TelecomManager
import android.widget.Button
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import android.net.Uri
import android.util.Log


class CallScreenActivity : AppCompatActivity() {

    private lateinit var endCallButton: Button
    private lateinit var holdCallButton: Button
    private lateinit var muteCallButton: Button
    private lateinit var recordCallButton: Button

    private var isCallMuted = false
    private var isCallOnHold = false
    private var isRecording = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_call_screen)

        endCallButton = findViewById(R.id.end_call_button)
        holdCallButton = findViewById(R.id.hold_call_button)
        muteCallButton = findViewById(R.id.mute_call_button)
        recordCallButton = findViewById(R.id.record_call_button)

        endCallButton.setOnClickListener { endCall() }
        holdCallButton.setOnClickListener { toggleHold() }
        muteCallButton.setOnClickListener { toggleMute() }
        recordCallButton.setOnClickListener { toggleRecord() }

        // Request permissions if not granted
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED ||
            ContextCompat.checkSelfPermission(this, Manifest.permission.CALL_PHONE) != PackageManager.PERMISSION_GRANTED ||
            ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED ||
            ContextCompat.checkSelfPermission(this, Manifest.permission.READ_PHONE_STATE) != PackageManager.PERMISSION_GRANTED ||
            ContextCompat.checkSelfPermission(this, Manifest.permission.READ_CALL_LOG) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, arrayOf(
                Manifest.permission.RECORD_AUDIO,
                Manifest.permission.CALL_PHONE,
                Manifest.permission.WRITE_EXTERNAL_STORAGE,
                Manifest.permission.READ_PHONE_STATE,
                Manifest.permission.READ_CALL_LOG
            ), 1)
        }

        // Initiate call
        val phoneNumber = intent.getStringExtra("PHONE_NUMBER") ?: ""
        if (phoneNumber.isNotEmpty()) {
            startCall(phoneNumber)
        }
    }

    private fun startCall(phoneNumber: String) {
    val callIntent = Intent(Intent.ACTION_CALL).apply {
        data = Uri.parse("tel:$phoneNumber")
    }
    if (ContextCompat.checkSelfPermission(this, Manifest.permission.CALL_PHONE) == PackageManager.PERMISSION_GRANTED) {
        startActivity(callIntent)
    } else {
        Log.e("CallScreenActivity", "CALL_PHONE permission not granted")
    }
}

    private fun endCall() {
        // Implement end call functionality if necessary
    }

    private fun toggleHold() {
        isCallOnHold = !isCallOnHold
        // Implement logic to hold/unhold call
    }

    private fun toggleMute() {
        isCallMuted = !isCallMuted
        // Implement logic to mute/unmute call
    }

    private fun toggleRecord() {
        if (isRecording) {
            stopRecording()
        } else {
            startRecording()
        }
        isRecording = !isRecording
    }

    private fun startRecording() {
        // Implement recording functionality
    }

    private fun stopRecording() {
        // Implement stop recording functionality
    }

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == 1) {
            if (grantResults.isEmpty() || grantResults.any { it != PackageManager.PERMISSION_GRANTED }) {
                // Handle the case where permissions are denied
            }
        }
    }
}
