package com.change360.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
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
import com.change360.app.data.model.*
import com.change360.app.viewmodel.Change360ViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ChallengesScreen(viewModel: Change360ViewModel) {
    val uiState by viewModel.uiState.collectAsState()
    var selectedChallengeForDetails by remember { mutableStateOf<Challenge?>(null) }
    var reflectionText by remember { mutableStateOf("") }
    var selectedProofTier by remember { mutableStateOf(ProofTier.SELF_REPORTED_ACTION) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.surface)
    ) {
        // Search & Filter Header
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 8.dp)
        ) {
            OutlinedTextField(
                value = uiState.searchQuery,
                onValueChange = { viewModel.setSearchQuery(it) },
                placeholder = { Text("Search 20+ awareness challenges...", fontSize = 13.sp) },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null) },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                singleLine = true
            )

            Spacer(modifier = Modifier.height(8.dp))

            // Categories horizontal filter
            LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                item {
                    FilterChip(
                        selected = uiState.selectedCategoryFilter == null,
                        onClick = { viewModel.setCategoryFilter(null) },
                        label = { Text("All Causes", fontSize = 12.sp) }
                    )
                }
                items(AwarenessCategory.entries) { cat ->
                    FilterChip(
                        selected = uiState.selectedCategoryFilter == cat,
                        onClick = { viewModel.setCategoryFilter(cat) },
                        label = { Text(cat.displayName, fontSize = 12.sp) }
                    )
                }
            }
        }

        // Challenges List
        LazyColumn(
            modifier = Modifier
                .weight(1f)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
            contentPadding = PaddingValues(bottom = 90.dp)
        ) {
            items(uiState.challenges) { challenge ->
                ChallengeCardItem(
                    challenge = challenge,
                    onClick = { selectedChallengeForDetails = challenge }
                )
            }
        }
    }

    // Detail & Completion Modal
    selectedChallengeForDetails?.let { challenge ->
        AlertDialog(
            onDismissRequest = { selectedChallengeForDetails = null },
            title = {
                Text(
                    text = challenge.title,
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold
                )
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text(
                        text = "Category: ${challenge.category.displayName}",
                        style = MaterialTheme.typography.labelLarge,
                        color = MaterialTheme.colorScheme.primary
                    )
                    Text(
                        text = "Points: ${challenge.points} pts • ${challenge.estimatedDurationMinutes} mins • ${challenge.difficulty.name}",
                        style = MaterialTheme.typography.bodySmall,
                        color = Color.Gray
                    )
                    Divider()
                    Text(
                        text = "Objective:\n${challenge.learningObjective}",
                        style = MaterialTheme.typography.bodyMedium
                    )
                    Text(
                        text = "Instructions:\n${challenge.instructions}",
                        style = MaterialTheme.typography.bodySmall
                    )

                    if (challenge.status != ChallengeStatus.COMPLETED) {
                        OutlinedTextField(
                            value = reflectionText,
                            onValueChange = { reflectionText = it },
                            placeholder = { Text("Enter your reflection or action notes...", fontSize = 12.sp) },
                            modifier = Modifier.fillMaxWidth(),
                            maxLines = 3
                        )
                    } else {
                        Text(
                            text = "Status: Completed (${challenge.proofTier.title})",
                            color = Color(0xFF16A34A),
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            },
            confirmButton = {
                if (challenge.status == ChallengeStatus.NOT_STARTED) {
                    Button(onClick = {
                        viewModel.startChallenge(challenge.id)
                        selectedChallengeForDetails = null
                    }) {
                        Text("Start Challenge")
                    }
                } else if (challenge.status == ChallengeStatus.IN_PROGRESS) {
                    Button(onClick = {
                        viewModel.completeChallenge(
                            challenge.id,
                            reflectionText.ifBlank { "Action completed per challenge guidelines." },
                            selectedProofTier
                        )
                        reflectionText = ""
                        selectedChallengeForDetails = null
                    }) {
                        Text("Complete & Claim Points")
                    }
                } else {
                    TextButton(onClick = { selectedChallengeForDetails = null }) {
                        Text("Close")
                    }
                }
            },
            dismissButton = {
                TextButton(onClick = { selectedChallengeForDetails = null }) {
                    Text("Cancel")
                }
            }
        )
    }
}

@Composable
fun ChallengeCardItem(
    challenge: Challenge,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() },
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = challenge.category.displayName,
                    style = MaterialTheme.typography.labelLarge,
                    color = MaterialTheme.colorScheme.primary,
                    fontSize = 11.sp
                )
                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = when (challenge.status) {
                        ChallengeStatus.COMPLETED -> Color(0xFFDCFCE7)
                        ChallengeStatus.IN_PROGRESS -> Color(0xFFFEF3C7)
                        else -> MaterialTheme.colorScheme.surface
                    }
                ) {
                    Text(
                        text = when (challenge.status) {
                            ChallengeStatus.COMPLETED -> "Completed"
                            ChallengeStatus.IN_PROGRESS -> "In Progress"
                            else -> "Available"
                        },
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                        fontSize = 11.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = when (challenge.status) {
                            ChallengeStatus.COMPLETED -> Color(0xFF166534)
                            ChallengeStatus.IN_PROGRESS -> Color(0xFF92400E)
                            else -> Color.DarkGray
                        }
                    )
                }
            }

            Spacer(modifier = Modifier.height(6.dp))

            Text(
                text = challenge.title,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = challenge.shortDescription,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                maxLines = 2
            )

            Spacer(modifier = Modifier.height(10.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.Timer,
                        contentDescription = null,
                        modifier = Modifier.size(14.dp),
                        tint = Color.Gray
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "${challenge.estimatedDurationMinutes} mins",
                        fontSize = 11.sp,
                        color = Color.Gray
                    )
                }

                Surface(
                    shape = RoundedCornerShape(12.dp),
                    color = MaterialTheme.colorScheme.primary.copy(alpha = 0.15f)
                ) {
                    Text(
                        text = "+${challenge.points} pts",
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp),
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.primary
                    )
                }
            }
        }
    }
}
