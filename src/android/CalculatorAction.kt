package com.example.scientificcalculator.presentation

import com.example.scientificcalculator.domain.AngleMode

sealed class CalculatorAction {
    data class EnterSymbol(val symbol: String) : CalculatorAction()
    data class EnterFunction(val func: String) : CalculatorAction()
    object Clear : CalculatorAction()
    object Delete : CalculatorAction()
    object Evaluate : CalculatorAction()
    object ToggleAngleMode : CalculatorAction()
    object ToggleScientificKeypad : CalculatorAction()
    object ToggleHistory : CalculatorAction()
    data class SelectHistoryItem(val item: CalculationHistoryItem, val loadAsExpression: Boolean = true) : CalculatorAction()
    object ClearHistory : CalculatorAction()
    object MemoryClear : CalculatorAction()
    object MemoryRecall : CalculatorAction()
    object MemoryAdd : CalculatorAction()
    object MemorySubtract : CalculatorAction()
    object MemoryStore : CalculatorAction()
}
