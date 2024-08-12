package com.dialer

import android.app.Service
import android.content.Intent
import android.media.MediaRecorder
import android.os.Bundle
import android.os.IBinder
import android.telephony.PhoneStateListener
import android.telephony.TelephonyManager
import android.util.Log
import java.io.IOException

class CallRecordingService : Service() {

    private var mediaRecorder: MediaRecorder? = null
    private var isRecording = false
    private var fileName: String? = null

    override fun onCreate() {
        super.onCreate()

        // Initialize the phone state listener
        val phoneStateListener = object : PhoneStateListener() {
            override fun onCallStateChanged(state: Int, phoneNumber: String) {
                super.onCallStateChanged(state, phoneNumber)
                when (state) {
                    TelephonyManager.CALL_STATE_OFFHOOK -> {
                        startRecording()
                    }
                    TelephonyManager.CALL_STATE_IDLE -> {
                        stopRecording()
                    }
                }
            }
        }

        val telephonyManager = getSystemService(TELEPHONY_SERVICE) as TelephonyManager
        telephonyManager.listen(phoneStateListener, PhoneStateListener.LISTEN_CALL_STATE)
    }

    private fun startRecording() {
        if (isRecording) return

        fileName = "${externalCacheDir?.absolutePath}/call_recording_${System.currentTimeMillis()}.3gp"

        mediaRecorder = MediaRecorder().apply {
            setAudioSource(MediaRecorder.AudioSource.VOICE_CALL)
            setOutputFormat(MediaRecorder.OutputFormat.THREE_GPP)
            setAudioEncoder(MediaRecorder.AudioEncoder.AMR_NB)
            setOutputFile(fileName)

            try {
                prepare()
                start()
                isRecording = true
            } catch (e: IOException) {
                Log.e("CallRecordingService", "prepare() failed")
            }
        }
    }

    private fun stopRecording() {
        if (!isRecording) return

        mediaRecorder?.apply {
            stop()
            release()
            isRecording = false
        }
        mediaRecorder = null
    }

    override fun onBind(intent: Intent?): IBinder? {
        return null
    }

    override fun onDestroy() {
        super.onDestroy()
        stopRecording()
    }
}
