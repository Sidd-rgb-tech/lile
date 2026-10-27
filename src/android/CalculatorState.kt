package com.example.scientificcalculator.presentation

import com.example.scientificcalculator.domain.AngleMode

data class CalculationHistoryItem(
    val id: String = java.util.UUID.randomUUID().toString(),
    val expression: String,
    val result: String,
    val timestamp: Long = System.currentTimeMillis()
)

data class CalculatorState(
    val expression: String = "",
    val liveResult: String = "",
    val angleMode: AngleMode = AngleMode.DEG,
    val isScientificExpanded: Boolean = true,
    val isHistoryVisible: Boolean = false,
    val history: List<CalculationHistoryItem> = emptyList(),
    val memory: Double = 0.0,
    val hasMemory: Boolean = false,
    val errorMessage: String? = null
)
