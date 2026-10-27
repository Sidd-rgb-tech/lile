import { CodeFile } from '../types/calculator';

export const kotlinSourceFiles: CodeFile[] = [
  {
    name: 'MainActivity.kt',
    path: 'app/src/main/java/com/example/scientificcalculator/MainActivity.kt',
    language: 'kotlin',
    description: 'Android ComponentActivity entry point initializing Jetpack Compose theme and CalculatorScreen',
    content: `package com.example.scientificcalculator

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import com.example.scientificcalculator.presentation.CalculatorViewModel
import com.example.scientificcalculator.ui.CalculatorScreen
import com.example.scientificcalculator.ui.theme.ScientificCalculatorTheme

class MainActivity : ComponentActivity() {

    private val viewModel: CalculatorViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            ScientificCalculatorTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    CalculatorScreen(viewModel = viewModel)
                }
            }
        }
    }
}`
  },
  {
    name: 'CalculatorViewModel.kt',
    path: 'app/src/main/java/com/example/scientificcalculator/presentation/CalculatorViewModel.kt',
    language: 'kotlin',
    description: 'MVVM ViewModel managing CalculatorState via StateFlow and handling CalculatorActions',
    content: `package com.example.scientificcalculator.presentation

import androidx.lifecycle.ViewModel
import com.example.scientificcalculator.domain.AngleMode
import com.example.scientificcalculator.domain.EvaluationResult
import com.example.scientificcalculator.domain.ExpressionEvaluator
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlin.math.absoluteValue

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
            String.format("%.8f", value).replace(Regex("0+$"), "").replace(Regex("\\\\.$"), "")
        }
    }
}`
  },
  {
    name: 'CalculatorState.kt',
    path: 'app/src/main/java/com/example/scientificcalculator/presentation/CalculatorState.kt',
    language: 'kotlin',
    description: 'Immutable UI State holding current formula, preview result, history list, angle mode, and memory',
    content: `package com.example.scientificcalculator.presentation

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
)`
  },
  {
    name: 'CalculatorAction.kt',
    path: 'app/src/main/java/com/example/scientificcalculator/presentation/CalculatorAction.kt',
    language: 'kotlin',
    description: 'Sealed class representing user intents (symbol input, evaluation, DEG/RAD toggle, memory, history)',
    content: `package com.example.scientificcalculator.presentation

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
}`
  },
  {
    name: 'ExpressionEvaluator.kt',
    path: 'app/src/main/java/com/example/scientificcalculator/domain/ExpressionEvaluator.kt',
    language: 'kotlin',
    description: 'Shunting-yard algorithm (Dijkstra RPN) parser supporting trig, logs, power, factorial, and angle modes',
    content: `package com.example.scientificcalculator.domain

import kotlin.math.*

enum class AngleMode {
    DEG, RAD
}

sealed class EvaluationResult {
    data class Success(val value: Double) : EvaluationResult()
    data class Error(val message: String) : EvaluationResult()
}

class ExpressionEvaluator {

    fun evaluate(expression: String, angleMode: AngleMode): EvaluationResult {
        if (expression.isBlank()) return EvaluationResult.Success(0.0)

        return try {
            val tokens = tokenize(expression)
            val rpn = shuntingYard(tokens)
            val result = evaluateRPN(rpn, angleMode)
            if (result.isNaN() || result.isInfinite()) {
                EvaluationResult.Error("Undefined")
            } else {
                EvaluationResult.Success(result)
            }
        } catch (e: ArithmeticException) {
            EvaluationResult.Error(e.message ?: "Math Error")
        } catch (e: Exception) {
            EvaluationResult.Error("Syntax Error")
        }
    }

    private sealed class Token {
        data class Number(val value: Double) : Token()
        data class Operator(val symbol: String, val precedence: Int, val rightAssociative: Boolean) : Token()
        data class Function(val name: String) : Token()
        object LeftParen : Token()
        object RightParen : Token()
        object ConstantPi : Token()
        object ConstantE : Token()
    }

    private fun tokenize(expr: String): List<Token> {
        val tokens = mutableListOf<Token>()
        var i = 0
        val sanitized = expr.replace("×", "*")
            .replace("÷", "/")
            .replace("−", "-")
            .replace("π", "PI")
            .replace("√", "sqrt")

        while (i < sanitized.length) {
            val c = sanitized[i]

            when {
                c.isWhitespace() -> i++

                c.isDigit() || c == '.' -> {
                    val sb = StringBuilder()
                    while (i < sanitized.length && (sanitized[i].isDigit() || sanitized[i] == '.')) {
                        sb.append(sanitized[i])
                        i++
                    }
                    tokens.add(Token.Number(sb.toString().toDouble()))
                }

                c == '(' -> {
                    if (tokens.isNotEmpty()) {
                        val last = tokens.last()
                        if (last is Token.Number || last is Token.RightParen || last is Token.ConstantPi || last is Token.ConstantE) {
                            tokens.add(Token.Operator("*", 2, false))
                        }
                    }
                    tokens.add(Token.LeftParen)
                    i++
                }

                c == ')' -> {
                    tokens.add(Token.RightParen)
                    i++
                }

                c == '+' || c == '-' || c == '*' || c == '/' || c == '%' || c == '^' || c == '!' -> {
                    val isUnaryMinus = (c == '-') && (tokens.isEmpty() ||
                            tokens.last() is Token.LeftParen ||
                            tokens.last() is Token.Operator)

                    if (isUnaryMinus) {
                        tokens.add(Token.Number(0.0))
                        tokens.add(Token.Operator("-", 2, false))
                    } else {
                        val prec = when (c) {
                            '+', '-' -> 1
                            '*', '/', '%' -> 2
                            '^' -> 3
                            '!' -> 4
                            else -> 1
                        }
                        val rightAssoc = (c == '^')
                        tokens.add(Token.Operator(c.toString(), prec, rightAssoc))
                    }
                    i++
                }

                c.isLetter() -> {
                    val sb = StringBuilder()
                    while (i < sanitized.length && sanitized[i].isLetter()) {
                        sb.append(sanitized[i])
                        i++
                    }
                    val name = sb.toString()
                    when (name.uppercase()) {
                        "PI" -> tokens.add(Token.ConstantPi)
                        "E" -> tokens.add(Token.ConstantE)
                        else -> tokens.add(Token.Function(name.lowercase()))
                    }
                }

                else -> i++
            }
        }
        return tokens
    }

    private fun shuntingYard(tokens: List<Token>): List<Token> {
        val output = mutableListOf<Token>()
        val stack = ArrayDeque<Token>()

        for (token in tokens) {
            when (token) {
                is Token.Number, is Token.ConstantPi, is Token.ConstantE -> output.add(token)
                is Token.Function -> stack.addLast(token)
                is Token.Operator -> {
                    while (stack.isNotEmpty()) {
                        val top = stack.last()
                        if (top is Token.Operator &&
                            ((!token.rightAssociative && token.precedence <= top.precedence) ||
                                    (token.rightAssociative && token.precedence < top.precedence))
                        ) {
                            output.add(stack.removeLast())
                        } else if (top is Token.Function) {
                            output.add(stack.removeLast())
                        } else {
                            break
                        }
                    }
                    stack.addLast(token)
                }
                is Token.LeftParen -> stack.addLast(token)
                is Token.RightParen -> {
                    while (stack.isNotEmpty() && stack.last() !is Token.LeftParen) {
                        output.add(stack.removeLast())
                    }
                    if (stack.isNotEmpty() && stack.last() is Token.LeftParen) {
                        stack.removeLast()
                    }
                    if (stack.isNotEmpty() && stack.last() is Token.Function) {
                        output.add(stack.removeLast())
                    }
                }
            }
        }

        while (stack.isNotEmpty()) {
            val top = stack.removeLast()
            if (top !is Token.LeftParen && top !is Token.RightParen) {
                output.add(top)
            }
        }

        return output
    }

    private fun evaluateRPN(tokens: List<Token>, angleMode: AngleMode): Double {
        val stack = ArrayDeque<Double>()

        for (token in tokens) {
            when (token) {
                is Token.Number -> stack.addLast(token.value)
                is Token.ConstantPi -> stack.addLast(PI)
                is Token.ConstantE -> stack.addLast(E)
                is Token.Operator -> {
                    if (token.symbol == "!") {
                        val a = stack.removeLastOrNull() ?: throw IllegalArgumentException("Invalid factorial")
                        stack.addLast(factorial(a))
                    } else {
                        val b = stack.removeLastOrNull() ?: throw IllegalArgumentException("Missing operand")
                        val a = stack.removeLastOrNull() ?: throw IllegalArgumentException("Missing operand")
                        val res = when (token.symbol) {
                            "+" -> a + b
                            "-" -> a - b
                            "*" -> a * b
                            "/" -> {
                                if (b == 0.0) throw ArithmeticException("Divide by zero")
                                a / b
                            }
                            "%" -> a % b
                            "^" -> a.pow(b)
                            else -> 0.0
                        }
                        stack.addLast(res)
                    }
                }
                is Token.Function -> {
                    val a = stack.removeLastOrNull() ?: throw IllegalArgumentException("Missing function arg")
                    val rad = if (angleMode == AngleMode.DEG) Math.toRadians(a) else a
                    val res = when (token.name) {
                        "sin" -> sin(rad)
                        "cos" -> cos(rad)
                        "tan" -> tan(rad)
                        "asin" -> {
                            val v = asin(a)
                            if (angleMode == AngleMode.DEG) Math.toDegrees(v) else v
                        }
                        "acos" -> {
                            val v = acos(a)
                            if (angleMode == AngleMode.DEG) Math.toDegrees(v) else v
                        }
                        "atan" -> {
                            val v = atan(a)
                            if (angleMode == AngleMode.DEG) Math.toDegrees(v) else v
                        }
                        "log", "log10" -> log10(a)
                        "ln" -> ln(a)
                        "sqrt" -> sqrt(a)
                        "abs" -> abs(a)
                        else -> throw IllegalArgumentException("Unknown function \${token.name}")
                    }
                    stack.addLast(res)
                }
                else -> {}
            }
        }

        return stack.removeLastOrNull() ?: 0.0
    }

    private fun factorial(n: Double): Double {
        if (n < 0 || n != floor(n)) throw ArithmeticException("Invalid Factorial")
        if (n > 170) throw ArithmeticException("Overflow")
        var result = 1.0
        for (i in 2..n.toInt()) {
            result *= i
        }
        return result
    }
}`
  },
  {
    name: 'CalculatorScreen.kt',
    path: 'app/src/main/java/com/example/scientificcalculator/ui/CalculatorScreen.kt',
    language: 'kotlin',
    description: 'Jetpack Compose main screen with Scaffold, Display, Memory bar, Scientific Keypad, and History Sheet',
    content: `package com.example.scientificcalculator.ui

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.expandVertically
import androidx.compose.animation.shrinkVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.example.scientificcalculator.presentation.CalculatorAction
import com.example.scientificcalculator.presentation.CalculatorViewModel
import com.example.scientificcalculator.ui.components.ButtonType
import com.example.scientificcalculator.ui.components.CalculationHistorySheet
import com.example.scientificcalculator.ui.components.CalculatorButton
import com.example.scientificcalculator.ui.components.CalculatorDisplay

@Composable
fun CalculatorScreen(
    viewModel: CalculatorViewModel,
    modifier: Modifier = Modifier
) {
    val state by viewModel.state.collectAsState()

    Scaffold(
        modifier = modifier.fillMaxSize(),
        containerColor = MaterialTheme.colorScheme.surface
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            CalculatorDisplay(
                expression = state.expression,
                previewResult = state.liveResult,
                angleMode = state.angleMode,
                hasMemory = state.hasMemory,
                errorMessage = state.errorMessage,
                onToggleAngleMode = { viewModel.onAction(CalculatorAction.ToggleAngleMode) },
                onToggleHistory = { viewModel.onAction(CalculatorAction.ToggleHistory) },
                onToggleScientific = { viewModel.onAction(CalculatorAction.ToggleScientificKeypad) },
                modifier = Modifier.weight(1f)
            )

            Divider(color = MaterialTheme.colorScheme.outlineVariant)

            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(MaterialTheme.colorScheme.surface)
                    .padding(12.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                // Memory Row
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    val memButtons = listOf(
                        "MC" to CalculatorAction.MemoryClear,
                        "MR" to CalculatorAction.MemoryRecall,
                        "M+" to CalculatorAction.MemoryAdd,
                        "M-" to CalculatorAction.MemorySubtract,
                        "MS" to CalculatorAction.MemoryStore
                    )
                    memButtons.forEach { (label, action) ->
                        CalculatorButton(
                            text = label,
                            modifier = Modifier.weight(1f),
                            type = ButtonType.MEMORY,
                            onClick = { viewModel.onAction(action) }
                        )
                    }
                }

                // Expandable Scientific Keypad
                AnimatedVisibility(
                    visible = state.isScientificExpanded,
                    enter = expandVertically(),
                    exit = shrinkVertically()
                ) {
                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            CalculatorButton("sin", Modifier.weight(1f), ButtonType.FUNCTION) { viewModel.onAction(CalculatorAction.EnterFunction("sin")) }
                            CalculatorButton("cos", Modifier.weight(1f), ButtonType.FUNCTION) { viewModel.onAction(CalculatorAction.EnterFunction("cos")) }
                            CalculatorButton("tan", Modifier.weight(1f), ButtonType.FUNCTION) { viewModel.onAction(CalculatorAction.EnterFunction("tan")) }
                            CalculatorButton("ln", Modifier.weight(1f), ButtonType.FUNCTION) { viewModel.onAction(CalculatorAction.EnterFunction("ln")) }
                            CalculatorButton("log", Modifier.weight(1f), ButtonType.FUNCTION) { viewModel.onAction(CalculatorAction.EnterFunction("log")) }
                        }
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            CalculatorButton("√", Modifier.weight(1f), ButtonType.FUNCTION) { viewModel.onAction(CalculatorAction.EnterFunction("√")) }
                            CalculatorButton("xʸ", Modifier.weight(1f), ButtonType.FUNCTION) { viewModel.onAction(CalculatorAction.EnterFunction("xʸ")) }
                            CalculatorButton("x²", Modifier.weight(1f), ButtonType.FUNCTION) { viewModel.onAction(CalculatorAction.EnterFunction("x²")) }
                            CalculatorButton("π", Modifier.weight(1f), ButtonType.FUNCTION) { viewModel.onAction(CalculatorAction.EnterSymbol("π")) }
                            CalculatorButton("e", Modifier.weight(1f), ButtonType.FUNCTION) { viewModel.onAction(CalculatorAction.EnterSymbol("e")) }
                        }
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            CalculatorButton("(", Modifier.weight(1f), ButtonType.FUNCTION) { viewModel.onAction(CalculatorAction.EnterSymbol("(")) }
                            CalculatorButton(")", Modifier.weight(1f), ButtonType.FUNCTION) { viewModel.onAction(CalculatorAction.EnterSymbol(")")) }
                            CalculatorButton("x!", Modifier.weight(1f), ButtonType.FUNCTION) { viewModel.onAction(CalculatorAction.EnterFunction("x!")) }
                            CalculatorButton("1/x", Modifier.weight(1f), ButtonType.FUNCTION) { viewModel.onAction(CalculatorAction.EnterFunction("1/x")) }
                            CalculatorButton("|x|", Modifier.weight(1f), ButtonType.FUNCTION) { viewModel.onAction(CalculatorAction.EnterFunction("|")) }
                        }
                    }
                }

                // Numeric Keypad Grid
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    CalculatorButton("AC", Modifier.weight(1f), ButtonType.ACTION) { viewModel.onAction(CalculatorAction.Clear) }
                    CalculatorButton("⌫", Modifier.weight(1f), ButtonType.ACTION) { viewModel.onAction(CalculatorAction.Delete) }
                    CalculatorButton("%", Modifier.weight(1f), ButtonType.OPERATOR) { viewModel.onAction(CalculatorAction.EnterSymbol("%")) }
                    CalculatorButton("÷", Modifier.weight(1f), ButtonType.OPERATOR) { viewModel.onAction(CalculatorAction.EnterSymbol("÷")) }
                }

                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    CalculatorButton("7", Modifier.weight(1f), ButtonType.NUMBER) { viewModel.onAction(CalculatorAction.EnterSymbol("7")) }
                    CalculatorButton("8", Modifier.weight(1f), ButtonType.NUMBER) { viewModel.onAction(CalculatorAction.EnterSymbol("8")) }
                    CalculatorButton("9", Modifier.weight(1f), ButtonType.NUMBER) { viewModel.onAction(CalculatorAction.EnterSymbol("9")) }
                    CalculatorButton("×", Modifier.weight(1f), ButtonType.OPERATOR) { viewModel.onAction(CalculatorAction.EnterSymbol("×")) }
                }

                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    CalculatorButton("4", Modifier.weight(1f), ButtonType.NUMBER) { viewModel.onAction(CalculatorAction.EnterSymbol("4")) }
                    CalculatorButton("5", Modifier.weight(1f), ButtonType.NUMBER) { viewModel.onAction(CalculatorAction.EnterSymbol("5")) }
                    CalculatorButton("6", Modifier.weight(1f), ButtonType.NUMBER) { viewModel.onAction(CalculatorAction.EnterSymbol("6")) }
                    CalculatorButton("−", Modifier.weight(1f), ButtonType.OPERATOR) { viewModel.onAction(CalculatorAction.EnterSymbol("−")) }
                }

                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    CalculatorButton("1", Modifier.weight(1f), ButtonType.NUMBER) { viewModel.onAction(CalculatorAction.EnterSymbol("1")) }
                    CalculatorButton("2", Modifier.weight(1f), ButtonType.NUMBER) { viewModel.onAction(CalculatorAction.EnterSymbol("2")) }
                    CalculatorButton("3", Modifier.weight(1f), ButtonType.NUMBER) { viewModel.onAction(CalculatorAction.EnterSymbol("3")) }
                    CalculatorButton("+", Modifier.weight(1f), ButtonType.OPERATOR) { viewModel.onAction(CalculatorAction.EnterSymbol("+")) }
                }

                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    CalculatorButton("0", Modifier.weight(2f), ButtonType.NUMBER) { viewModel.onAction(CalculatorAction.EnterSymbol("0")) }
                    CalculatorButton(".", Modifier.weight(1f), ButtonType.NUMBER) { viewModel.onAction(CalculatorAction.EnterSymbol(".")) }
                    CalculatorButton("=", Modifier.weight(1f), ButtonType.EQUALS) { viewModel.onAction(CalculatorAction.Evaluate) }
                }
            }
        }
    }

    if (state.isHistoryVisible) {
        CalculationHistorySheet(
            history = state.history,
            onSelectHistory = { item -> viewModel.onAction(CalculatorAction.SelectHistoryItem(item)) },
            onClearHistory = { viewModel.onAction(CalculatorAction.ClearHistory) },
            onDismiss = { viewModel.onAction(CalculatorAction.ToggleHistory) }
        )
    }
}`
  },
  {
    name: 'Components.kt',
    path: 'app/src/main/java/com/example/scientificcalculator/ui/components/Components.kt',
    language: 'kotlin',
    description: 'Modular Jetpack Compose components: CalculatorButton with ripple feedback, Display, and ModalBottomSheet',
    content: `package com.example.scientificcalculator.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.SwapVert
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.scientificcalculator.domain.AngleMode
import com.example.scientificcalculator.presentation.CalculationHistoryItem

enum class ButtonType {
    NUMBER, OPERATOR, FUNCTION, ACTION, EQUALS, MEMORY
}

@Composable
fun CalculatorButton(
    text: String,
    modifier: Modifier = Modifier,
    type: ButtonType = ButtonType.NUMBER,
    shape: Shape = RoundedCornerShape(20.dp),
    onClick: () -> Unit
) {
    val containerColor = when (type) {
        ButtonType.NUMBER -> MaterialTheme.colorScheme.surfaceVariant
        ButtonType.OPERATOR -> MaterialTheme.colorScheme.primaryContainer
        ButtonType.FUNCTION -> MaterialTheme.colorScheme.secondaryContainer
        ButtonType.ACTION -> MaterialTheme.colorScheme.errorContainer
        ButtonType.EQUALS -> MaterialTheme.colorScheme.primary
        ButtonType.MEMORY -> MaterialTheme.colorScheme.tertiaryContainer
    }

    val contentColor = when (type) {
        ButtonType.NUMBER -> MaterialTheme.colorScheme.onSurfaceVariant
        ButtonType.OPERATOR -> MaterialTheme.colorScheme.onPrimaryContainer
        ButtonType.FUNCTION -> MaterialTheme.colorScheme.onSecondaryContainer
        ButtonType.ACTION -> MaterialTheme.colorScheme.onErrorContainer
        ButtonType.EQUALS -> MaterialTheme.colorScheme.onPrimary
        ButtonType.MEMORY -> MaterialTheme.colorScheme.onTertiaryContainer
    }

    Surface(
        onClick = onClick,
        modifier = modifier.height(64.dp),
        shape = shape,
        color = containerColor,
        contentColor = contentColor,
        tonalElevation = 2.dp
    ) {
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier.fillMaxSize()
        ) {
            Text(
                text = text,
                fontSize = if (text.length > 3) 15.sp else 20.sp,
                fontWeight = if (type == ButtonType.EQUALS || type == ButtonType.OPERATOR) FontWeight.Bold else FontWeight.Medium,
                fontFamily = FontFamily.Monospace
            )
        }
    }
}

@Composable
fun CalculatorDisplay(
    expression: String,
    previewResult: String,
    angleMode: AngleMode,
    hasMemory: Boolean,
    errorMessage: String?,
    onToggleAngleMode: () -> Unit,
    onToggleHistory: () -> Unit,
    onToggleScientific: () -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .background(MaterialTheme.colorScheme.surface)
            .padding(20.dp),
        verticalArrangement = Arrangement.Bottom
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                AssistChip(
                    onClick = onToggleAngleMode,
                    label = { Text(text = angleMode.name, fontWeight = FontWeight.Bold, fontSize = 12.sp) },
                    colors = AssistChipDefaults.assistChipColors(
                        containerColor = MaterialTheme.colorScheme.primaryContainer,
                        labelColor = MaterialTheme.colorScheme.onPrimaryContainer
                    )
                )

                if (hasMemory) {
                    SuggestionChip(
                        onClick = {},
                        label = { Text("M", fontWeight = FontWeight.Bold, fontSize = 12.sp) }
                    )
                }
            }

            Row {
                IconButton(onClick = onToggleScientific) {
                    Icon(Icons.Default.SwapVert, contentDescription = "Toggle Scientific")
                }
                IconButton(onClick = onToggleHistory) {
                    Icon(Icons.Default.History, contentDescription = "History")
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = expression.ifEmpty { "0" },
            modifier = Modifier.fillMaxWidth(),
            textAlign = TextAlign.End,
            fontSize = if (expression.length > 18) 28.sp else 38.sp,
            fontWeight = FontWeight.Light,
            fontFamily = FontFamily.Monospace,
            color = MaterialTheme.colorScheme.onSurface,
            maxLines = 3,
            overflow = TextOverflow.Ellipsis
        )

        Spacer(modifier = Modifier.height(8.dp))

        if (errorMessage != null) {
            Text(
                text = errorMessage,
                modifier = Modifier.fillMaxWidth(),
                textAlign = TextAlign.End,
                fontSize = 20.sp,
                fontWeight = FontWeight.Medium,
                color = MaterialTheme.colorScheme.error
            )
        } else if (previewResult.isNotEmpty()) {
            Text(
                text = "= $previewResult",
                modifier = Modifier.fillMaxWidth(),
                textAlign = TextAlign.End,
                fontSize = 26.sp,
                fontWeight = FontWeight.Normal,
                fontFamily = FontFamily.Monospace,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        } else {
            Spacer(modifier = Modifier.height(32.dp))
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CalculationHistorySheet(
    history: List<CalculationHistoryItem>,
    onSelectHistory: (CalculationHistoryItem) -> Unit,
    onClearHistory: () -> Unit,
    onDismiss: () -> Unit
) {
    ModalBottomSheet(
        onDismissRequest = onDismiss,
        sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(20.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Calculation History",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold
                )

                if (history.isNotEmpty()) {
                    TextButton(onClick = onClearHistory) {
                        Icon(Icons.Default.Delete, contentDescription = null, modifier = Modifier.size(18.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Clear")
                    }
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            if (history.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(200.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "No calculations yet",
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            } else {
                LazyColumn(
                    modifier = Modifier.fillMaxHeight(0.6f),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(history) { item ->
                        Surface(
                            onClick = { onSelectHistory(item) },
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(16.dp),
                            color = MaterialTheme.colorScheme.surfaceVariant
                        ) {
                            Column(
                                modifier = Modifier.padding(16.dp)
                            ) {
                                Text(
                                    text = item.expression,
                                    fontSize = 16.sp,
                                    fontFamily = FontFamily.Monospace,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                    textAlign = TextAlign.End,
                                    modifier = Modifier.fillMaxWidth()
                                )
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = "= \${item.result}",
                                    fontSize = 20.sp,
                                    fontWeight = FontWeight.Bold,
                                    fontFamily = FontFamily.Monospace,
                                    color = MaterialTheme.colorScheme.primary,
                                    textAlign = TextAlign.End,
                                    modifier = Modifier.fillMaxWidth()
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}`
  },
  {
    name: 'Theme.kt',
    path: 'app/src/main/java/com/example/scientificcalculator/ui/theme/Theme.kt',
    language: 'kotlin',
    description: 'Material Design 3 Theme configuration supporting dynamic color extraction on Android 12+',
    content: `package com.example.scientificcalculator.ui.theme

import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext

private val DarkColorScheme = darkColorScheme(
    primary = Color(0xFFA8C7FF),
    onPrimary = Color(0xFF003062),
    primaryContainer = Color(0xFF00468A),
    onPrimaryContainer = Color(0xFFD6E3FF),
    secondary = Color(0xFF4FD8EB),
    onSecondary = Color(0xFF00363D),
    secondaryContainer = Color(0xFF004F58),
    onSecondaryContainer = Color(0xFF97F0FF),
    tertiary = Color(0xFFE0C1FF),
    onTertiary = Color(0xFF481C70),
    surface = Color(0xFF111318),
    onSurface = Color(0xFFE2E2E9),
    surfaceVariant = Color(0xFF1A1C23),
    onSurfaceVariant = Color(0xFFC4C6D0),
    outline = Color(0xFF8E9099)
)

private val LightColorScheme = lightColorScheme(
    primary = Color(0xFF005AC1),
    onPrimary = Color(0xFFFFFFFF),
    primaryContainer = Color(0xFFD6E3FF),
    onPrimaryContainer = Color(0xFF001B3E),
    secondary = Color(0xFF006874),
    onSecondary = Color(0xFFFFFFFF),
    secondaryContainer = Color(0xFF97F0FF),
    onSecondaryContainer = Color(0xFF001F24),
    tertiary = Color(0xFF7A4BAB),
    surface = Color(0xFFF9F9FF),
    onSurface = Color(0xFF191C20),
    surfaceVariant = Color(0xFFE1E2EC),
    onSurfaceVariant = Color(0xFF44474F),
    outline = Color(0xFF74777F)
)

@Composable
fun ScientificCalculatorTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = true,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }
        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }

    MaterialTheme(
        colorScheme = colorScheme,
        content = content
    )
}`
  },
  {
    name: 'build.gradle.kts',
    path: 'app/build.gradle.kts',
    language: 'groovy',
    description: 'Gradle build dependencies for Android 15 SDK, Compose BOM, and Material 3',
    content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "com.example.scientificcalculator"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.example.scientificcalculator"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
    }
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.ui.graphics)
    implementation(libs.androidx.ui.tooling.preview)
    implementation(libs.androidx.material3)
    implementation(libs.androidx.lifecycle.viewmodel.compose)
    implementation("androidx.compose.material:material-icons-extended:1.7.5")
}`
  }
];
