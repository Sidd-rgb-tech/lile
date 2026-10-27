package com.example.scientificcalculator.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.expandVertically
import androidx.compose.animation.shrinkVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Backspace
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.SwapVert
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
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
        // Top Toolbar inside display
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                // Angle Mode Pill
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

        // Expression String
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

        // Preview or Error Result
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
                                    text = "= ${item.result}",
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
}
