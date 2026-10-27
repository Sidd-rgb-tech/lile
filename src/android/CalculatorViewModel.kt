package com.example.scientificcalculator.presentation

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.scientificcalculator.domain.AngleMode
import com.example.scientificcalculator.domain.EvaluationResult
import com.example.scientificcalculator.domain.ExpressionEvaluator
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

class CalculatorViewModel(
    private val evaluator: ExpressionEvaluator = ExpressionEvaluator()
) : ViewModel() {

    private val _state = MutableStateFlow(CalculatorState())
    val state: StateFlow<CalculatorState> = _state.asStateFlow()

    fun onAction(action: CalculatorAction) {
        when (action) {
            is CalculatorAction.EnterSymbol -> appendSymbol(action.symbol)
            is CalculatorAction.EnterFunction -> appendFunction(action.func)
            is CalculatorAction.Clear -> clear()
            is CalculatorAction.Delete -> deleteLastChar()
            is CalculatorAction.Evaluate -> calculateFinalResult()
            is CalculatorAction.ToggleAngleMode -> toggleAngleMode()
            is CalculatorAction.ToggleScientificKeypad -> toggleScientificKeypad()
            is CalculatorAction.ToggleHistory -> toggleHistory()
            is CalculatorAction.SelectHistoryItem -> selectHistoryItem(action.item, action.loadAsExpression)
            is CalculatorAction.ClearHistory -> clearHistory()
            is CalculatorAction.MemoryClear -> memoryClear()
            is CalculatorAction.MemoryRecall -> memoryRecall()
            is CalculatorAction.MemoryAdd -> memoryAdd()
            is CalculatorAction.MemorySubtract -> memorySubtract()
            is CalculatorAction.MemoryStore -> memoryStore()
        }
    }

    private fun appendSymbol(symbol: String) {
        _state.update { currentState ->
            val newExpr = currentState.expression + symbol
            val liveRes = calculatePreview(newExpr, currentState.angleMode)
            currentState.copy(
                expression = newExpr,
                liveResult = liveRes,
                errorMessage = null
            )
        }
    }

    private fun appendFunction(funcName: String) {
        _state.update { currentState ->
            val formattedFunc = when (funcName) {
                "x²" -> "^2"
                "x³" -> "^3"
                "xʸ" -> "^"
                "√" -> "√("
                "1/x" -> "1/("
                "x!" -> "!"
                "|" -> "abs("
                else -> "$funcName("
            }
            val newExpr = currentState.expression + formattedFunc
            val liveRes = calculatePreview(newExpr, currentState.angleMode)
            currentState.copy(
                expression = newExpr,
                liveResult = liveRes,
                errorMessage = null
            )
        }
    }

    private fun clear() {
        _state.update {
            it.copy(
                expression = "",
                liveResult = "",
                errorMessage = null
            )
        }
    }

    private fun deleteLastChar() {
        _state.update { currentState ->
            if (currentState.expression.isEmpty()) return@update currentState
            val newExpr = currentState.expression.dropLast(1)
            val liveRes = calculatePreview(newExpr, currentState.angleMode)
            currentState.copy(
                expression = newExpr,
                liveResult = liveRes,
                errorMessage = null
            )
        }
    }

    private fun calculateFinalResult() {
        val currentState = _state.value
        val expr = currentState.expression.trim()
        if (expr.isEmpty()) return

        when (val result = evaluator.evaluate(expr, currentState.angleMode)) {
            is EvaluationResult.Success -> {
                val formattedResult = formatResult(result.value)
                val newHistoryItem = CalculationHistoryItem(
                    expression = expr,
                    result = formattedResult
                )
                _state.update {
                    it.copy(
                        expression = formattedResult,
                        liveResult = "",
                        history = listOf(newHistoryItem) + it.history,
                        errorMessage = null
                    )
                }
            }
            is EvaluationResult.Error -> {
                _state.update {
                    it.copy(
                        errorMessage = result.message,
                        liveResult = ""
                    )
                }
            }
        }
    }

    private fun toggleAngleMode() {
        _state.update { currentState ->
            val newMode = if (currentState.angleMode == AngleMode.DEG) AngleMode.RAD else AngleMode.DEG
            val liveRes = calculatePreview(currentState.expression, newMode)
            currentState.copy(
                angleMode = newMode,
                liveResult = liveRes
            )
        }
    }

    private fun toggleScientificKeypad() {
        _state.update { it.copy(isScientificExpanded = !it.isScientificExpanded) }
    }

    private fun toggleHistory() {
        _state.update { it.copy(isHistoryVisible = !it.isHistoryVisible) }
    }

    private fun selectHistoryItem(item: CalculationHistoryItem, loadAsExpression: Boolean) {
        _state.update { currentState ->
            val newExpr = if (loadAsExpression) item.expression else item.result
            val liveRes = calculatePreview(newExpr, currentState.angleMode)
            currentState.copy(
                expression = newExpr,
                liveResult = liveRes,
                isHistoryVisible = false
            )
        }
    }

    private fun clearHistory() {
        _state.update { it.copy(history = emptyList()) }
    }

    private fun memoryClear() {
        _state.update { it.copy(memory = 0.0, hasMemory = false) }
    }

    private fun memoryRecall() {
        if (!_state.value.hasMemory) return
        appendSymbol(_state.value.memory.toString())
    }

    private fun memoryAdd() {
        val evalRes = evaluator.evaluate(_state.value.expression, _state.value.angleMode)
        if (evalRes is EvaluationResult.Success) {
            val newMem = _state.value.memory + evalRes.value
            _state.update { it.copy(memory = newMem, hasMemory = true) }
        }
    }

    private fun memorySubtract() {
        val evalRes = evaluator.evaluate(_state.value.expression, _state.value.angleMode)
        if (evalRes is EvaluationResult.Success) {
            val newMem = _state.value.memory - evalRes.value
            _state.update { it.copy(memory = newMem, hasMemory = true) }
        }
    }

    private fun memoryStore() {
        val evalRes = evaluator.evaluate(_state.value.expression, _state.value.angleMode)
        if (evalRes is EvaluationResult.Success) {
            _state.update { it.copy(memory = evalRes.value, hasMemory = true) }
        }
    }

    private fun calculatePreview(expr: String, angleMode: AngleMode): String {
        if (expr.isEmpty()) return ""
        return when (val res = evaluator.evaluate(expr, angleMode)) {
            is EvaluationResult.Success -> formatResult(res.value)
            is EvaluationResult.Error -> ""
        }
    }

    private fun formatResult(value: Double): String {
        return if (value % 1.0 == 0.0 && value.absoluteValue < 1e12) {
            value.toLong().toString()
        } else {
            // Trim precision nicely
            val s = String.format("%.8f", value).replace(Regex("0+$"), "").replace(Regex("\\.$"), "")
            s
        }
    }
}
