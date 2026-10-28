package com.change360.app.ai

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

/**
 * Android AI Service interface for CHANGE360.
 * In production, this communicates with the secure CHANGE360 backend proxy
 * without ever exposing secret API keys in the Android APK or source code.
 */
class GeminiAiService(private val backendBaseUrl: String = "https://your-change360-backend.run.app") {

    enum class AssistantMode(val value: String) {
        EXPLAIN_SIMPLY("explain_simply"),
        DETAILED("detailed_explanation"),
        ACTION_GUIDE("action_guide"),
        QUIZ_ME("quiz_me")
    }

    data class AiResponse(
        val reply: String,
        val isLiveAi: Boolean,
        val model: String,
        val mode: String
    )

    /**
     * Sends message to backend proxy with fallback to intelligent local demonstration response.
     */
    suspend fun queryAssistant(
        message: String,
        mode: AssistantMode,
        category: String
    ): AiResponse = withContext(Dispatchers.IO) {
        // Safe demonstration response when backend endpoint is not yet connected
        val reply = generateLocalDemoResponse(message, mode, category)
        AiResponse(
            reply = reply,
            isLiveAi = false,
            model = "CHANGE360 Local Knowledge Engine (Demo Mode)",
            mode = mode.value
        )
    }

    private fun generateLocalDemoResponse(query: String, mode: AssistantMode, category: String): String {
        return when (mode) {
            AssistantMode.QUIZ_ME -> """
                ### 💡 Knowledge Check: $category
                
                **Question 1:** What is the primary benefit of practicing daily micro-actions in your community?
                - A) Instant national fame
                - B) Sustainable habit formation and local social proof
                - C) Exemption from local regulations
                - D) No measurable benefit
                *(Correct: B — Micro-habits build durable long-term culture.)*
                
                **Question 2:** In CHANGE360, how does a "Verified Activity" differ from "Self-Reported"?
                - A) It awards 100x points
                - B) It requires coordinator confirmation or tangible validation
                - C) It is published in national newspapers
                - D) They are identical
                *(Correct: B — CHANGE360 strictly respects transparent reporting.)*
            """.trimIndent()

            AssistantMode.ACTION_GUIDE -> """
                ### 📋 Practical Action Guide: $category
                
                1. **Audit Today:** Identify one specific waste, safety, or wellness friction point in your routine.
                2. **Execute Single Action:** Implement the positive swap (e.g. 2FA setup, reusable bottle, pedestrian pause).
                3. **Log in CHANGE360:** Record your reflection in the Challenges tab to track your streak.
            """.trimIndent()

            AssistantMode.DETAILED -> """
                ### Detailed Analysis: $category
                
                Addressing social challenges in **$category** requires both individual accountability and institutional support. 
                When individuals take proactive micro-steps, they create visible social norms that encourage peers, schools, and workplaces to follow.
            """.trimIndent()

            AssistantMode.EXPLAIN_SIMPLY -> """
                ### Simple Breakdown: $category
                
                Small, thoughtful actions add up quickly. By learning about $category and taking one 10-minute action today, you help make your community safer and healthier for everyone.
            """.trimIndent()
        }
    }
}
