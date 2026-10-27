package com.example.scientificcalculator.ui

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
import com.example.scientificcalculator.presentation.CalculatorState
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
            // Display Section
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

            // Keypad Container
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

                // Expandable Scientific Keypad Section
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

                // Standard Numeric + Operator Keypad Grid
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

    // Bottom Sheet for Calculation History
    if (state.isHistoryVisible) {
        CalculationHistorySheet(
            history = state.history,
            onSelectHistory = { item -> viewModel.onAction(CalculatorAction.SelectHistoryItem(item)) },
            onClearHistory = { viewModel.onAction(CalculatorAction.ClearHistory) },
            onDismiss = { viewModel.onAction(CalculatorAction.ToggleHistory) }
        )
    }
}
