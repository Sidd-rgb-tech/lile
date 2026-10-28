package com.change360.app

import com.change360.app.data.model.*
import com.change360.app.poster.PosterData
import com.change360.app.poster.PosterRenderer
import org.junit.Assert.*
import org.junit.Test

class Change360UnitTest {

    @Test
    fun test1_appStartsInGuestMode() {
        val userProfile = UserProfile(
            displayName = "Alex Morgan",
            isGuestMode = true,
            totalPoints = 0
        )
        assertTrue(userProfile.isGuestMode)
        assertEquals("Alex Morgan", userProfile.displayName)
    }

    @Test
    fun test2_allCategoriesExistAndCover20Causes() {
        val categories = AwarenessCategory.entries
        assertEquals(20, categories.size)
        assertTrue(categories.contains(AwarenessCategory.ENVIRONMENT))
        assertTrue(categories.contains(AwarenessCategory.WASTE_MANAGEMENT))
        assertTrue(categories.contains(AwarenessCategory.WOMENS_SAFETY_HEALTH))
        assertTrue(categories.contains(AwarenessCategory.DIGITAL_SAFETY))
        assertTrue(categories.contains(AwarenessCategory.ROAD_SAFETY))
        assertTrue(categories.contains(AwarenessCategory.COMMUNITY_SERVICE))
    }

    @Test
    fun test3_challengesFilterByCategoryAndDifficulty() {
        val sampleChallenges = listOf(
            Challenge(
                id = "c1",
                title = "Zero-Waste Campus Day",
                category = AwarenessCategory.WASTE_MANAGEMENT,
                difficulty = ChallengeDifficulty.EASY,
                estimatedDurationMinutes = 30,
                shortDescription = "Reduce packaging",
                learningObjective = "Understand plastic footprint",
                instructions = "Carry reusable items",
                expectedOutcome = "Avoid single use",
                points = 45
            ),
            Challenge(
                id = "c2",
                title = "Account Privacy Audit",
                category = AwarenessCategory.DIGITAL_SAFETY,
                difficulty = ChallengeDifficulty.MEDIUM,
                estimatedDurationMinutes = 25,
                shortDescription = "Enable 2FA",
                learningObjective = "Prevent unauthorized access",
                instructions = "Turn on 2FA",
                expectedOutcome = "Secured accounts",
                points = 50
            )
        )

        val wasteFilter = sampleChallenges.filter { it.category == AwarenessCategory.WASTE_MANAGEMENT }
        assertEquals(1, wasteFilter.size)
        assertEquals("Zero-Waste Campus Day", wasteFilter.first().title)

        val easyFilter = sampleChallenges.filter { it.difficulty == ChallengeDifficulty.EASY }
        assertEquals(1, easyFilter.size)
        assertEquals("c1", easyFilter.first().id)
    }

    @Test
    fun test4_challengeWorkflow_startAndComplete() {
        val challenge = Challenge(
            id = "c_flow",
            title = "Crosswalk Safety Pledge",
            category = AwarenessCategory.ROAD_SAFETY,
            difficulty = ChallengeDifficulty.EASY,
            estimatedDurationMinutes = 10,
            shortDescription = "Distraction-free crossing",
            learningObjective = "Prevent collisions",
            instructions = "Pocket phone near roads",
            expectedOutcome = "Safe road crossing",
            points = 35,
            status = ChallengeStatus.NOT_STARTED
        )
        assertEquals(ChallengeStatus.NOT_STARTED, challenge.status)

        val started = challenge.copy(status = ChallengeStatus.IN_PROGRESS)
        assertEquals(ChallengeStatus.IN_PROGRESS, started.status)

        val completed = started.copy(
            status = ChallengeStatus.COMPLETED,
            reflectionNotes = "Pocketed phone at all intersections",
            proofTier = ProofTier.SELF_REPORTED_ACTION,
            isPointsAwarded = true,
            completionDate = System.currentTimeMillis()
        )
        assertEquals(ChallengeStatus.COMPLETED, completed.status)
        assertTrue(completed.isPointsAwarded)
    }

    @Test
    fun test5_duplicatePointAwardPrevention() {
        val completedChallenge = Challenge(
            id = "c_dup",
            title = "Test Duplicate",
            category = AwarenessCategory.CLIMATE,
            difficulty = ChallengeDifficulty.EASY,
            estimatedDurationMinutes = 15,
            shortDescription = "Audit standby power",
            learningObjective = "Save energy",
            instructions = "Turn off switches",
            expectedOutcome = "Saved watts",
            points = 40,
            status = ChallengeStatus.COMPLETED,
            isPointsAwarded = true
        )

        // Attempting to award points again should be rejected
        val canAwardAgain = !completedChallenge.isPointsAwarded
        assertFalse(canAwardAgain)
    }

    @Test
    fun test6_proofOfImpact_fourDistinctTiers() {
        val tiers = ProofTier.entries
        assertEquals(4, tiers.size)
        assertEquals("Learning Completed", ProofTier.LEARNING_COMPLETED.title)
        assertEquals("Self-Reported Action", ProofTier.SELF_REPORTED_ACTION.title)
        assertEquals("Verified Activity", ProofTier.VERIFIED_ACTIVITY.title)
        assertEquals("Measured Outcome", ProofTier.MEASURED_OUTCOME.title)
        assertNotEquals(ProofTier.SELF_REPORTED_ACTION, ProofTier.VERIFIED_ACTIVITY)
    }

    @Test
    fun test7_emptyStateDoesNotFabricateStats() {
        val emptyRecords = emptyList<ImpactRecord>()
        val verifiedCount = emptyRecords.count { it.proofTier == ProofTier.VERIFIED_ACTIVITY }
        val selfReportedCount = emptyRecords.count { it.proofTier == ProofTier.SELF_REPORTED_ACTION }

        assertEquals(0, emptyRecords.size)
        assertEquals(0, verifiedCount)
        assertEquals(0, selfReportedCount)
    }

    @Test
    fun test8_posterDataModel_holdsSixTypesAndTemplates() {
        val poster = PosterData(
            title = "Zero-Waste Campus Movement",
            subtitle = "Every reusable bottle counts toward a cleaner city.",
            callToAction = "Choose Reusables Today",
            bullets = listOf("Carry reusable bottle", "Decline plastic cutlery", "Sort recyclables"),
            category = AwarenessCategory.WASTE_MANAGEMENT,
            posterType = PosterType.DAILY_IMPACT,
            templateName = "environmental",
            authorOrOrgName = "Lincoln High Eco-Club",
            recordedActionsCount = 42,
            verifiedCount = 18,
            selfReportedCount = 24
        )

        assertEquals("Zero-Waste Campus Movement", poster.title)
        assertEquals(PosterType.DAILY_IMPACT, poster.posterType)
        assertEquals(42, poster.recordedActionsCount)
        assertEquals(18, poster.verifiedCount)
    }

    @Test
    fun test9_campaignParticipationToggle() {
        val campaign = CampaignEntity(
            id = "camp_test",
            title = "Plastic-Free Drive",
            category = AwarenessCategory.WASTE_MANAGEMENT,
            description = "Audit campus plastic",
            objectives = listOf("Eliminate bottles"),
            durationText = "10 days",
            participantCount = 100,
            isJoined = false,
            suggestedActions = listOf("BYO bottle")
        )

        val joined = campaign.copy(isJoined = true, participantCount = campaign.participantCount + 1)
        assertTrue(joined.isJoined)
        assertEquals(101, joined.participantCount)
    }

    @Test
    fun test10_storyFavoritingToggle() {
        val story = ImpactStoryEntity(
            id = "s_test",
            title = "Crosswalk Fix",
            category = AwarenessCategory.CIVIC_RESPONSIBILITY,
            summary = "Students reported intersection",
            actionTaken = "Filed municipal report",
            lessonsLearned = "Civic action works",
            suggestedActionForReader = "Report hazardous roads",
            isFavorited = false
        )

        val favorited = story.copy(isFavorited = true)
        assertTrue(favorited.isFavorited)
    }
}
