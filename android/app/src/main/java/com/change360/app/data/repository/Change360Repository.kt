package com.change360.app.data.repository

import androidx.room.withTransaction
import com.change360.app.data.local.Change360Database
import com.change360.app.data.model.*
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.firstOrNull
import java.util.concurrent.TimeUnit

class Change360Repository(private val database: Change360Database) {
    val challenges: Flow<List<Challenge>> = database.challengeDao().getAllChallenges()
    val impactRecords: Flow<List<ImpactRecord>> = database.impactDao().getAllRecords()
    val badges: Flow<List<Badge>> = database.badgeDao().getAllBadges()
    val campaigns: Flow<List<CampaignEntity>> = database.campaignDao().getAllCampaigns()
    val stories: Flow<List<ImpactStoryEntity>> = database.impactStoryDao().getAllStories()
    val savedPosters: Flow<List<SavedPosterEntity>> = database.savedPosterDao().getAllSavedPosters()
    val chatHistory: Flow<List<ChatMessageEntity>> = database.chatMessageDao().getChatHistory()
    val userProfile: Flow<UserProfile?> = database.userProfileDao().getUserProfile()

    suspend fun seedInitialDataIfEmpty() {
        val existing = database.challengeDao().getAllChallenges().firstOrNull()
        if (existing.isNullOrEmpty()) {
            database.challengeDao().insertChallenges(sampleChallenges)
            database.badgeDao().insertBadges(sampleBadges)
            database.campaignDao().insertCampaigns(sampleCampaigns)
            database.impactStoryDao().insertStories(sampleStories)
            database.userProfileDao().saveUserProfile(
                UserProfile(
                    displayName = "Alex Morgan",
                    isGuestMode = true,
                    totalPoints = 165,
                    currentStreakDays = 3,
                    lastActiveDate = System.currentTimeMillis() - 3600000,
                    selectedCauses = listOf(
                        "Environment & Sustainability",
                        "Waste Management & Recycling",
                        "Digital Literacy & Safety",
                        "Road Safety"
                    )
                )
            )

            // Initial activity history with evidence tiers
            database.impactDao().insertRecord(
                ImpactRecord(
                    id = "rec-init-1",
                    title = "Digital Privacy & 2FA Setup",
                    category = AwarenessCategory.DIGITAL_SAFETY,
                    proofTier = ProofTier.LEARNING_COMPLETED,
                    pointsEarned = 50,
                    timestamp = System.currentTimeMillis() - 86400000 * 2,
                    notes = "Configured 2-factor authentication and revoked unused OAuth apps."
                )
            )
            database.pointTransactionDao().insertTransaction(
                PointTransaction(
                    activityId = "rec-init-1",
                    sourceTitle = "Digital Privacy & 2FA Setup",
                    category = AwarenessCategory.DIGITAL_SAFETY,
                    points = 50,
                    timestamp = System.currentTimeMillis() - 86400000 * 2
                )
            )

            database.impactDao().insertRecord(
                ImpactRecord(
                    id = "rec-init-2",
                    title = "Single-Use Plastic Refusal Day",
                    category = AwarenessCategory.WASTE_MANAGEMENT,
                    proofTier = ProofTier.SELF_REPORTED_ACTION,
                    pointsEarned = 45,
                    timestamp = System.currentTimeMillis() - 86400000,
                    notes = "Carried personal stainless steel bottle and lunch container."
                )
            )
            database.pointTransactionDao().insertTransaction(
                PointTransaction(
                    activityId = "rec-init-2",
                    sourceTitle = "Single-Use Plastic Refusal Day",
                    category = AwarenessCategory.WASTE_MANAGEMENT,
                    points = 45,
                    timestamp = System.currentTimeMillis() - 86400000
                )
            )

            database.impactDao().insertRecord(
                ImpactRecord(
                    id = "rec-init-3",
                    title = "School Crosswalk Safety Monitoring",
                    category = AwarenessCategory.ROAD_SAFETY,
                    proofTier = ProofTier.VERIFIED_ACTIVITY,
                    pointsEarned = 70,
                    timestamp = System.currentTimeMillis() - 3600000 * 4,
                    notes = "Assisted morning junior crossing with campus safety monitor."
                )
            )
            database.pointTransactionDao().insertTransaction(
                PointTransaction(
                    activityId = "rec-init-3",
                    sourceTitle = "School Crosswalk Safety Monitoring",
                    category = AwarenessCategory.ROAD_SAFETY,
                    points = 70,
                    timestamp = System.currentTimeMillis() - 3600000 * 4
                )
            )
        }
    }

    suspend fun startChallenge(challengeId: String) {
        val challenge = database.challengeDao().getChallengeById(challengeId) ?: return
        if (challenge.status == ChallengeStatus.NOT_STARTED) {
            database.challengeDao().updateChallenge(challenge.copy(status = ChallengeStatus.IN_PROGRESS))
        }
    }

    /**
     * Completes a challenge with strict database-level transactional duplicate reward prevention.
     */
    suspend fun completeChallenge(
        challengeId: String,
        reflectionNotes: String,
        tier: ProofTier = ProofTier.SELF_REPORTED_ACTION
    ): Boolean {
        return database.withTransaction {
            val challenge = database.challengeDao().getChallengeById(challengeId) ?: return@withTransaction false

            // Strict check: if points already awarded or transaction exists, abort duplicate points
            val existingTx = database.pointTransactionDao().getTransactionByActivityId(challengeId)
            if (challenge.isPointsAwarded || existingTx != null) {
                return@withTransaction false
            }

            // 1. Record point transaction (unique constraint)
            val tx = PointTransaction(
                activityId = challenge.id,
                sourceTitle = challenge.title,
                category = challenge.category,
                points = challenge.points,
                timestamp = System.currentTimeMillis()
            )
            database.pointTransactionDao().insertTransaction(tx)

            // 2. Update challenge state
            val updated = challenge.copy(
                status = ChallengeStatus.COMPLETED,
                completionDate = System.currentTimeMillis(),
                reflectionNotes = reflectionNotes,
                proofTier = tier,
                isPointsAwarded = true
            )
            database.challengeDao().updateChallenge(updated)

            // 3. Record in impact history log
            database.impactDao().insertRecord(
                ImpactRecord(
                    title = challenge.title,
                    category = challenge.category,
                    proofTier = tier,
                    pointsEarned = challenge.points,
                    relatedChallengeId = challenge.id,
                    notes = reflectionNotes
                )
            )

            // 4. Update user profile points and consecutive streak
            val currentProfile = database.userProfileDao().getUserProfile().firstOrNull() ?: UserProfile()
            val now = System.currentTimeMillis()
            val daysDiff = TimeUnit.MILLISECONDS.toDays(now - currentProfile.lastActiveDate)

            val newStreak = when {
                daysDiff == 0L -> currentProfile.currentStreakDays // Same day, maintain
                daysDiff == 1L -> currentProfile.currentStreakDays + 1 // Consecutive day, increase
                else -> 1 // Reset if gap exceeded
            }

            database.userProfileDao().saveUserProfile(
                currentProfile.copy(
                    totalPoints = currentProfile.totalPoints + challenge.points,
                    currentStreakDays = newStreak,
                    lastActiveDate = now
                )
            )

            // 5. Evaluate and unlock badges based on actual records
            checkBadgeUnlocks()
            true
        }
    }

    suspend fun recordQuickDailyAction(title: String, points: Int) {
        val recordId = "daily-${System.currentTimeMillis()}"
        val tx = PointTransaction(
            activityId = recordId,
            sourceTitle = title,
            category = AwarenessCategory.WASTE_MANAGEMENT,
            points = points,
            timestamp = System.currentTimeMillis()
        )
        database.pointTransactionDao().insertTransaction(tx)

        database.impactDao().insertRecord(
            ImpactRecord(
                id = recordId,
                title = title,
                category = AwarenessCategory.WASTE_MANAGEMENT,
                proofTier = ProofTier.SELF_REPORTED_ACTION,
                pointsEarned = points,
                notes = "Completed daily awareness action recommendation."
            )
        )

        val profile = database.userProfileDao().getUserProfile().firstOrNull() ?: UserProfile()
        database.userProfileDao().saveUserProfile(
            profile.copy(
                totalPoints = profile.totalPoints + points,
                lastActiveDate = System.currentTimeMillis()
            )
        )
        checkBadgeUnlocks()
    }

    suspend fun saveGeneratedPoster(poster: SavedPosterEntity) {
        database.savedPosterDao().insertSavedPoster(poster)
        // Unlock awareness creator badge if not unlocked
        val allBadges = database.badgeDao().getAllBadges().firstOrNull() ?: return
        val creatorBadge = allBadges.find { it.id == "awareness_creator" }
        if (creatorBadge != null && !creatorBadge.isUnlocked) {
            database.badgeDao().updateBadge(
                creatorBadge.copy(
                    isUnlocked = true,
                    unlockedDate = System.currentTimeMillis(),
                    progress = 1.0f
                )
            )
        }
    }

    suspend fun toggleJoinCampaign(campaignId: String) {
        val list = database.campaignDao().getAllCampaigns().firstOrNull() ?: return
        val camp = list.find { it.id == campaignId } ?: return
        val newJoined = !camp.isJoined
        val newCount = if (newJoined) camp.participantCount + 1 else camp.participantCount - 1
        database.campaignDao().updateCampaign(camp.copy(isJoined = newJoined, participantCount = newCount))
    }

    suspend fun toggleStoryBookmark(storyId: String) {
        val list = database.impactStoryDao().getAllStories().firstOrNull() ?: return
        val story = list.find { it.id == storyId } ?: return
        database.impactStoryDao().updateStory(story.copy(isFavorited = !story.isFavorited))
    }

    suspend fun addChatMessage(msg: ChatMessageEntity) {
        database.chatMessageDao().insertMessage(msg)
    }

    suspend fun clearChatHistory() {
        database.chatMessageDao().clearHistory()
    }

    suspend fun updateUserProfile(profile: UserProfile) {
        database.userProfileDao().saveUserProfile(profile)
    }

    private suspend fun checkBadgeUnlocks() {
        val allBadges = database.badgeDao().getAllBadges().firstOrNull() ?: return
        val records = database.impactDao().getAllRecords().firstOrNull() ?: return

        for (badge in allBadges) {
            if (!badge.isUnlocked) {
                var shouldUnlock = false
                var progress = badge.progress

                when (badge.id) {
                    "first_step" -> {
                        progress = if (records.isNotEmpty()) 1f else 0f
                        shouldUnlock = records.isNotEmpty()
                    }
                    "learning_explorer" -> {
                        val learningCount = records.count { it.proofTier == ProofTier.LEARNING_COMPLETED }
                        progress = (learningCount / 3f).coerceIn(0f, 1f)
                        shouldUnlock = learningCount >= 3
                    }
                    "eco_champion" -> {
                        val count = records.count {
                            it.category == AwarenessCategory.ENVIRONMENT ||
                            it.category == AwarenessCategory.WASTE_MANAGEMENT ||
                            it.category == AwarenessCategory.CLIMATE
                        }
                        progress = (count / 3f).coerceIn(0f, 1f)
                        shouldUnlock = count >= 3
                    }
                    "digital_advocate" -> {
                        val count = records.count {
                            it.category == AwarenessCategory.DIGITAL_SAFETY ||
                            it.category == AwarenessCategory.CYBERBULLYING
                        }
                        progress = (count / 2f).coerceIn(0f, 1f)
                        shouldUnlock = count >= 2
                    }
                    "community_helper" -> {
                        val count = records.count {
                            it.category == AwarenessCategory.COMMUNITY_SERVICE ||
                            it.category == AwarenessCategory.CIVIC_RESPONSIBILITY
                        }
                        progress = (count / 2f).coerceIn(0f, 1f)
                        shouldUnlock = count >= 2
                    }
                }

                if (shouldUnlock && !badge.isUnlocked) {
                    database.badgeDao().updateBadge(
                        badge.copy(
                            isUnlocked = true,
                            unlockedDate = System.currentTimeMillis(),
                            progress = 1f
                        )
                    )
                } else if (progress != badge.progress) {
                    database.badgeDao().updateBadge(badge.copy(progress = progress))
                }
            }
        }
    }

    companion object {
        val sampleBadges = listOf(
            Badge("first_step", "First Step", "Completed your very first awareness action or learning module", "emoji_events", "General", true, System.currentTimeMillis() - 86400000 * 2, 1f),
            Badge("learning_explorer", "Learning Explorer", "Finished 3 educational quizzes across different awareness areas", "psychology", "Education", true, System.currentTimeMillis() - 86400000, 1f),
            Badge("eco_champion", "Eco Champion", "Took 3 verified sustainability and waste reduction actions", "eco", "Environment", false, null, 0.66f),
            Badge("digital_advocate", "Digital Safety Advocate", "Completed digital privacy and cyberbullying awareness activities", "security", "Digital", true, System.currentTimeMillis() - 86400000 * 2, 1f),
            Badge("community_helper", "Community Helper", "Logged volunteer participation in local civic or clean-up events", "volunteer_activism", "Community", false, null, 0.5f),
            Badge("healthy_habits", "Healthy Habits", "Maintained physical routine and mental well-being practices for 5 days", "favorite", "Health", false, null, 0.4f),
            Badge("awareness_creator", "Awareness Creator", "Designed and exported a high-impact social awareness poster", "palette", "Creative", false, null, 0.0f),
            Badge("campaign_contributor", "Campaign Contributor", "Participated in an official school or neighbourhood campaign", "campaign", "Community", false, null, 0.0f),
            Badge("seven_day_streak", "Seven-Day Streak", "Logged positive awareness activities for 7 consecutive days", "local_fire_department", "Consistency", false, null, 0.43f),
            Badge("positive_change_champion", "Positive Change Champion", "Earned 500+ points and inspired at least 5 community actions", "military_tech", "Mastery", false, null, 0.33f)
        )

        val sampleCampaigns = listOf(
            CampaignEntity(
                id = "camp-1",
                title = "City-Wide Plastic-Free Campus Drive",
                category = AwarenessCategory.WASTE_MANAGEMENT,
                description = "Schools and colleges unite to eliminate single-use beverage containers, promote refill stations, and run weekly waste audits.",
                objectives = listOf(
                    "Eliminate 10,000 single-use plastic bottles across campuses",
                    "Install 25 clean filtered water refill stations",
                    "Achieve 80% reusable container adoption in cafeterias"
                ),
                durationText = "Active • 12 days remaining",
                participantCount = 428,
                isJoined = true,
                suggestedActions = listOf(
                    "Carry your own reusable bottle daily",
                    "Organize a canteen packaging audit",
                    "Create and display a CHANGE360 campaign poster"
                )
            ),
            CampaignEntity(
                id = "camp-2",
                title = "Safe Crossings & Vision Zero Initiative",
                category = AwarenessCategory.ROAD_SAFETY,
                description = "Community-led effort to audit school crosswalks, educate pedestrians against phone distractions, and petition for traffic calming measures.",
                objectives = listOf(
                    "Audit 30 high-traffic crosswalks near schools",
                    "Distribute 500 reflective bag tags to young students",
                    "Achieve zero pedestrian close-calls near school gates"
                ),
                durationText = "Active • 18 days remaining",
                participantCount = 265,
                isJoined = false,
                suggestedActions = listOf(
                    "Practice distraction-free road crossing",
                    "Report faded crosswalk markings to city authorities",
                    "Advocate for pedestrian speed-bumps"
                )
            ),
            CampaignEntity(
                id = "camp-3",
                title = "Digital Upstanders Anti-Bullying Week",
                category = AwarenessCategory.CYBERBULLYING,
                description = "A nationwide student campaign empowering young people to support peers facing harassment, report toxic content, and build kind digital spaces.",
                objectives = listOf(
                    "Train 1,000 digital upstanders in safe intervention",
                    "Reach 50 participating high schools and colleges",
                    "Publish 200 student-designed positive awareness posters"
                ),
                durationText = "Starts in 4 days • 1-week intensive",
                participantCount = 612,
                isJoined = false,
                suggestedActions = listOf(
                    "Take the Upstander Protocol learning challenge",
                    "Send a supportive direct message to a peer",
                    "Share digital kindness guidelines"
                )
            )
        )

        val sampleStories = listOf(
            ImpactStoryEntity(
                id = "story-1",
                title = "How Oakridge High Replaced 15,000 Disposable Cups in One Semester",
                category = AwarenessCategory.WASTE_MANAGEMENT,
                summary = "A group of 8 high school sophomores turned their environmental science project into a campus-wide policy that eliminated disposable cafeteria cups.",
                actionTaken = "They installed 4 sensor-activated water dispensers, ran an impact poster campaign, and partnered with the alumni association to provide free insulated tumblers to all students.",
                lessonsLearned = "Behavior change requires reducing friction: when refilling is faster and cooler than buying single-use bottles, everyone participates naturally.",
                suggestedActionForReader = "Audit your classroom or workplace hydration options and propose a reusable tumbler initiative.",
                isFavorited = true,
                relatedChallengeId = "ch_waste_01"
            ),
            ImpactStoryEntity(
                id = "story-2",
                title = "Senior Scam Defense: Teen Volunteers Coach 120 Grandparents",
                category = AwarenessCategory.DIGITAL_SAFETY,
                summary = "High school computer club members hosted Saturday morning drop-in clinics at the community center to protect elders from phishing and SMS fraud.",
                actionTaken = "Volunteers set up call filters, walked seniors through recognizing fake banking texts, and provided laminated emergency contact cards.",
                lessonsLearned = "Patience and non-judgmental respect are the best defense. Seniors often hesitate to report scams out of embarrassment; creating a safe space changed everything.",
                suggestedActionForReader = "Spend 20 minutes with an older relative today reviewing their phone security settings and scam awareness.",
                isFavorited = false,
                relatedChallengeId = "ch_digital_01"
            )
        )

        val sampleChallenges = listOf(
            // 1. Waste Management
            Challenge(
                id = "ch_waste_01",
                title = "Zero-Waste Campus / Office Day",
                category = AwarenessCategory.WASTE_MANAGEMENT,
                difficulty = ChallengeDifficulty.EASY,
                estimatedDurationMinutes = 30,
                shortDescription = "Audit personal single-use plastics for 24 hours and commit to reusable swaps.",
                learningObjective = "Understand packaging lifecycle and prevent single-use microplastics from entering municipal waste streams.",
                instructions = "1. Carry a refillable container and cloth tote bag.\n2. Decline plastic cutlery, disposable cups, and plastic wrappers.\n3. Take a quick photo of your reusable kit and record your reflection notes.",
                expectedOutcome = "Prevented minimum 3 items of single-use plastic waste.",
                points = 45,
                status = ChallengeStatus.COMPLETED,
                completionDate = System.currentTimeMillis() - 86400000,
                reflectionNotes = "Used personal tumbler for coffee and packed lunch in reusable glass box.",
                proofTier = ProofTier.SELF_REPORTED_ACTION,
                isPointsAwarded = true
            ),
            // 2. Environment
            Challenge(
                id = "ch_env_01",
                title = "Document 3 Native Urban Plants",
                category = AwarenessCategory.ENVIRONMENT,
                difficulty = ChallengeDifficulty.MEDIUM,
                estimatedDurationMinutes = 40,
                shortDescription = "Explore your local park or neighbourhood to identify 3 native trees or pollinator plants.",
                learningObjective = "Discover how native biodiversity supports urban cooling, bird life, and groundwater retention.",
                instructions = "1. Walk a 500-meter radius around your home or school.\n2. Locate 3 indigenous plant or tree varieties.\n3. Note their flowering stage and shade contribution in your reflection.",
                expectedOutcome = "Identified 3 local native plant species.",
                points = 55
            ),
            // 3. Climate
            Challenge(
                id = "ch_climate_01",
                title = "Home Standby Power Audit",
                category = AwarenessCategory.CLIMATE,
                difficulty = ChallengeDifficulty.EASY,
                estimatedDurationMinutes = 20,
                shortDescription = "Hunt down \"vampire power\" devices running on continuous standby mode.",
                learningObjective = "Understand domestic electricity wastage and simple conservation tactics.",
                instructions = "1. Check televisions, microwave displays, console chargers, and computer monitors.\n2. Switch off power strips when not in active use.\n3. Note estimated watts saved.",
                expectedOutcome = "Eliminated unnecessary domestic phantom electricity draw.",
                points = 40
            ),
            // 4. Digital Safety
            Challenge(
                id = "ch_digital_01",
                title = "Account Privacy & 2FA Fortress",
                category = AwarenessCategory.DIGITAL_SAFETY,
                difficulty = ChallengeDifficulty.MEDIUM,
                estimatedDurationMinutes = 25,
                shortDescription = "Audit primary email and social accounts to activate multi-factor authentication.",
                learningObjective = "Prevent credential stuffing and account hijacking attacks.",
                instructions = "1. Open Google / email security dashboard.\n2. Turn on Authenticator 2FA.\n3. Review active device logins and terminate unfamiliar sessions.",
                expectedOutcome = "Secured primary personal account with 2FA.",
                points = 50,
                status = ChallengeStatus.COMPLETED,
                completionDate = System.currentTimeMillis() - 86400000 * 2,
                reflectionNotes = "Enabled Google Authenticator and closed 2 legacy sessions.",
                proofTier = ProofTier.LEARNING_COMPLETED,
                isPointsAwarded = true
            ),
            // 5. Cyberbullying
            Challenge(
                id = "ch_cyber_01",
                title = "The Upstander Protocol Checklist",
                category = AwarenessCategory.CYBERBULLYING,
                difficulty = ChallengeDifficulty.EASY,
                estimatedDurationMinutes = 15,
                shortDescription = "Learn and commit to the 4 rules of safe digital upstanding when witnessing online toxicity.",
                learningObjective = "Shift from a passive bystander to an empathetic supporter without escalating hostility.",
                instructions = "1. Read the non-confrontational direct message support template.\n2. Learn how to screenshot and report harassment through platform tools.\n3. Pledge to check in on targeted peers privately.",
                expectedOutcome = "Mastery of safe digital intervention methods.",
                points = 40
            ),
            // 6. Road Safety
            Challenge(
                id = "ch_road_01",
                title = "Distraction-Free Crosswalk Commitment",
                category = AwarenessCategory.ROAD_SAFETY,
                difficulty = ChallengeDifficulty.EASY,
                estimatedDurationMinutes = 10,
                shortDescription = "Pocket your phone and pause earbuds at every roadway intersection today.",
                learningObjective = "Eliminate situational blindness and avoid pedestrian collisions.",
                instructions = "1. Put mobile devices away 10 meters before approaching any crosswalk.\n2. Make direct eye contact with approaching drivers before stepping onto the street.\n3. Log your commitment.",
                expectedOutcome = "100% focused crossing behavior.",
                points = 35
            ),
            // 7. Community Service
            Challenge(
                id = "ch_comm_01",
                title = "Sidewalk & Park Micro-Litter Cleanup",
                category = AwarenessCategory.COMMUNITY_SERVICE,
                difficulty = ChallengeDifficulty.MEDIUM,
                estimatedDurationMinutes = 35,
                shortDescription = "Dedicate 30 minutes to collecting discarded litter along a public walking path.",
                learningObjective = "Foster civic pride and stop litter from washing into storm sewers.",
                instructions = "1. Wear protective gloves and carry a trash bag.\n2. Safely collect plastic bottles, wrappers, and cans.\n3. Dispose of collected waste in proper sorted bins.",
                expectedOutcome = "Cleaned a 200m stretch of shared civic space.",
                points = 65
            ),
            // 8. Physical Health
            Challenge(
                id = "ch_health_01",
                title = "Hourly Desk Ergonomics & Hydration Reset",
                category = AwarenessCategory.PHYSICAL_HEALTH,
                difficulty = ChallengeDifficulty.EASY,
                estimatedDurationMinutes = 15,
                shortDescription = "Take 2-minute posture stretches every hour and drink 2 liters of pure water.",
                learningObjective = "Mitigate prolonged spinal compression and boost mental alertness.",
                instructions = "1. Set an hourly chime or timer.\n2. Stand, roll shoulders backward 10 times, stretch hip flexors.\n3. Drink a cup of water.",
                expectedOutcome = "Relieved cervical tension and maintained optimal hydration.",
                points = 30
            ),
            // 9. Mental Well-being
            Challenge(
                id = "ch_mental_01",
                title = "5-4-3-2-1 Sensory Grounding Practice",
                category = AwarenessCategory.MENTAL_WELLBEING,
                difficulty = ChallengeDifficulty.EASY,
                estimatedDurationMinutes = 10,
                shortDescription = "Learn and execute sensory grounding to calm acute academic or work stress.",
                learningObjective = "Down-regulate autonomic nervous system during stress spikes.",
                instructions = "1. Name 5 things you can see around you.\n2. Name 4 things you can physically feel.\n3. Name 3 things you hear.\n4. Name 2 things you smell.\n5. Name 1 positive thing you taste or appreciate.",
                expectedOutcome = "Restored emotional baseline and calm breathing.",
                points = 35
            ),
            // 10. Women's Safety & Health
            Challenge(
                id = "ch_women_01",
                title = "Respectful Spaces & Boundary Awareness",
                category = AwarenessCategory.WOMENS_SAFETY_HEALTH,
                difficulty = ChallengeDifficulty.EASY,
                estimatedDurationMinutes = 20,
                shortDescription = "Review interpersonal boundary charters and language habits in shared groups.",
                learningObjective = "Champion an environment where everyone feels respected, valued, and safe.",
                instructions = "1. Read the community communication standards on consent and respect.\n2. Reflect on conversational dynamics in team or peer chats.\n3. Write a 2-sentence reflection on fostering inclusive safety.",
                expectedOutcome = "Demonstrated commitment to respectful peer culture.",
                points = 45
            ),
            // 11. Child Protection
            Challenge(
                id = "ch_child_01",
                title = "Kid-Safe Online Navigation Checklist",
                category = AwarenessCategory.CHILD_PROTECTION,
                difficulty = ChallengeDifficulty.MEDIUM,
                estimatedDurationMinutes = 25,
                shortDescription = "Review search filters and privacy safeguards on devices used by younger students or siblings.",
                learningObjective = "Protect younger learners from age-inappropriate content and predatory interactions.",
                instructions = "1. Enable SafeSearch in Google and YouTube Restricted Mode.\n2. Teach a younger family member or mentee the rule never to share location or real names online.\n3. Record your verification notes.",
                expectedOutcome = "Secured household digital environment for minors.",
                points = 50
            ),
            // 12. Civic Responsibility
            Challenge(
                id = "ch_civic_01",
                title = "Municipal Civic Issue Reporting",
                category = AwarenessCategory.CIVIC_RESPONSIBILITY,
                difficulty = ChallengeDifficulty.MEDIUM,
                estimatedDurationMinutes = 30,
                shortDescription = "Locate your local city/municipal grievance portal and report a civic repair need.",
                learningObjective = "Practice participatory democracy by reporting broken lights, potholes, or blocked storm drains.",
                instructions = "1. Download or open your local city authority app/portal.\n2. Photograph a public maintenance issue (e.g. broken sign, damaged sidewalk).\n3. Submit an official ticket and record the confirmation number.",
                expectedOutcome = "Submitted a legitimate municipal repair request.",
                points = 60
            ),
            // 13. Animal Welfare
            Challenge(
                id = "ch_animal_01",
                title = "Outdoor Hydration Bowl for Birds & Wildlife",
                category = AwarenessCategory.ANIMAL_WELFARE,
                difficulty = ChallengeDifficulty.EASY,
                estimatedDurationMinutes = 15,
                shortDescription = "Place a clean, shallow water basin in a shaded outdoor spot for urban wildlife.",
                learningObjective = "Support urban fauna during warm weather and promote compassionate coexistence.",
                instructions = "1. Clean a shallow clay or ceramic dish.\n2. Place in a shaded, safe balcony or garden spot away from predators.\n3. Commit to refilling fresh water daily for 3 days.",
                expectedOutcome = "Maintained wildlife hydration spot.",
                points = 40
            ),
            // 14. Disaster Preparedness
            Challenge(
                id = "ch_disaster_01",
                title = "Emergency Contact Card & Torch Check",
                category = AwarenessCategory.DISASTER_PREPAREDNESS,
                difficulty = ChallengeDifficulty.EASY,
                estimatedDurationMinutes = 20,
                shortDescription = "Create a physical emergency numbers wallet card and test emergency flashlights.",
                learningObjective = "Ensure communication preparedness during cellular grid or power outages.",
                instructions = "1. Write emergency contacts (family, local medical, emergency services) on a sturdy card.\n2. Keep it in your wallet.\n3. Test household emergency flashlights and spare batteries.",
                expectedOutcome = "Physical contingency contact system in place.",
                points = 40
            ),
            // 15. Responsible Tech
            Challenge(
                id = "ch_tech_01",
                title = "Digital Sunset & Screen Curfew",
                category = AwarenessCategory.RESPONSIBLE_TECH,
                difficulty = ChallengeDifficulty.EASY,
                estimatedDurationMinutes = 15,
                shortDescription = "Set a 1-hour screen curfew before bedtime and disable non-essential app alerts.",
                learningObjective = "Reclaim sleep quality and cognitive autonomy from attention-economy algorithms.",
                instructions = "1. Put phone on \"Do Not Disturb\" 60 minutes before scheduled sleep.\n2. Read a physical book or listen to calming audio instead.\n3. Log morning restedness level.",
                expectedOutcome = "Experienced restorative phone-free evening.",
                points = 35
            ),
            // 16. Public Health
            Challenge(
                id = "ch_pubhealth_01",
                title = "Proper Hand Hygiene & Sanitization Drill",
                category = AwarenessCategory.PUBLIC_HEALTH,
                difficulty = ChallengeDifficulty.EASY,
                estimatedDurationMinutes = 10,
                shortDescription = "Review and execute the WHO 20-second hand hygiene technique.",
                learningObjective = "Break transmission chains for seasonal influenza and foodborne pathogens.",
                instructions = "1. Follow the 6-step WHO technique: palms, interlaced fingers, knuckles, thumbs, and wrists.\n2. Practice with soap and warm water for at least 20 seconds.\n3. Teach technique to one friend or family member.",
                expectedOutcome = "Reinforced gold-standard personal sanitization routine.",
                points = 30
            ),
            // 17. Financial Literacy
            Challenge(
                id = "ch_finance_01",
                title = "The 48-Hour Impulse Purchase Pause",
                category = AwarenessCategory.FINANCIAL_AWARENESS,
                difficulty = ChallengeDifficulty.EASY,
                estimatedDurationMinutes = 15,
                shortDescription = "Commit to holding any non-essential online checkout in wishlist for 48 hours.",
                learningObjective = "Cultivate mindful financial habits and decrease consumer packaging waste.",
                instructions = "1. Move any discretionary cart items to a \"Wait 48h\" wishlist.\n2. Re-evaluate after two days if the item is genuinely required.\n3. Reflect on emotional vs functional buying triggers.",
                expectedOutcome = "Prevented wasteful impulse purchasing.",
                points = 40
            ),
            // 18. School Improvement
            Challenge(
                id = "ch_school_01",
                title = "Textbook & Study Material Book Drive",
                category = AwarenessCategory.SCHOOL_IMPROVEMENT,
                difficulty = ChallengeDifficulty.MEDIUM,
                estimatedDurationMinutes = 30,
                shortDescription = "Gather gently used textbooks or reading books to donate to junior learners or library.",
                learningObjective = "Promote circular educational resources and support peer learning equity.",
                instructions = "1. Gather 2 or more complete study books or classic novels in good condition.\n2. Pass them to a school library, community free-library box, or junior student.\n3. Record who benefited.",
                expectedOutcome = "Extended useful life of educational materials.",
                points = 55
            ),
            // 19. Equality & Inclusion
            Challenge(
                id = "ch_equality_01",
                title = "Accessibility & Barrier Audit Walkthrough",
                category = AwarenessCategory.EQUALITY,
                difficulty = ChallengeDifficulty.MEDIUM,
                estimatedDurationMinutes = 25,
                shortDescription = "Examine school or workplace routes from the perspective of someone with mobility limitations.",
                learningObjective = "Understand physical and sensory barriers experienced by persons with disabilities.",
                instructions = "1. Walk main entrances, corridors, and restrooms.\n2. Check for wheelchair ramp slopes, tactile pathways, automatic doors, and braille signage.\n3. Document any hazardous obstacles.",
                expectedOutcome = "Identified concrete accessibility improvement opportunities.",
                points = 50
            ),
            // 20. Education & Literacy
            Challenge(
                id = "ch_edu_01",
                title = "Peer Mentoring 30-Minute Knowledge Share",
                category = AwarenessCategory.EDUCATION,
                difficulty = ChallengeDifficulty.MEDIUM,
                estimatedDurationMinutes = 35,
                shortDescription = "Spend 30 minutes helping a classmate or younger peer master a difficult topic.",
                learningObjective = "Strengthen collaborative study habits and community academic confidence.",
                instructions = "1. Choose a subject you are confident in (math, grammar, coding, or science).\n2. Coach a peer with patience, asking guiding questions rather than doing it for them.\n3. Summarize key takeaways together.",
                expectedOutcome = "Helped a peer overcome an academic hurdle.",
                points = 60
            )
        )
    }
}
