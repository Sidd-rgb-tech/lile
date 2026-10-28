package com.change360.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.change360.app.ai.GeminiAiService
import com.change360.app.viewmodel.Change360ViewModel
import kotlinx.coroutines.launch

data class ChatMessage(
    val id: String = java.util.UUID.randomUUID().toString(),
    val text: String,
    val isUser: Boolean,
    val isDemoNotice: Boolean = false,
    val mode: GeminiAiService.AssistantMode = GeminiAiService.AssistantMode.EXPLAIN_SIMPLY
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AIAssistantScreen(
    viewModel: Change360ViewModel,
    aiService: GeminiAiService = remember { GeminiAiService() }
) {
    var messages by remember {
        mutableStateOf(
            listOf(
                ChatMessage(
                    text = "Hello! I am your CHANGE360 Awareness Assistant. I can help explain social issues simply, provide in-depth analysis, create practical action roadmaps, or quiz your knowledge across 20 awareness areas. What would you like to explore today?",
                    isUser = false
                )
            )
        )
    }

    var selectedMode by remember { mutableStateOf(GeminiAiService.AssistantMode.EXPLAIN_SIMPLY) }
    var inputText by remember { mutableStateOf("") }
    var isThinking by remember { mutableStateOf(false) }
    val coroutineScope = rememberCoroutineScope()

    val suggestedQuestions = listOf(
        "How can I reduce plastic waste?",
        "How can I identify online scams?",
        "How can I promote road safety?",
        "What can students do to improve their community?",
        "How can I support someone experiencing cyberbullying?",
        "What are simple habits for better mental health?"
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.surface)
    ) {
        // Mode Selector Chips
        LazyRow(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 8.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            item {
                FilterChip(
                    selected = selectedMode == GeminiAiService.AssistantMode.EXPLAIN_SIMPLY,
                    onClick = { selectedMode = GeminiAiService.AssistantMode.EXPLAIN_SIMPLY },
                    label = { Text("Explain Simply", fontSize = 12.sp) }
                )
            }
            item {
                FilterChip(
                    selected = selectedMode == GeminiAiService.AssistantMode.DETAILED,
                    onClick = { selectedMode = GeminiAiService.AssistantMode.DETAILED },
                    label = { Text("Detailed Explanation", fontSize = 12.sp) }
                )
            }
            item {
                FilterChip(
                    selected = selectedMode == GeminiAiService.AssistantMode.ACTION_GUIDE,
                    onClick = { selectedMode = GeminiAiService.AssistantMode.ACTION_GUIDE },
                    label = { Text("Action Guide", fontSize = 12.sp) }
                )
            }
            item {
                FilterChip(
                    selected = selectedMode == GeminiAiService.AssistantMode.QUIZ_ME,
                    onClick = { selectedMode = GeminiAiService.AssistantMode.QUIZ_ME },
                    label = { Text("Quiz Me", fontSize = 12.sp) }
                )
            }
        }

        // Chat message list
        LazyColumn(
            modifier = Modifier
                .weight(1f)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
            contentPadding = PaddingValues(vertical = 12.dp)
        ) {
            items(messages) { msg ->
                ChatBubble(message = msg)
            }

            if (isThinking) {
                item {
                    Row(
                        modifier = Modifier.padding(8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        CircularProgressIndicator(modifier = Modifier.size(20.dp), strokeWidth = 2.dp)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Thinking...", fontSize = 13.sp, color = MaterialTheme.colorScheme.primary)
                    }
                }
            }
        }

        // Suggested questions scroll
        LazyRow(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 12.dp, vertical = 4.dp),
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            items(suggestedQuestions) { question ->
                SuggestionChip(
                    onClick = {
                        inputText = question
                    },
                    label = { Text(question, fontSize = 11.sp) }
                )
            }
        }

        // Bottom Input Row
        Surface(
            tonalElevation = 4.dp,
            modifier = Modifier.fillMaxWidth()
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 12.dp, vertical = 8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                OutlinedTextField(
                    value = inputText,
                    onValueChange = { inputText = it },
                    placeholder = { Text("Ask about any social cause...", fontSize = 13.sp) },
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(24.dp),
                    maxLines = 3
                )
                Spacer(modifier = Modifier.width(8.dp))
                IconButton(
                    onClick = {
                        if (inputText.isNotBlank() && !isThinking) {
                            val userMsg = inputText.trim()
                            inputText = ""
                            messages = messages + ChatMessage(text = userMsg, isUser = true)
                            isThinking = true

                            coroutineScope.launch {
                                val response = aiService.queryAssistant(userMsg, selectedMode, "General Awareness")
                                isThinking = false
                                messages = messages + ChatMessage(
                                    text = response.reply,
                                    isUser = false,
                                    isDemoNotice = !response.isLiveAi
                                )
                            }
                        }
                    },
                    modifier = Modifier
                        .clip(RoundedCornerShape(20.dp))
                        .background(MaterialTheme.colorScheme.primary)
                ) {
                    Icon(
                        imageVector = Icons.Default.Send,
                        contentDescription = "Send",
                        tint = Color.White
                    )
                }
            }
        }
    }
}

@Composable
fun ChatBubble(message: ChatMessage) {
    val alignment = if (message.isUser) Alignment.End else Alignment.Start
    val bgColor = if (message.isUser) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.surfaceVariant
    val textColor = if (message.isUser) Color.White else MaterialTheme.colorScheme.onSurfaceVariant

    Column(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = alignment
    ) {
        Box(
            modifier = Modifier
                .clip(
                    RoundedCornerShape(
                        topStart = 16.dp,
                        topEnd = 16.dp,
                        bottomStart = if (message.isUser) 16.dp else 4.dp,
                        bottomEnd = if (message.isUser) 4.dp else 16.dp
                    )
                )
                .background(bgColor)
                .padding(14.dp)
                .widthIn(max = 300.dp)
        ) {
            Text(
                text = message.text,
                color = textColor,
                fontSize = 14.sp,
                lineHeight = 20.sp
            )
        }
    }
}
