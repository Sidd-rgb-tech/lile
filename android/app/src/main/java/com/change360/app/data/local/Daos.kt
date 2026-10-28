package com.change360.app.data.local

import androidx.room.*
import com.change360.app.data.model.*
import kotlinx.coroutines.flow.Flow

@Dao
interface ChallengeDao {
    @Query("SELECT * FROM challenges ORDER BY title ASC")
    fun getAllChallenges(): Flow<List<Challenge>>

    @Query("SELECT * FROM challenges WHERE category = :categoryName")
    fun getChallengesByCategory(categoryName: String): Flow<List<Challenge>>

    @Query("SELECT * FROM challenges WHERE id = :id LIMIT 1")
    suspend fun getChallengeById(id: String): Challenge?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertChallenges(challenges: List<Challenge>)

    @Update
    suspend fun updateChallenge(challenge: Challenge)
}

@Dao
interface ImpactDao {
    @Query("SELECT * FROM impact_records ORDER BY timestamp DESC")
    fun getAllRecords(): Flow<List<ImpactRecord>>

    @Query("SELECT * FROM impact_records WHERE timestamp >= :sinceTimestamp ORDER BY timestamp DESC")
    fun getRecordsSince(sinceTimestamp: Long): Flow<List<ImpactRecord>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertRecord(record: ImpactRecord)

    @Query("SELECT SUM(pointsEarned) FROM impact_records")
    fun getTotalPoints(): Flow<Int?>
}

@Dao
interface PointTransactionDao {
    @Query("SELECT * FROM point_transactions WHERE activityId = :activityId LIMIT 1")
    suspend fun getTransactionByActivityId(activityId: String): PointTransaction?

    @Insert(onConflict = OnConflictStrategy.ABORT)
    suspend fun insertTransaction(transaction: PointTransaction): Long
}

@Dao
interface BadgeDao {
    @Query("SELECT * FROM badges")
    fun getAllBadges(): Flow<List<Badge>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertBadges(badges: List<Badge>)

    @Update
    suspend fun updateBadge(badge: Badge)
}

@Dao
interface CampaignDao {
    @Query("SELECT * FROM campaigns ORDER BY title ASC")
    fun getAllCampaigns(): Flow<List<CampaignEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertCampaigns(campaigns: List<CampaignEntity>)

    @Update
    suspend fun updateCampaign(campaign: CampaignEntity)
}

@Dao
interface ImpactStoryDao {
    @Query("SELECT * FROM impact_stories ORDER BY title ASC")
    fun getAllStories(): Flow<List<ImpactStoryEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertStories(stories: List<ImpactStoryEntity>)

    @Update
    suspend fun updateStory(story: ImpactStoryEntity)
}

@Dao
interface SavedPosterDao {
    @Query("SELECT * FROM saved_posters ORDER BY timestamp DESC")
    fun getAllSavedPosters(): Flow<List<SavedPosterEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertSavedPoster(poster: SavedPosterEntity)
}

@Dao
interface ChatMessageDao {
    @Query("SELECT * FROM ai_chat_messages ORDER BY timestamp ASC")
    fun getChatHistory(): Flow<List<ChatMessageEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertMessage(message: ChatMessageEntity)

    @Query("DELETE FROM ai_chat_messages")
    suspend fun clearHistory()
}

@Dao
interface UserProfileDao {
    @Query("SELECT * FROM user_profile WHERE id = 'local_user' LIMIT 1")
    fun getUserProfile(): Flow<UserProfile?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun saveUserProfile(profile: UserProfile)
}
