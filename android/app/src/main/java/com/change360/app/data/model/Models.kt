package com.change360.app.data.model

import androidx.room.Entity
import androidx.room.Index
import androidx.room.PrimaryKey
import java.util.UUID

/**
 * 20 Distinct Social Awareness Categories supported by CHANGE360.
 */
enum class AwarenessCategory(val displayName: String, val iconName: String) {
    ENVIRONMENT("Environment & Sustainability", "eco"),
    WASTE_MANAGEMENT("Waste Management & Recycling", "delete_outline"),
    CLIMATE("Climate & Conservation", "cloud"),
    EDUCATION("Education & Literacy", "menu_book"),
    EQUALITY("Equality & Inclusion", "group"),
    DIGITAL_SAFETY("Digital Literacy & Safety", "security"),
    CYBERBULLYING("Cyberbullying Awareness", "shield"),
    ROAD_SAFETY("Road Safety", "traffic"),
    COMMUNITY_SERVICE("Community Service & Volunteering", "volunteer_activism"),
    PHYSICAL_HEALTH("Physical Health & Habits", "fitness_center"),
    MENTAL_WELLBEING("Mental Well-being & Stress", "psychology"),
    WOMENS_SAFETY_HEALTH("Women's Safety & Health", "favorite_border"),
    CHILD_PROTECTION("Child Safety & Protection", "family_restroom"),
    CIVIC_RESPONSIBILITY("Civic Responsibility", "account_balance"),
    ANIMAL_WELFARE("Animal Welfare", "pets"),
    DISASTER_PREPAREDNESS("Disaster Preparedness", "warning"),
    RESPONSIBLE_TECH("Responsible Technology Use", "devices"),
    PUBLIC_HEALTH("Public Health Awareness", "local_hospital"),
    FINANCIAL_AWARENESS("Financial Literacy & Consumption", "savings"),
    SCHOOL_IMPROVEMENT("School & Community Improvement", "school");

    companion object {
        fun fromString(value: String): AwarenessCategory {
            return entries.find {
                it.name.equals(value, ignoreCase = true) || it.displayName.equals(value, ignoreCase = true)
            } ?: ENVIRONMENT
        }
    }
}

enum class ChallengeDifficulty {
    EASY,
    MEDIUM,
    HARD
}

enum class ChallengeStatus {
    NOT_STARTED,
    IN_PROGRESS,
    COMPLETED,
    AWAITING_VERIFICATION,
    VERIFIED
}

/**
 * Proof of Impact Framework (Section 10 of Specification):
 * 1. LEARNING_COMPLETED - Educational module/quiz passed
 * 2. SELF_REPORTED_ACTION - Honest user-reported daily habit
 * 3. VERIFIED_ACTIVITY - Confirmed by supervisor, coordinator, or photo timestamp
 * 4. MEASURED_OUTCOME - Concrete quantifiable community metric
 */
enum class ProofTier(val title: String, val description: String) {
    LEARNING_COMPLETED("Learning Completed", "Verified completion of an educational module or awareness quiz"),
    SELF_REPORTED_ACTION("Self-Reported Action", "Honest self-reported habit or community activity"),
    VERIFIED_ACTIVITY("Verified Activity", "Validated by a teacher, supervisor, or institutional code"),
    MEASURED_OUTCOME("Measured Outcome", "Quantifiable, documented community impact metric");

    companion object {
        fun fromString(value: String): ProofTier {
            return entries.find { it.name.equals(value, ignoreCase = true) } ?: SELF_REPORTED_ACTION
        }
    }
}

/**
 * Poster types supported by CHANGE360.
 */
enum class PosterType(val displayName: String) {
    DAILY_IMPACT("Daily Impact Poster"),
    WEEKLY_IMPACT("Weekly Impact Poster"),
    MONTHLY_IMPACT("Monthly Impact Poster"),
    CUSTOM_AWARENESS("Custom Awareness Poster"),
    SCHOOL_CAMPAIGN("School Campaign Poster"),
    COMMUNITY_CAMPAIGN("Community Campaign Poster")
}

/**
 * Room Entity: Challenge
 */
@Entity(tableName = "challenges")
data class Challenge(
    @PrimaryKey
    val id: String = UUID.randomUUID().toString(),
    val title: String,
    val category: AwarenessCategory,
    val difficulty: ChallengeDifficulty,
    val estimatedDurationMinutes: Int,
    val shortDescription: String,
    val learningObjective: String,
    val instructions: String,
    val expectedOutcome: String,
    val points: Int,
    val status: ChallengeStatus = ChallengeStatus.NOT_STARTED,
    val completionDate: Long? = null,
    val reflectionNotes: String? = null,
    val proofTier: ProofTier = ProofTier.SELF_REPORTED_ACTION,
    val isPointsAwarded: Boolean = false
)

/**
 * Room Entity: Activity / Impact Log Record
 */
@Entity(
    tableName = "impact_records",
    indices = [Index(value = ["relatedChallengeId"])]
)
data class ImpactRecord(
    @PrimaryKey
    val id: String = UUID.randomUUID().toString(),
    val title: String,
    val category: AwarenessCategory,
    val proofTier: ProofTier,
    val pointsEarned: Int,
    val timestamp: Long = System.currentTimeMillis(),
    val relatedChallengeId: String? = null,
    val notes: String = ""
)

/**
 * Room Entity: Point Transaction
 * Guarantees duplicate point award prevention at database level via unique activity index.
 */
@Entity(
    tableName = "point_transactions",
    indices = [Index(value = ["activityId"], unique = true)]
)
data class PointTransaction(
    @PrimaryKey
    val transactionId: String = UUID.randomUUID().toString(),
    val activityId: String,
    val sourceTitle: String,
    val category: AwarenessCategory,
    val points: Int,
    val timestamp: Long = System.currentTimeMillis()
)

/**
 * Room Entity: Badge
 */
@Entity(tableName = "badges")
data class Badge(
    @PrimaryKey
    val id: String,
    val title: String,
    val description: String,
    val iconName: String,
    val category: String,
    val isUnlocked: Boolean = false,
    val unlockedDate: Long? = null,
    val progress: Float = 0f
)

/**
 * Room Entity: Campaign
 */
@Entity(tableName = "campaigns")
data class CampaignEntity(
    @PrimaryKey
    val id: String,
    val title: String,
    val category: AwarenessCategory,
    val description: String,
    val objectives: List<String>,
    val durationText: String,
    val participantCount: Int,
    val isJoined: Boolean = false,
    val suggestedActions: List<String>
)

/**
 * Room Entity: Impact Story
 */
@Entity(tableName = "impact_stories")
data class ImpactStoryEntity(
    @PrimaryKey
    val id: String,
    val title: String,
    val category: AwarenessCategory,
    val summary: String,
    val actionTaken: String,
    val lessonsLearned: String,
    val suggestedActionForReader: String,
    val isFavorited: Boolean = false,
    val relatedChallengeId: String? = null
)

/**
 * Room Entity: Saved Posters
 */
@Entity(tableName = "saved_posters")
data class SavedPosterEntity(
    @PrimaryKey
    val id: String = UUID.randomUUID().toString(),
    val title: String,
    val posterType: PosterType,
    val category: AwarenessCategory,
    val templateName: String,
    val imageUriString: String?,
    val timestamp: Long = System.currentTimeMillis()
)

/**
 * Room Entity: AI Chat Messages (Conversation History)
 */
@Entity(tableName = "ai_chat_messages")
data class ChatMessageEntity(
    @PrimaryKey
    val id: String = UUID.randomUUID().toString(),
    val text: String,
    val isUser: Boolean,
    val timestamp: Long = System.currentTimeMillis(),
    val mode: String = "explain_simply",
    val isDemoNotice: Boolean = false
)

/**
 * Room Entity: User Profile & Onboarding Preferences
 */
@Entity(tableName = "user_profile")
data class UserProfile(
    @PrimaryKey
    val id: String = "local_user",
    val displayName: String = "Alex Morgan",
    val email: String? = null,
    val avatarUrl: String? = null,
    val isGuestMode: Boolean = true,
    val isGoogleUser: Boolean = false,
    val isOnboardingCompleted: Boolean = true,
    val dailyTargetMinutes: Int = 15,
    val preferredPosterVibe: String = "Vibrant Modern",
    val totalPoints: Int = 165,
    val currentStreakDays: Int = 3,
    val lastActiveDate: Long = System.currentTimeMillis(),
    val selectedCauses: List<String> = listOf(
        "Environment & Sustainability",
        "Waste Management & Recycling",
        "Digital Literacy & Safety",
        "Road Safety"
    ),
    val notificationsEnabled: Boolean = true,
    val isDarkMode: Boolean = false
)
