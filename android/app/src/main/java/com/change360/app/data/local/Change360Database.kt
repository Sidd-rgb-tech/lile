package com.change360.app.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import com.change360.app.data.model.*

@Database(
    entities = [
        Challenge::class,
        ImpactRecord::class,
        PointTransaction::class,
        Badge::class,
        CampaignEntity::class,
        ImpactStoryEntity::class,
        SavedPosterEntity::class,
        ChatMessageEntity::class,
        UserProfile::class
    ],
    version = 2,
    exportSchema = false
)
@TypeConverters(Converters::class)
abstract class Change360Database : RoomDatabase() {
    abstract fun challengeDao(): ChallengeDao
    abstract fun impactDao(): ImpactDao
    abstract fun pointTransactionDao(): PointTransactionDao
    abstract fun badgeDao(): BadgeDao
    abstract fun campaignDao(): CampaignDao
    abstract fun impactStoryDao(): ImpactStoryDao
    abstract fun savedPosterDao(): SavedPosterDao
    abstract fun chatMessageDao(): ChatMessageDao
    abstract fun userProfileDao(): UserProfileDao

    companion object {
        @Volatile
        private var INSTANCE: Change360Database? = null

        fun getDatabase(context: Context): Change360Database {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    Change360Database::class.java,
                    "change360_database"
                )
                .fallbackToDestructiveMigration()
                .build()
                INSTANCE = instance
                instance
            }
        }
    }
}
