package com.change360.app

import android.app.Application
import com.change360.app.data.local.Change360Database
import com.change360.app.data.repository.Change360Repository

class Change360Application : Application() {
    val database: Change360Database by lazy { Change360Database.getDatabase(this) }
    val repository: Change360Repository by lazy { Change360Repository(database) }

    override fun onCreate() {
        super.onCreate()
    }
}
